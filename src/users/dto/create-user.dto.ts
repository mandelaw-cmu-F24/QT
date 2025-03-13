import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User password (will be hashed)',
    example: 'Password123!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
