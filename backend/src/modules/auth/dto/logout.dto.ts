import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    description: 'ID de la sesión a cerrar. Si se omite, se cierran todas las sesiones.',
  })
  @IsOptional()
  @IsUUID('4', { message: 'sessionId debe ser un UUID válido' })
  sessionId?: string;
}