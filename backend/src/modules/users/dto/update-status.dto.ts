import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ example: true, description: 'Activar (true) o desactivar (false) la cuenta' })
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  @IsNotEmpty({ message: 'isActive es requerido' })
  isActive: boolean;
}