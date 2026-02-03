import type { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import type { CommentEntity } from "src/modules/database/entities/comment.entity";

export interface AuthorDashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
}

export interface AuthorDashboardData {
  stats: AuthorDashboardStats;
  recentPosts: BlogpostEntity | null;
  recentComments: CommentEntity | null;
}

export interface AuthorCommentStats {
  totalComments: number;
  pendingComments: number;
}

export interface AuthorPostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
}
