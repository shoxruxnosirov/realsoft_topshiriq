import { IsOptional, IsEnum, IsString, IsBoolean, MinLength } from 'class-validator';
import { UserRole } from 'src/comman/types';

export class UpdateRoleDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either "admin" or "user"' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @IsOptional()
  // @IsInt()
  updatedBy?: number;
}
