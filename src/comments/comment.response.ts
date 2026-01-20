import { Expose, Type } from 'class-transformer';
import { PaginationMetaResponse } from 'src/common/responses/pagination.response';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';

export class CommentResponse {
  @ApiPropertyWritable({
    example: '6015-eed0-4b5Fc-b399-e91b695f',
  })
  @Expose()
  id: string;
  @ApiPropertyWritable({
    example: 'ada78-38ed-42e2-a698-de3499b',
  })
  @Expose()
  authorId: string;
  @ApiPropertyWritable({
    example: 'b31c-89c7-4c2a-82d4-a463',
  })
  @Expose()
  postId: string;
  @ApiPropertyWritable({
    example: 'Here is the comment',
  })
  @Expose()
  content: string;
}

export class GetAllCommentResponse {
  @Expose()
  @ApiPropertyWritable({
    type: [CommentResponse],
  })
  @Type(() => CommentResponse)
  data: CommentResponse[];
  @ApiPropertyWritable({
    type: PaginationMetaResponse,
  })
  @Expose()
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}
