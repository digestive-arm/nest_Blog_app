import { ApiProperty } from "@nestjs/swagger";

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

import { IsSafeText } from "src/modules/decorators/safe-text.decorator";
import { TrimString } from "src/modules/decorators/trim-string.decorator";

export class LoginUserDto {
  @ApiProperty({
    example: "john_doe@email.com",
    nullable: false,
    required: true,
    description: "Email of user",
  })
  @IsEmail({}, { message: "Please enter a valid email address." })
  @IsNotEmpty()
  @TrimString()
  readonly email: string;

  @IsString()
  @MinLength(8, {
    message: "Password must be at least $constraint1 characters long.",
  })
  @ApiProperty({
    example: "your_secret_password",
    nullable: false,
    required: true,
    description: "Password of user",
  })
  @IsNotEmpty()
  @TrimString()
  readonly password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: "john_doe",
    description: "username you wish to have",
  })
  @MinLength(5, {
    message: "Username must be longer than or equal to $constraint1 characters",
  })
  @MaxLength(12, {
    message: "Password must be at $constraint1 characters long.",
  })
  @TrimString()
  @IsSafeText()
  readonly userName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "john",
    description: "Your firstname",
  })
  @TrimString()
  @IsSafeText()
  readonly firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "doe",
    description: "Your lastname",
  })
  @TrimString()
  @IsSafeText()
  readonly lastName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "john_doe@email.com",
    description: "email of user",
  })
  @IsEmail({}, { message: "Please enter a valid email address." })
  @TrimString()
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "your_secret_password",
    description: "password of user",
  })
  @IsString()
  @MinLength(8, {
    message: "Password must be at least $constraint1 characters long.",
  })
  @TrimString()
  readonly password: string;
}
