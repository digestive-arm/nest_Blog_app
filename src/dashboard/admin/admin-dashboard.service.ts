/* eslint-disable @cspell/spellchecker */
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { BLOG_POST_STATUS } from "src/blogpost/blogpost-types";
import { SORT_ORDER, SORTBY } from "src/common/enums";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";

import { AUTHOR_DASHBOARD_CONSTANTS } from "./admin-dashboar.constants";
import { ADMIN_DASHBOARD_CACHE_KEYS } from "./admin-dashboard.cache-keys";
import {
  AdminDashboardData,
  AdminDashboardStats,
  AdminPostByCategory,
  AdminRecentActivity,
  CommentStats,
  PostStats,
  UserStats,
} from "./admin.interface";

@Injectable()
export class AdminDashboardService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const cached = await this.cache.get<AdminDashboardData>(
      ADMIN_DASHBOARD_CACHE_KEYS.DASHBOARD,
    );

    if (cached) return cached;

    const [stats, recentActivity, postByCategory] = await Promise.all([
      this.getAdminStats(),
      this.findRecent(),
      this.getPostByCategory(),
    ]);
    const result = {
      stats,
      recentActivity,
      postByCategory,
    };
    await this.cache.set(ADMIN_DASHBOARD_CACHE_KEYS.DASHBOARD, result);
    return result;
  }

  async getPostByCategory(): Promise<AdminPostByCategory[]> {
    const qb = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoin("post.category", "cat")
      .where("post.status = :status", {
        status: BLOG_POST_STATUS.PUBLISHED,
      })
      .select([]); // to remove implicit post.*

    AUTHOR_DASHBOARD_CONSTANTS.BLOG_POST_CATEGORY_STATS_SELECT.forEach(
      ({ selection, alias }) => {
        qb.addSelect(selection, alias);
      },
    );

    AUTHOR_DASHBOARD_CONSTANTS.BLOG_POST_CATEGORY_STATS_GROUP_BY.forEach(
      (groupBy) => {
        qb.addGroupBy(groupBy);
      },
    );

    return qb.getRawMany();
  }

  async getAdminStats(): Promise<AdminDashboardStats> {
    const cached = await this.cache.get<AdminDashboardStats>(
      ADMIN_DASHBOARD_CACHE_KEYS.STATS,
    );

    if (cached) {
      return cached;
    }

    const { totalUsers, totalAuthors } = await this.getUserStats();
    const { totalPosts, pendingPosts } = await this.getPostsStats();
    const { totalComments, pendingComments } = await this.getCommentStats();
    const result = {
      totalUsers,
      totalAuthors,
      totalPosts,
      pendingPosts,
      totalComments,
      pendingComments,
    };
    await this.cache.set(ADMIN_DASHBOARD_CACHE_KEYS.STATS, result);
    return result;
  }
  async findRecent(): Promise<AdminRecentActivity> {
    const cached = await this.cache.get<AdminRecentActivity>(
      ADMIN_DASHBOARD_CACHE_KEYS.RECENT,
    );

    if (cached) {
      return cached;
    }

    const recentPost = await this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.category", "cat")
      .select(AUTHOR_DASHBOARD_CONSTANTS.RECENT_POST_SELECT)
      .take(AUTHOR_DASHBOARD_CONSTANTS.RECENT_POST_SELECT_LIMIT)
      .orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();

    const recentComment = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.blogPost", "post")
      .select(AUTHOR_DASHBOARD_CONSTANTS.RECENT_COMMENT_SELECT)
      .take(AUTHOR_DASHBOARD_CONSTANTS.RECENT_COMMENT_SELECT_LIMIT)
      .orderBy(`comment.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();
    const result = { recentPost, recentComment };
    await this.cache.set(ADMIN_DASHBOARD_CACHE_KEYS.RECENT, result);
    return result;
  }

  async getUserStats(): Promise<UserStats> {
    const [userStats] = await this.userRepository
      .createQueryBuilder("user")
      .select(AUTHOR_DASHBOARD_CONSTANTS.USER_STATS_SELECT)
      .getRawMany();
    const result = {
      totalUsers: Number(userStats.totalusers),
      totalAuthors: Number(userStats.totalauthors),
    };
    return result;
  }

  async getPostsStats(): Promise<PostStats> {
    const [postStats] = await this.blogPostRepository
      .createQueryBuilder("post")
      .select(AUTHOR_DASHBOARD_CONSTANTS.POST_STATS_SELECT)
      .getRawMany();
    const result = {
      totalPosts: Number(postStats.totalposts),
      pendingPosts: Number(postStats.pendingposts),
    };
    return result;
  }

  async getCommentStats(): Promise<CommentStats> {
    const [commentStats] = await this.commentRepository
      .createQueryBuilder("comment")
      .select(AUTHOR_DASHBOARD_CONSTANTS.COMMENT_STATS_SELECT)
      .getRawMany();

    const result = {
      totalComments: Number(commentStats.totalcomments),
      pendingComments: Number(commentStats.pendingcomments),
    };
    return result;
  }
}
