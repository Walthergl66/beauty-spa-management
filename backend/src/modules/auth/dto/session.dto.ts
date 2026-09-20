import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthSession } from '../sessions/auth-session.entity.js';

export class SessionDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true })
  device?: string | null;

  @ApiPropertyOptional({ nullable: true })
  ip?: string | null;

  @ApiPropertyOptional({ nullable: true })
  userAgent?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUsedAt: Date;

  @ApiProperty()
  expiresAt: Date;

  static fromEntity(session: AuthSession): SessionDto {
    const dto = new SessionDto();
    dto.id = session.id;
    dto.device = session.device;
    dto.ip = session.ip;
    dto.userAgent = session.userAgent;
    dto.createdAt = session.createdAt;
    dto.lastUsedAt = session.lastUsedAt;
    dto.expiresAt = session.expiresAt;
    return dto;
  }
}