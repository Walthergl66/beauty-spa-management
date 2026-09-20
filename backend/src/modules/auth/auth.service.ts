import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto, TokensDto } from './dto/auth-response.dto.js';
import { UserResponseDto } from '../users/dto/user-response.dto.js';
import { Role } from '../../common/enums/role.enum.js';
import { SessionService } from './sessions/session.service.js';
import { SessionDto } from './dto/session.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

interface TokenPayload {
  sub: string;
  email?: string;
  role?: string;
  ver?: number;
  sid?: string;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('dummy-timing-equalizer', 10);

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {}

  async onApplicationBootstrap() {
    const forceSeed = this.configService.get<string>('SEED_ADMIN') === 'true';
    if (
      this.configService.get<string>('NODE_ENV') === 'production' &&
      !forceSeed
    ) {
      this.logger.log(
        'Seed de administrador omitido en producción (define SEED_ADMIN=true para forzarlo)',
      );
      return;
    }
    await this.seedAdmin();
  }

  async hashData(data: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(data, saltRounds);
  }

  async compareData(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new BadRequestException('El correo ya se encuentra registrado');
    }

    const passwordHash = await this.hashData(registerDto.password);
    const user = await this.usersService.create(
      {
        email: registerDto.email,
        password: registerDto.password,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        role: Role.CLIENT,
      },
      passwordHash,
    );

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.tokenVersion ?? 0,
    );
    await this.persistTokens(user.id, tokens);

    return {
      user: UserResponseDto.fromEntity(user),
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      await this.compareData(loginDto.password, DUMMY_PASSWORD_HASH);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const now = new Date();
    if (user.lockedUntil && user.lockedUntil > now) {
      const remainingMinutes = Math.ceil(
        (user.lockedUntil.getTime() - now.getTime()) / 60000,
      );
      throw new HttpException(
        `Cuenta bloqueada temporalmente por demasiados intentos fallidos. Inténtalo en ${remainingMinutes} min`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta se encuentra desactivada');
    }

    const passwordMatches = await this.compareData(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      const attempts = (user.failedLoginAttempts ?? 0) + 1;
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date(
          now.getTime() + LOCKOUT_MINUTES * 60 * 1000,
        );
        await this.usersService.updateLoginSecurity(user.id, 0, lockedUntil);
        throw new HttpException(
          `Cuenta bloqueada temporalmente por ${MAX_LOGIN_ATTEMPTS} intentos fallidos. Inténtalo en ${LOCKOUT_MINUTES} min`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      await this.usersService.updateLoginSecurity(user.id, attempts, null);
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if ((user.failedLoginAttempts ?? 0) > 0) {
      await this.usersService.updateLoginSecurity(user.id, 0, null);
    }

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.tokenVersion ?? 0,
    );
    await this.persistTokens(user.id, tokens);

    return {
      user: UserResponseDto.fromEntity(user),
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokensDto> {
    let payload: TokenPayload;
    try {
      const refreshSecret =
        this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
      payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        { secret: refreshSecret },
      );
    } catch {
      throw new ForbiddenException('Token de actualización inválido o expirado');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new ForbiddenException('Acceso denegado');
    }

    if (payload.sid) {
      const session = await this.sessionService.findValidById(
        payload.sid,
        user.id,
      );
      if (!session) {
        throw new ForbiddenException('Acceso denegado');
      }
      if (!this.compareRefreshTokens(refreshToken, session.refreshHash)) {
        throw new ForbiddenException('Token de actualización inválido o expirado');
      }

      const tokens = await this.generateTokens(
        user.id,
        user.email,
        user.role,
        user.tokenVersion ?? 0,
        payload.sid,
      );
      await this.sessionService.rotate(
        payload.sid,
        this.hashRefreshToken(tokens.refreshToken),
        this.sessionExpiry(),
      );
      return tokens;
    }

    throw new ForbiddenException('Token de actualización inválido o expirado');
  }

  async logout(
    userId: string,
    sessionId?: string,
    all?: boolean,
  ): Promise<{ message: string }> {
    if (all) {
      await this.usersService.incrementTokenVersion(userId);
      await this.sessionService.deleteAllForUser(userId);
      return { message: 'Todas las sesiones cerradas exitosamente' };
    }

    if (!sessionId) {
      throw new BadRequestException('sessionId es requerido');
    }
    const deleted = await this.sessionService.deleteByIdAndUser(
      sessionId,
      userId,
    );
    if (!deleted) {
      throw new NotFoundException('Sesión no encontrada');
    }
    return { message: 'Sesión cerrada exitosamente' };
  }

  async listSessions(userId: string): Promise<SessionDto[]> {
    const sessions = await this.sessionService.listActiveForUser(userId);
    return sessions.map((session) => SessionDto.fromEntity(session));
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);
    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta se encuentra desactivada');
    }

    const matches = await this.compareData(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    const passwordHash = await this.hashData(dto.newPassword);
    await this.usersService.updatePassword(userId, passwordHash);
    await this.usersService.incrementTokenVersion(userId);
    await this.sessionService.deleteAllForUser(userId);

    return { message: 'Contraseña actualizada correctamente. Vuelve a iniciar sesión' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    tokenVersion: number,
    sessionId: string = randomUUID(),
  ): Promise<TokensDto> {
    const payload = {
      sub: userId,
      email,
      role,
      jti: randomUUID(),
      ver: tokenVersion,
      sid: sessionId,
    };

    const accessSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    const accessExpiresIn = this.parseExpiresIn(
      this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    );
    const refreshExpiresIn = this.parseExpiresIn(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpiresIn,
      sessionId,
    };
  }

  private sessionExpiry(): Date {
    const refreshExpiresIn = this.parseExpiresIn(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    );
    return new Date(Date.now() + refreshExpiresIn * 1000);
  }

  private async persistTokens(
    userId: string,
    tokens: TokensDto,
  ): Promise<void> {
    await this.sessionService.create(
      userId,
      this.hashRefreshToken(tokens.refreshToken),
      this.sessionExpiry(),
      { id: tokens.sessionId },
    );
  }

  private parseExpiresIn(value: string): number {
    const match = /^(\d+)(s|m|h|d)?$/.exec(value.trim());
    if (!match) {
      return 86400;
    }
    const [_, raw, unit] = match;
    const amount = Number(raw);
    switch (unit) {
      case 's':
        return amount;
      case 'm':
        return amount * 60;
      case 'h':
        return amount * 3600;
      case 'd':
        return amount * 86400;
      default:
        return amount;
    }
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private compareRefreshTokens(token: string, storedHash: string): boolean {
    const tokenHash = createHash('sha256').update(token).digest();
    const stored = Buffer.from(storedHash, 'hex');
    if (tokenHash.length !== stored.length) {
      return false;
    }
    return timingSafeEqual(tokenHash, stored);
  }

  async seedAdmin(): Promise<void> {
    const adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      this.logger.log(`Creando usuario administrador inicial: ${adminEmail}`);
      const adminPassword =
        this.configService.getOrThrow<string>('ADMIN_PASSWORD');
      const passwordHash = await this.hashData(adminPassword);

      await this.usersService.create(
        {
          email: adminEmail,
          password: adminPassword,
          firstName:
            this.configService.get<string>('ADMIN_FIRST_NAME') || 'Administrador',
          lastName: this.configService.get<string>('ADMIN_LAST_NAME') || 'Spa',
          phone:
            this.configService.get<string>('ADMIN_PHONE') || '+593999999999',
          role: Role.ADMIN,
        },
        passwordHash,
      );
      this.logger.log('✅ Administrador inicial creado con éxito.');
    }
  }
}