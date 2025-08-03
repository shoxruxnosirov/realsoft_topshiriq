import { IsOptional, IsEnum, IsString, IsBoolean, MinLength } from 'class-validator';
import { UserRole } from 'src/comman/types';

export class UpdateRoleDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'Noto‘g‘ri role turi kiritildi' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Name matn bo‘lishi kerak' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Username matn bo‘lishi kerak' })
  username?: string;

  @IsString()
  @MinLength(4, { message: 'Password kamida 4 ta belgidan iborat bo‘lishi kerak' })
  password: string;

  @IsOptional()
  // Agar bu raqam bo'lishi kerak bo'lsa:
  // @IsInt()
  updatedBy?: number;
}
