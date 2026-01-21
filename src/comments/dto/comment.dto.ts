import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
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
}

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Here is the new Comment!',
    description: 'content of you blogpost',
  })
  @IsOptional()
  @TrimString()
  @MinLength(1, {
    message: 'content length must be greatet than $constraint1 characters.',
  })
  @MaxLength(100, {
    message: 'comment can only be $constraint1 characters long.',
  })
  content: string;

  @ApiProperty({
    example: true,
    description: 'specify wherether comment is approved or not',
  })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
