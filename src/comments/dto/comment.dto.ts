import { ApiProperty } from "@nestjs/swagger";

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

import { IsSafeText } from "src/modules/decorators/safe-text.decorator";
import { TrimString } from "src/modules/decorators/trim-string.decorator";

export class CreateCommentDto {
  @IsNotEmpty()
  @ApiProperty({
    example: "Here is a comment",
    description: "Write content of your comment",
  })
  @MinLength(1, {
    message: "content length must be greater than $constraint1 characters.",
  })
  @MaxLength(100, {
    message: "comment can only be $constraint1 characters long.",
  })
  @TrimString()
  @IsSafeText()
  content: string;
}

export class UpdateCommentDto {
  @IsOptional()
  @ApiProperty({
    example: "Here is the new Comment!",
    description: "content of you blogpost",
  })
  @TrimString()
  @MinLength(1, {
    message: "content length must be greater than $constraint1 characters.",
  })
  @MaxLength(1000, {
    message: "comment can only be $constraint1 characters long.",
  })
  @IsSafeText()
  content: string;

  @IsOptional()
  @ApiProperty({
    example: true,
    description: "specify whether comment is approved or not",
  })
  @IsBoolean()
  isApproved?: boolean;
}
