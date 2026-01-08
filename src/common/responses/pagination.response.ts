import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';

export class PaginationMetaResponse {
  @ApiPropertyWritable({ example: 100 })
  totalItems: number;

  @ApiPropertyWritable({ example: 10 })
  itemsCount: number;

  @ApiPropertyWritable({ example: 10 })
  itemsPerPage: number;

  @ApiPropertyWritable({ example: 10 })
  totalPages: number;

  @ApiPropertyWritable({ example: 1 })
  currentPage: number;
}
