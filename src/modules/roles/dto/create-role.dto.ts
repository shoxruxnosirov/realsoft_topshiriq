import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole } from 'src/comman/types';

export class CreateRoleDto {
  @IsEnum(UserRole, { message: 'Role must be either "admin" or "user"' })
  role: UserRole;

  @IsString()
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @IsOptional()
  createdBy?: number;
}
