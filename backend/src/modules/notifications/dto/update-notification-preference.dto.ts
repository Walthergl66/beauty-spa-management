import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @ApiPropertyOptional({ description: 'Notificar cuando una cita se reserva' })
  @IsBoolean()
  @IsOptional()
  appointmentCreated?: boolean;

  @ApiPropertyOptional({ description: 'Notificar cuando una cita se confirma' })
  @IsBoolean()
  @IsOptional()
  appointmentConfirmed?: boolean;

  @ApiPropertyOptional({ description: 'Notificar cuando una cita se cancela' })
  @IsBoolean()
  @IsOptional()
  appointmentCancelled?: boolean;

  @ApiPropertyOptional({ description: 'Notificar cuando una cita se reprograma' })
  @IsBoolean()
  @IsOptional()
  appointmentRescheduled?: boolean;

  @ApiPropertyOptional({ description: 'Enviar recordatorios de citas próximas' })
  @IsBoolean()
  @IsOptional()
  reminders?: boolean;
}