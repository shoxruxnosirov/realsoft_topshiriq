import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Username bo‘sh bo‘lmasligi kerak' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'Parol kamida 4 ta belgidan iborat bo‘lishi kerak' })
  password: string;
}
