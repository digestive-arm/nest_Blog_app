import { PaginationMetaResponse } from 'src/common/responses/pagination.response';
import { BlogPostResponse } from './blogpost.response';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';
import { Expose, Type } from 'class-transformer';

export class SearchResponse {
  @Expose()
  @ApiPropertyWritable({ type: [BlogPostResponse] })
  @Type(() => BlogPostResponse)
  data: BlogPostResponse[];

  @Expose()
  @ApiPropertyWritable({ type: PaginationMetaResponse })
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}
