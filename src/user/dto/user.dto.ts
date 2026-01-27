import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

import { IsSafeText } from "src/modules/decorators/safe-text.decorator";
import { TrimString } from "src/modules/decorators/trim-string.decorator";

import { updateUserParams } from "../user-types";

export class UpdateUserDto implements updateUserParams {
  @IsOptional()
  @ApiPropertyOptional({
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

  @IsOptional()
  @ApiPropertyOptional({
    example: "john",
    description: "Your firstname",
  })
  @TrimString()
  @IsSafeText()
  readonly firstName: string;

  @IsOptional()
  @ApiPropertyOptional({
    example: "doe",
    description: "Your lastname",
  })
  @TrimString()
  @IsSafeText()
  readonly lastName: string;
}
