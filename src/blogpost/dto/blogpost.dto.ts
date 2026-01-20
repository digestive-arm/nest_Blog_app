import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TrimString } from 'src/modules/decorators/trim-string.decorator';

export class CreateBlogPostDto {
  //title
  @ApiProperty({
    example: 'New Blog Post',
    description: 'Title of your blogpost',
  })
  @IsNotEmpty({
    message: 'Title cannot be empty.',
  })
  @MinLength(5, {
    message: 'Title length should be greater than $constraint1 characters.',
  })
  @TrimString()
  @MaxLength(150, {
    message: 'Title length should be less than $constraint1 characters.',
  })
  title: string;

  //content
  @ApiProperty({
    example:
      'Learning NestJS can feel overwhelming at first, especially if you are coming from a simple Express background. However, NestJS provides a powerful structure that helps you build scalable and maintainable backend applications. Its modular architecture encourages separation of concerns, making your codebase easier to understand and extend. Features like dependency injection, guards, interceptors, and pipes may seem complex initially, but they solve real problems in larger systems. By starting with small modules and gradually adopting NestJS best practices, you can improve both code quality and developer productivity while building robust APIs that are ready for production use.',
    description: 'Content of your blogpost',
  })
  @IsNotEmpty({
    message: 'Content cannot be empty.',
  })
  @MinLength(100, {
    message: "A blogpost's content must have atleast $constraint1 characters",
  })
  @TrimString()
  @MaxLength(50_000)
  content: string;

  //summary
  @ApiProperty({
    example:
      'A beginner-friendly overview of why NestJS is useful, how its structure helps scalability, and how developers can gradually adopt its core concepts to build production-ready backend applications.',
    description: 'Content of your blogpost',
  })
  @IsOptional()
  @TrimString()
  summary?: string;

  //authorId
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'AuthorId',
  })
  @IsNotEmpty({
    message: 'AuthorId cannot be empty',
  })
  @TrimString()
  @IsUUID()
  authorId: string;

  //categoryId
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'categoryId',
  })
  @IsOptional()
  @TrimString()
  @IsUUID()
  categoryId: string;
}

export class UpdateBlogPostDto {
  //title
  @ApiPropertyOptional({
    example: 'New Blog Post',
    description: 'Title of your blogpost',
  })
  @IsOptional()
  @MinLength(5, {
    message: 'Title length should be greater than $constraint1 characters.',
  })
  @TrimString()
  @MaxLength(150, {
    message: 'Title length should be less than $constraint1 characters.',
  })
  title?: string;

  //content
  @ApiPropertyOptional({
    example:
      'Learning NestJS can feel overwhelming at first, especially if you are coming from a simple Express background. However, NestJS provides a powerful structure that helps you build scalable and maintainable backend applications. Its modular architecture encourages separation of concerns, making your codebase easier to understand and extend. Features like dependency injection, guards, interceptors, and pipes may seem complex initially, but they solve real problems in larger systems. By starting with small modules and gradually adopting NestJS best practices, you can improve both code quality and developer productivity while building robust APIs that are ready for production use.',
    description: 'Content of your blogpost',
  })
  @IsOptional()
  @MinLength(100, {
    message: "A blogpost's content must have atleast $constraint1 characters",
  })
  @TrimString()
  @MaxLength(50_000)
  content?: string;

  //summary
  @ApiPropertyOptional({
    example:
      'A beginner-friendly overview of why NestJS is useful, how its structure helps scalability, and how developers can gradually adopt its core concepts to build production-ready backend applications.',
    description: 'Content of your blogpost',
  })
  @IsOptional()
  @TrimString()
  summary?: string;

  @ApiPropertyOptional({
    example: 'category',
    description: 'Title of your blogpost',
  })
  @IsOptional()
  @TrimString()
  @IsUUID()
  categoryId?: string;
}
