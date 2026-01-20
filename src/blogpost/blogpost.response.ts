import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationMetaResponse } from 'src/common/responses/pagination.response';
import { ApiPropertyWritable } from 'src/modules/swagger/swagger.writable.decorator';
import { BLOG_POST_STATUS } from './blogpost-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';

class AttachmentResponseForBlogPost {
  @Expose()
  @ApiPropertyWritable({
    example: 'url_of_your image',
  })
  url: string;

  @Exclude()
  @ApiPropertyWritable({
    example: 'url_of_your image',
  })
  publicId: string;

  @Exclude()
  @ApiPropertyWritable({
    example: 'url_of_your image',
  })
  postId: string;

  @Exclude()
  @ApiPropertyWritable({
    example: 'url_of_your image',
  })
  blogPost: BlogpostEntity;

  @Exclude()
  @ApiPropertyWritable({
    example: 'af4b-b072d134a386',
  })
  id: string;

  @Exclude()
  @ApiPropertyWritable({
    example: 'blog-post-123456',
  })
  createdAt: Date;

  @Exclude()
  @ApiPropertyWritable({
    example: 'blog-post-123456',
  })
  updatedAt: Date;
}

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
    example: 'af4b-b072d134a386',
  })
  categoryId: string;

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

  @Expose()
  @ApiPropertyWritable({
    example: 'blog-post-123456',
  })
  createdAt: Date;

  @Exclude()
  @ApiPropertyWritable({
    example: 'blog-post-123456',
  })
  updatedAt: Date;

  @Expose()
  @ApiPropertyWritable({ type: [AttachmentResponseForBlogPost] })
  @Type(() => AttachmentResponseForBlogPost)
  attachments: AttachmentResponseForBlogPost[];
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
  @ApiPropertyWritable({
    example: '6015-eed0-4b5Fc-b399-e91b695f',
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: 'Here is the comment',
  })
  content: string;
  @Expose()
  @ApiPropertyWritable({
    example: 'date',
  })
  createdAt: string;
  @Expose()
  @ApiPropertyWritable({
    example: '6015-eed0-4b5Fc-b399-e91b695f',
  })
  authorId: string;
  @Expose()
  @ApiPropertyWritable({
    example: 'digestive_arm',
  })
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
