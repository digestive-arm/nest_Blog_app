import { Expose, Type } from "class-transformer";

import { COMMENT_STATUS } from "src/comments/comments-types";
import { ApiPropertyWritable } from "src/modules/swagger/swagger.writable.decorator";

export class AdminDashboardStatsResponse {
  @Expose()
  @ApiPropertyWritable({ example: 6 })
  totalUsers: number;

  @Expose()
  @ApiPropertyWritable({ example: 2 })
  totalAuthors: number;

  @Expose()
  @ApiPropertyWritable({ example: 7 })
  totalPosts: number;

  @Expose()
  @ApiPropertyWritable({ example: 1 })
  totalComments: number;

  @Expose()
  @ApiPropertyWritable({ example: 9 })
  pendingPosts: number;

  @Expose()
  @ApiPropertyWritable({ example: 2 })
  pendingComments: number;
}

export class AdminRecentPostResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "103e2e3f-84db-4ed1-a8ba-39159454a104",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "2026-01-13T10:20:24.340Z",
  })
  createdAt: Date;

  @Expose()
  @ApiPropertyWritable({
    example: "New Blog Post 3",
  })
  title: string;

  @Expose()
  @ApiPropertyWritable({
    example: "Learning NestJS can feel overwhelming...",
  })
  content: string;

  @Expose()
  @ApiPropertyWritable({
    example: "new-blog-post-3-4d0436fc",
  })
  slug: string;

  @Expose()
  @ApiPropertyWritable({
    example: null,
  })
  category: string | null;
}

export class AdminRecentCommentResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "bc585594-c391-4bac-8df4-09f962d0cbd3",
  })
  id: string;

  @Expose()
  @ApiPropertyWritable({
    example: "2026-01-22T12:05:12.955Z",
  })
  createdAt: Date;

  @Expose()
  @ApiPropertyWritable({
    example: "Here is second the comment on JJK Post",
  })
  content: string;

  @Expose()
  @ApiPropertyWritable({
    example: COMMENT_STATUS.PENDING,
    enum: COMMENT_STATUS,
  })
  status: COMMENT_STATUS;

  @Expose()
  @ApiPropertyWritable({
    example: null,
  })
  blogPost: string | null;
}

export class AdminRecentActivityResponse {
  @Expose()
  @ApiPropertyWritable({ type: AdminRecentPostResponse })
  @Type(() => AdminRecentPostResponse)
  recentPost: AdminRecentPostResponse;

  @Expose()
  @ApiPropertyWritable({ type: AdminRecentCommentResponse })
  @Type(() => AdminRecentCommentResponse)
  recentComment: AdminRecentCommentResponse;
}

export class AdminPostByCategoryResponse {
  @Expose()
  @ApiPropertyWritable({
    example: "a60c2b84-3874-4977-9f06-c2cc1a32e949",
  })
  categoryId: string | null;

  @Expose()
  @ApiPropertyWritable({
    example: "Uncategorized",
  })
  categoryName: string;

  @Expose()
  @ApiPropertyWritable({
    example: 6,
  })
  postCount: number;
}

export class AdminDashboardDataResponse {
  @Expose()
  @ApiPropertyWritable({ type: AdminDashboardStatsResponse })
  @Type(() => AdminDashboardStatsResponse)
  stats: AdminDashboardStatsResponse;

  @Expose()
  @ApiPropertyWritable({ type: AdminRecentActivityResponse })
  @Type(() => AdminRecentActivityResponse)
  recentActivity: AdminRecentActivityResponse;

  @Expose()
  @ApiPropertyWritable({ type: [AdminPostByCategoryResponse] })
  @Type(() => AdminPostByCategoryResponse)
  postByCategory: AdminPostByCategoryResponse[];
}
