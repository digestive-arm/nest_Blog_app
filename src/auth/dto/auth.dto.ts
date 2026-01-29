import { ApiProperty } from "@nestjs/swagger";

import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
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
  @IsLowercase()
  readonly email: string;

  @IsString()
  @IsStrongPassword(undefined, {
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
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
    message: "username must be shorter than $constraint1 characters long.",
  })
  @TrimString()
  @IsSafeText()
  readonly userName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "john",
    description: "Your firstName",
  })
  @TrimString()
  @IsSafeText()
  readonly firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "doe",
    description: "Your lastName",
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
  @IsLowercase()
  @TrimString()
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: "your_secret_password",
    description: "password of user",
  })
  @IsString()
  @IsStrongPassword(undefined, {
    message:
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
  })
  @TrimString()
  readonly password: string;
}
