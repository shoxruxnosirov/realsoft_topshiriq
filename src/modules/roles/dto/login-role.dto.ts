import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Username must not be empty' })
  username: string;

  @IsString()
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;
}
