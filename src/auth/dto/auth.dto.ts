import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'username you wish to have',
  })
  @MinLength(5, {
    message: 'Username must be longer than or equal to $constraint1 characters',
  })
  readonly username: string;

  @ApiProperty({
    example: 'john',
    description: 'Your firstname',
  })
  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'doe',
    description: 'Your lastname',
  })
  readonly lastname: string;

  @ApiProperty({
    example: 'john_doe@email.com',
    description: 'email of user',
  })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;

  @ApiProperty({
    example: 'your_secret_password',
    description: 'password of user',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly password: string;
}
