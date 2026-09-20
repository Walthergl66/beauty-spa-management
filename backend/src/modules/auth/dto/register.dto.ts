import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'cliente@spa.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña (mínimo 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ example: 'Ana', description: 'Nombres del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @ApiProperty({ example: 'Paredes', description: 'Apellidos del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @ApiPropertyOptional({ example: '0991234567', description: 'Teléfono de contacto' })
  @IsString()
  @IsOptional()
  @Length(10, 10, { message: 'El número de teléfono debe tener 10 dígitos' })
  phone?: string;
}
