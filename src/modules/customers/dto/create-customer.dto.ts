import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Ali Valiyev',
    description: 'Customer name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Customer status (active or not)',
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
