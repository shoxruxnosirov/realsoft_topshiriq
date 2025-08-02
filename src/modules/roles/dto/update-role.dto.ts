import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
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

  @IsOptional()
  @IsBoolean({ message: 'Status faqat true yoki false bo‘lishi kerak' })
  status?: boolean;

  @IsOptional()
  // Agar bu raqam bo'lishi kerak bo'lsa:
  // @IsInt()
  updatedBy?: number;
}
