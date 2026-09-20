import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { LogoutDto } from './dto/logout.dto.js';
import { AuthResponseDto, TokensDto } from './dto/auth-response.dto.js';
import { SessionDto } from './dto/session.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { UsersService } from '../users/users.service.js';
import { UserResponseDto } from '../users/dto/user-response.dto.js';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sid: string;
}

@ApiTags('Autenticación')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo cliente' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión (clientes, empleados, administradores)' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovación de tokens de acceso' })
  @ApiResponse({ status: 200, type: TokensDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cierre de sesión (sesión actual si no se indica sessionId)' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogoutDto,
  ) {
    const sessionId =
      dto.all === true ? undefined : dto.sessionId ?? user.sid;
    return this.authService.logout(user.id, sessionId, dto.all === true);
  }

  @Get('sessions')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar sesiones activas del usuario' })
  @ApiResponse({ status: 200, type: [SessionDto] })
  async getSessions(
    @CurrentUser('id') userId: string,
  ): Promise<SessionDto[]> {
    return this.authService.listSessions(userId);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async getProfile(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    return UserResponseDto.fromEntity(user);
  }
}