import { Expose, Type } from "class-transformer";

import { PaginationMetaResponse } from "src/common/responses/pagination.response";
import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";

export class CategoryResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "Summary of your blogpost",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "Summary of your blogpost",
  })
  name: string;

  @Expose()
  @ApiPropertyWritable({
    example: "Summary of your blogpost",
  })
  slug: string;

  @Expose()
  @ApiPropertyWritable({
    example: "Summary of your blogpost",
    nullable: true,
  })
  description?: string;
}

export class GetAllCategoryResponse {
  @Expose()
  @ApiPropertyWritable({ type: [CategoryResponse] })
  @Type(() => CategoryResponse)
  data: CategoryResponse[];

  @Expose()
  @ApiPropertyWritable({ type: PaginationMetaResponse })
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}
