import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { BLOG_POST_STATUS } from "src/blogpost/blogpost-types";
import { COMMENT_STATUS } from "src/comments/comments-types";
import { SORT_ORDER, SORTBY } from "src/common/enums";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_ROLES } from "src/user/user-types";

import {
  AdminDashboardData,
  AdminDashboardStats,
  AdminPostByCategory,
  AdminRecentActivity,
} from "./admin.interface";

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const [stats, recentActivity, postByCategory] = await Promise.all([
      this.getAdminStats(),
      this.findRecent(),
      this.getPostByCategory(),
    ]);

    return {
      stats,
      recentActivity,
      postByCategory,
    };
  }

  async getPostByCategory(): Promise<AdminPostByCategory[]> {
    return await this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoin("post.category", "cat")
      .where("post.status = :status", { status: BLOG_POST_STATUS.PUBLISHED })
      .select("cat.id ", "categoryId")
      .addSelect("COALESCE(cat.name, 'Uncategorized')", "categoryName")
      .addSelect("COUNT(post.id)", "postCount")
      .groupBy("cat.id")
      .addGroupBy("COALESCE(cat.name, 'Uncategorized')")
      .getRawMany();
  }

  async getAdminStats(): Promise<AdminDashboardStats> {
    const totalUserPromise = this.userRepository
      .createQueryBuilder("user")
      .getCount();
    const totalAuthorPromise = this.userRepository
      .createQueryBuilder("user")
      .where("user.role = :role", { role: USER_ROLES.AUTHOR })
      .getCount();

    const totalPostPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.status = :status", { status: BLOG_POST_STATUS.PUBLISHED })
      .getCount();

    const draftPostPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .andWhere("post.status = :status", { status: BLOG_POST_STATUS.DRAFT })
      .getCount();

    const totalCommentsPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comment")
      .where("comment.status = :status", { status: COMMENT_STATUS.APPROVED })
      .getCount();

    const pendingCommentsPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comment")
      .andWhere("comment.status = :status", { status: COMMENT_STATUS.PENDING })
      .getCount();
    const [
      totalUsers,
      totalAuthors,
      totalPosts,
      totalComments,
      pendingPosts,
      pendingComments,
    ] = await Promise.all([
      totalUserPromise,
      totalAuthorPromise,
      totalPostPromise,
      totalCommentsPromise,
      draftPostPromise,
      pendingCommentsPromise,
    ]);

    return {
      totalUsers,
      totalAuthors,
      totalPosts,
      totalComments,
      pendingPosts,
      pendingComments,
    };
  }
  async findRecent(): Promise<AdminRecentActivity> {
    const recentPost = await this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.category", "cat")
      .select([
        "post.id",
        "post.createdAt",
        "post.title",
        "post.content",
        "post.slug",
        "cat.id",
        "cat.name",
      ])
      .take(1)
      .orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();

    const recentComment = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.blogPost", "post")
      .select([
        "comment.createdAt",
        "comment.content",
        "comment.status",
        "comment.id",
        "post.id",
        "post.title",
      ])
      .take(1)
      .orderBy(`comment.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();

    return { recentPost, recentComment };
  }
}
