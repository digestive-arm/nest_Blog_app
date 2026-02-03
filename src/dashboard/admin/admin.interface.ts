import type { COMMENT_STATUS } from "src/comments/comments-types";
import type { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import type { CategoryEntity } from "src/modules/database/entities/category.entity";

export interface AdminDashboardStats {
  totalUsers: number;
  totalAuthors: number;
  totalPosts: number;
  totalComments: number;
  pendingPosts: number;
  pendingComments: number;
}

export interface AdminRecentPost {
  id: string;
  createdAt: Date | string;
  title: string;
  content: string;
  slug: string;
  category: Partial<CategoryEntity>;
}

export interface AdminRecentComment {
  id: string;
  createdAt: Date | string;
  content: string;
  status: COMMENT_STATUS;
  blogPost: Partial<BlogpostEntity>;
}

export interface AdminRecentActivity {
  recentPost: Partial<BlogpostEntity> | null;
  recentComment: AdminRecentComment | null;
}

export interface AdminPostByCategory {
  categoryId: string | null;
  categoryName: string;
  postCount: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentActivity: AdminRecentActivity;
  postByCategory: AdminPostByCategory[];
}
export interface CommentStats {
  totalComments: number;
  pendingComments: number;
}
export interface PostStats {
  totalPosts: number;
  pendingPosts: number;
}
export interface UserStats {
  totalUsers: number;
  totalAuthors: number;
}
