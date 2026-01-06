// src/users/dto/login-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john_doe@email.com',
    nullable: false,
    required: true,
    description: 'Email of user',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @ApiProperty({
    example: 'your_secret_password',
    nullable: false,
    required: true,
    description: 'Password of user',
  })
  readonly password: string;
}
