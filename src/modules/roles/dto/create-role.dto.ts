import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/comman/types';

export class CreateRoleDto {
  @IsEnum(UserRole, { message: 'Role faqat "admin" yoki "user" bo‘lishi kerak' })
  role: UserRole;

  @IsString()
  @IsNotEmpty({ message: 'Name bo‘sh bo‘lmasligi kerak' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Username bo‘sh bo‘lmasligi kerak' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'Password kamida 4 ta belgidan iborat bo‘lishi kerak' })
  password: string;

  @IsOptional()
  createdBy?: number;
}
