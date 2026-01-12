import { Expose } from 'class-transformer';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';

export class PaginationMetaResponse {
  @Expose()
  @ApiPropertyWritable({ example: 100 })
  totalItems: number;

  @Expose()
  @ApiPropertyWritable({ example: 10 })
  itemsCount: number;

  @Expose()
  @ApiPropertyWritable({ example: 10 })
  itemsPerPage: number;

  @Expose()
  @ApiPropertyWritable({ example: 10 })
  totalPages: number;

  @Expose()
  @ApiPropertyWritable({ example: 1 })
  currentPage: number;
}
