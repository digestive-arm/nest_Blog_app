import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TrimString } from 'src/modules/decorators/trim-string.decorator';
export class SearchBlogPostDto extends PaginationDto {
  @ApiProperty({
    example: 'blog post',
    type: String,
  })
  @IsOptional()
  @TrimString()
  q?: string;
}
