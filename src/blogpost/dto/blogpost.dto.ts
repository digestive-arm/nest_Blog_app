import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

import { PaginationDto } from "src/common/dto/pagination.dto";
import { IsSafeText } from "src/modules/decorators/safe-text.decorator";
import { TrimString } from "src/modules/decorators/trim-string.decorator";

export class CreateBlogPostDto {
  // title
  @IsNotEmpty({
    message: "Title cannot be empty.",
  })
  @ApiProperty({
    example: "New Blog Post",
    description: "Title of your blogpost",
  })
  @MinLength(5, {
    message: "Title length should be greater than $constraint1 characters.",
  })
  @MaxLength(150, {
    message: "Title length should be less than $constraint1 characters.",
  })
  @TrimString()
  @IsSafeText()
  title: string;

  // content
  @IsNotEmpty({
    message: "Content cannot be empty.",
  })
  @ApiProperty({
    example:
      "Learning NestJS can feel overwhelming at first, especially if you are coming from a simple Express background. However, NestJS provides a powerful structure that helps you build scalable and maintainable backend applications. Its modular architecture encourages separation of concerns, making your codebase easier to understand and extend. Features like dependency injection, guards, interceptors, and pipes may seem complex initially, but they solve real problems in larger systems. By starting with small modules and gradually adopting NestJS best practices, you can improve both code quality and developer productivity while building robust APIs that are ready for production use.",
    description: "Content of your blogpost",
  })
  @MinLength(100, {
    message: "A blogpost's content must have atleast $constraint1 characters",
  })
  @TrimString()
  @MaxLength(50_000, {
    message: "A blogpost's content must be less than $constraint1 characters",
  })
  @IsSafeText()
  content: string;

  // summary
  @IsOptional()
  @ApiProperty({
    example:
      "A beginner-friendly overview of why NestJS is useful, how its structure helps scalability, and how developers can gradually adopt its core concepts to build production-ready backend applications.",
    description: "Content of your blogpost",
  })
  @TrimString()
  @IsSafeText()
  summary?: string;

  // categoryId
  @IsOptional()
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "categoryId",
  })
  @TrimString()
  @IsUUID()
  categoryId?: string;
}

export class UpdateBlogPostDto {
  // title
  @IsOptional()
  @ApiPropertyOptional({
    example: "New Blog Post",
    description: "Title of your blogpost",
  })
  @MinLength(5, {
    message: "Title length should be greater than $constraint1 characters.",
  })
  @MaxLength(150, {
    message: "Title length should be less than $constraint1 characters.",
  })
  @TrimString()
  @IsSafeText()
  title?: string;

  // content
  @IsOptional()
  @ApiPropertyOptional({
    example:
      "Learning NestJS can feel overwhelming at first, especially if you are coming from a simple Express background. However, NestJS provides a powerful structure that helps you build scalable and maintainable backend applications. Its modular architecture encourages separation of concerns, making your codebase easier to understand and extend. Features like dependency injection, guards, interceptors, and pipes may seem complex initially, but they solve real problems in larger systems. By starting with small modules and gradually adopting NestJS best practices, you can improve both code quality and developer productivity while building robust APIs that are ready for production use.",
    description: "Content of your blogpost",
  })
  @MaxLength(50_000, {
    message: "A blogpost's content must be less than $constraint1 characters",
  })
  @MinLength(100, {
    message: "A blogpost's content must have atleast $constraint1 characters",
  })
  @TrimString()
  @IsSafeText()
  content?: string;

  // summary
  @ApiPropertyOptional({
    example:
      "A beginner-friendly overview of why NestJS is useful, how its structure helps scalability, and how developers can gradually adopt its core concepts to build production-ready backend applications.",
    description: "Content of your blogpost",
  })
  @IsOptional()
  @TrimString()
  @IsSafeText()
  summary?: string;

  // category
  @TrimString()
  @ApiPropertyOptional({
    example: "category",
    description: "Category of your blogpost",
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class GetCommentsOnPostDto extends PaginationDto {
  @ApiPropertyOptional({
    example: "true",
    description: "specify if only panding comments are needed",
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPending?: boolean;
}
