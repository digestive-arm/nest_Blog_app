import { Expose, Type } from "class-transformer";

import { COMMENT_STATUS } from "src/comments/comments-types";
import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";

export class AuthorDashboardStatsResponse {
  @Expose()
  @ApiPropertyWritable({ example: 1 })
  totalPosts: number;

  @Expose()
  @ApiPropertyWritable({ example: 1 })
  publishedPosts: number;

  @Expose()
  @ApiPropertyWritable({ example: 0 })
  draftPosts: number;

  @Expose()
  @ApiPropertyWritable({ example: 1 })
  totalComments: number;

  @Expose()
  @ApiPropertyWritable({ example: 1 })
  pendingComments: number;
}

export class AuthorRecentPostCategoryResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "a60c2b84-3874-4977-9f06-c2cc1a32e949",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "category",
  })
  name: string;
}

export class AuthorRecentPostResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "66b334f0-3a5c-429e-b66e-366835d1acfe",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "2026-02-02T07:51:10.353Z",
  })
  createdAt: Date;

  @Expose()
  @ApiPropertyWritable({
    example: "Demon Slayer",
  })
  title: string;

  @Expose()
  @ApiPropertyWritable({
    example: "It was cloudy outside but not really raining...",
  })
  content: string;

  @Expose()
  @ApiPropertyWritable({
    example: "demon-slayer-fc20cc51",
  })
  slug: string;

  @Expose()
  @ApiPropertyWritable({ type: AuthorRecentPostCategoryResponse })
  @Type(() => AuthorRecentPostCategoryResponse)
  category: AuthorRecentPostCategoryResponse | null;
}

export class AuthorRecentCommentBlogPostResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "66b334f0-3a5c-429e-b66e-366835d1acfe",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "Demon Slayer",
  })
  title: string;
}

export class AuthorRecentCommentResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "f67e51db-ce00-4850-a053-c11cb5526a66",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "2026-02-02T07:59:18.644Z",
  })
  createdAt: Date;

  @Expose()
  @ApiPropertyWritable({
    example: "Here is the comment on JJK Post",
  })
  content: string;

  @Expose()
  @ApiPropertyWritable({
    enum: COMMENT_STATUS,
    example: COMMENT_STATUS.PENDING,
  })
  status: COMMENT_STATUS;

  @Expose()
  @ApiPropertyWritable({ type: AuthorRecentCommentBlogPostResponse })
  @Type(() => AuthorRecentCommentBlogPostResponse)
  blogPost: AuthorRecentCommentBlogPostResponse | null;
}

export class AuthorDashboardDataResponse {
  @Expose()
  @ApiPropertyWritable({ type: AuthorDashboardStatsResponse })
  @Type(() => AuthorDashboardStatsResponse)
  stats: AuthorDashboardStatsResponse;

  @Expose()
  @ApiPropertyWritable({ type: AuthorRecentPostResponse })
  @Type(() => AuthorRecentPostResponse)
  recentPosts: AuthorRecentPostResponse | null;

  @Expose()
  @ApiPropertyWritable({ type: AuthorRecentCommentResponse })
  @Type(() => AuthorRecentCommentResponse)
  recentComments: AuthorRecentCommentResponse | null;
}
