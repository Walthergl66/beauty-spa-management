import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service.js';
import { SessionService } from '../sessions/session.service.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  ver?: number;
  sid?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sid: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inactivo o no autorizado');
    }
    if (payload.ver !== (user.tokenVersion ?? 0)) {
      throw new UnauthorizedException('Sesión inválida, vuelve a iniciar sesión');
    }
    if (!payload.sid) {
      throw new UnauthorizedException('Sesión inválida, vuelve a iniciar sesión');
    }
    const session = await this.sessionService.findValidById(
      payload.sid,
      user.id,
    );
    if (!session) {
      throw new UnauthorizedException('Sesión inválida, vuelve a iniciar sesión');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      sid: payload.sid,
    };
  }
}