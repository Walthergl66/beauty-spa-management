import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
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

interface RefreshTokenPayload {
  sub: string;
  email?: string;
  role?: string;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
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
        ...registerDto,
        role: Role.CLIENT,
      },
      passwordHash,
    );

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: UserResponseDto.fromEntity(user),
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
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

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: UserResponseDto.fromEntity(user),
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokensDto> {
    let payload: RefreshTokenPayload;
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'spa_refresh_secret_key_titulacion_2026_super_secure';
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        { secret: refreshSecret },
      );
    } catch {
      throw new ForbiddenException('Token de actualización inválido o expirado');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new ForbiddenException('Acceso denegado');
    }

    const refreshTokenMatches = this.compareRefreshTokens(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Token de actualización inválido o expirado');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Sesión cerrada exitosamente' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<TokensDto> {
    const payload = { sub: userId, email, role, jti: randomUUID() };

    const accessSecret =
      this.configService.get<string>('JWT_SECRET') ||
      'spa_jwt_secret_key_titulacion_2026_super_secure';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'spa_refresh_secret_key_titulacion_2026_super_secure';

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
    };
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

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hash = this.hashRefreshToken(refreshToken);
    await this.usersService.updateRefreshToken(userId, hash);
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
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@spa.com';
    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      this.logger.log(`Creando usuario administrador inicial: ${adminEmail}`);
      const adminPassword =
        this.configService.get<string>('ADMIN_PASSWORD') || 'Admin1234*';
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
