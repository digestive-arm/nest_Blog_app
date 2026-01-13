import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { TrimString } from 'src/modules/decorators/trim-string.decorator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Web Development',
  })
  @TrimString()
  @IsNotEmpty({
    message: 'Category must have a name',
  })
  @MinLength(3, {
    message:
      'Category name length must be greater than $constraint characters.',
  })
  @MaxLength(15)
  name: string;

  @ApiPropertyOptional({
    description: 'description of the category',
    example:
      'Web development is the process of building and maintaining websites and web applications for the internet. It involves designing user interfaces, writing server-side and client-side logic, and ensuring performance, security, and scalability.',
  })
  @TrimString()
  @MinLength(30, {
    message:
      'Category name length must be greater than $constraint characters.',
  })
  @MaxLength(1500)
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  isActive?: boolean;
}
