import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

import { IsSafeText } from "src/modules/decorators/safe-text.decorator";
import { TrimString } from "src/modules/decorators/trim-string.decorator";

export class CreateCategoryDto {
  @IsNotEmpty({
    message: "Category must have a name",
  })
  @ApiProperty({
    description: "Name of the category",
    example: "Web Development",
  })
  @MinLength(3, {
    message:
      "Category name length must be greater than $constraint1 characters.",
  })
  @MaxLength(15, {
    message: "Category name length must be less than $constraint1 characters.",
  })
  @TrimString()
  @IsSafeText()
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: "description of the category",
    example:
      "Web development is the process of building and maintaining websites and web applications for the internet. It involves designing user interfaces, writing server-side and client-side logic, and ensuring performance, security, and scalability.",
  })
  @MinLength(30, {
    message:
      "Category name length must be greater than $constraint1 characters.",
  })
  @MaxLength(1500, {
    message: "Category name length must be less than $constraint1 characters.",
  })
  @TrimString()
  @IsSafeText()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  isActive?: boolean;
}
