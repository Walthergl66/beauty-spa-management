import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../../common/enums/role.enum.js';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: Role.EMPLOYEE, description: 'Nuevo rol del usuario' })
  @IsEnum(Role, { message: 'El rol debe ser uno de: CLIENT, EMPLOYEE, ADMIN' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  role: Role;
}