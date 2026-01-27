import { Expose, Type } from "class-transformer";

import { PaginationMetaResponse } from "src/common/responses/pagination.response";
import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";

import { BlogPostResponse } from "./blogpost.response";

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
