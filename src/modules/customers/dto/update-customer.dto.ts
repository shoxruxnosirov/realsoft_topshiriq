import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    example: 'Alijon Valiyev',
    description: 'Customer name',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsOptional()
  updatedBy?: number;
}
