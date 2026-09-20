import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    description: 'ID de la sesión a cerrar (si se omite, cierra la sesión actual).',
  })
  @IsOptional()
  @IsUUID('4', { message: 'sessionId debe ser un UUID válido' })
  sessionId?: string;

  @ApiPropertyOptional({
    description: 'true para cerrar todas las sesiones del usuario.',
  })
  @IsOptional()
  @IsBoolean({ message: 'all debe ser un booleano' })
  all?: boolean;
}