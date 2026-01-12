import { OmitType, PartialType } from '@nestjs/swagger';
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
  @IsString({
    message: 'Title must be a string',
  })
  title: string;

  //content
  @IsNotEmpty({
    message: 'Content cannot be empty.',
  })
  @MinLength(100, {
    message: "A blogpost's content must have atleast $constraint1 characters",
  })
  @TrimString()
  @MaxLength(50_000)
  @IsString()
  content: string;

  //summary
  @IsOptional()
  @IsString({
    message: 'Summary must be string',
  })
  @TrimString()
  summary?: string;

  //authorId
  @IsNotEmpty({
    message: 'AuthorId cannot be empty',
  })
  @TrimString()
  @IsUUID()
  authorId: string;
}

export class UpdateBlogPostDto extends PartialType(
  OmitType(CreateBlogPostDto, ['authorId'] as const),
) {}
