import { Expose, Type } from 'class-transformer';
import { PaginationMetaResponse } from 'src/common/responses/pagination.response';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';
import { BLOG_POST_STATUS } from './blogpost-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BlogPostResponse {
  @Expose()
  @ApiPropertyWritable({
    example: 'af4b-b072d134a386',
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: ' blogpost',
  })
  title: string;

  @Expose()
  @ApiPropertyWritable({
    example: 'content of your blogpost',
  })
  content: string;

  @Expose()
  @ApiPropertyWritable({
    example: 'Summary of your blogpost',
  })
  summary?: string;

  @Expose()
  @ApiPropertyWritable({
    example: 'af4b-b072d134a386',
  })
  authorId: string;

  @Expose()
  @ApiPropertyWritable({
    example: 'blog-post-123456',
  })
  slug: string;

  @Expose()
  @ApiPropertyWritable({
    enum: BLOG_POST_STATUS,
    example: BLOG_POST_STATUS.DRAFT,
  })
  status: BLOG_POST_STATUS;
}

export class GetAllBlogPostResponse {
  @Expose()
  @ApiPropertyWritable({ type: [BlogPostResponse] })
  @Type(() => BlogPostResponse)
  data: BlogPostResponse[];

  @Expose()
  @ApiPropertyWritable({ type: PaginationMetaResponse })
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}

export class CommentsOnPostResponse {
  @Expose()
  id: string;
  @Expose()
  content: string;
  @Expose()
  createdAt: string;
  @Expose()
  authorId: string;
  @Expose()
  userName: string;
}
export class GetAllCommentesOnPostResponse {
  @ApiPropertyWritable({
    type: [CommentsOnPostResponse],
  })
  @Expose()
  @Type(() => CommentsOnPostResponse)
  data: CommentsOnPostResponse[];
  @ApiPropertyWritable({
    type: PaginationMetaResponse,
  })
  @Expose()
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;
}
