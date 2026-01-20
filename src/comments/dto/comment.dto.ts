import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TrimString } from 'src/modules/decorators/trim-string.decorator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Here is a comment',
    description: 'Write content of your comment',
  })
  @IsNotEmpty()
  @TrimString()
  @MinLength(1, {
    message: 'content length must be greatet than $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'comment can only be $constraint1 characters long.',
  })
  content: string;

  @ApiProperty({
    example: 'a24ada78-38ed-42e2-a698-de341f63899b',
    description: 'authorId',
  })
  @TrimString()
  @IsNotEmpty({
    message: 'a comment must have an authorId',
  })
  @IsUUID()
  authorId: string;

  @ApiProperty({
    example: 'b36b841c-89c7-4c2a-82d4-a46395c55699',
    description: 'postId',
  })
  @TrimString()
  @IsNotEmpty({
    message: 'a comment must have a postId.',
  })
  @IsUUID()
  postId: string;
}

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Here is the new Comment!',
    description: 'content of you blogpost',
  })
  @IsNotEmpty()
  @TrimString()
  @MinLength(1, {
    message: 'content length must be greatet than $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'comment can only be $constraint1 characters long.',
  })
  content: string;
}

export class ProcessCommentDto {
  @ApiProperty({
    example: true,
    description: 'specify wherether comment is approved or not',
  })
  @IsBoolean()
  isApproved: boolean;
}
