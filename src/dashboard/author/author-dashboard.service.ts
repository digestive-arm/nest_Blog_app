/* eslint-disable @cspell/spellchecker */
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { type TokenPayload } from "src/auth/auth-types";
import { SORT_ORDER, SORTBY } from "src/common/enums";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";

import {
  authorDashboardCacheKey,
  authorDashboardRecentCommentCacheKey,
  authorDashboardRecentPostCacheKey,
  authorDashboardStatsCacheKey,
} from "./author-dashboard.cache-keys";
import { AUTHOR_DASHBOARD_CONSTANTS } from "./author-dashboard.constants";
import {
  AuthorCommentStats,
  AuthorDashboardData,
  AuthorDashboardStats,
  AuthorPostStats,
} from "./interfaces/author-dashboard.interface";

@Injectable()
export class AuthorDashboardService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getAuthorDashboard({
    id: authorId,
  }: TokenPayload): Promise<AuthorDashboardData> {
    const cacheKey = authorDashboardCacheKey(authorId);
    const cached = await this.cache.get<AuthorDashboardData>(cacheKey);
    if (cached) return cached;

    const [stats, recentPosts, recentComments] = await Promise.all([
      this.getAuthorStats(authorId),
      this.getRecenetPost(authorId),
      this.getRecentComment(authorId),
    ]);

    const result = {
      stats,
      recentPosts,
      recentComments,
    };
    await this.cache.set(cacheKey, result);
    return result;
  }

  async getAuthorStats(authorId: string): Promise<AuthorDashboardStats> {
    const cacheKey = authorDashboardStatsCacheKey(authorId);
    const cached = await this.cache.get<AuthorDashboardStats>(cacheKey);
    if (cached) return cached;

    const { totalPosts, publishedPosts, draftPosts } =
      await this.getPostStats(authorId);
    const { totalComments, pendingComments } =
      await this.getCommentStats(authorId);
    const result = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
    };

    await this.cache.set(cacheKey, result);
    return result;
  }
  async getRecenetPost(authorId: string): Promise<BlogpostEntity | null> {
    const cacheKey = authorDashboardRecentPostCacheKey(authorId);
    const cached = await this.cache.get<BlogpostEntity>(cacheKey);
    if (cached) return cached;

    const recentPost = await this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.authorId = :authorId", { authorId })
      .leftJoinAndSelect("post.category", "cat")
      .select(AUTHOR_DASHBOARD_CONSTANTS.AUTHOR_DASHBOARD_RECENT_POST_SELECT)
      .take(
        AUTHOR_DASHBOARD_CONSTANTS.AUTHOR_DASHBOARD_RECENT_POST_SELECT_LIMIT,
      )
      .orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();
    await this.cache.set(cacheKey, recentPost);
    return recentPost;
  }
  async getRecentComment(authorId: string): Promise<CommentEntity | null> {
    const cacheKey = authorDashboardRecentCommentCacheKey(authorId);
    const cached = await this.cache.get<CommentEntity>(cacheKey);
    if (cached) return cached;
    const recentComment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.authorId = :authorId", { authorId })
      .leftJoinAndSelect("comment.blogPost", "post")
      .select(AUTHOR_DASHBOARD_CONSTANTS.AUTHOR_DASHBOARD_RECENT_COMMENT_SELECT)
      .take(
        AUTHOR_DASHBOARD_CONSTANTS.AUTHOR_DASHBOARD_RECENT_COMMENT_SELECT_LIMIT,
      )
      .orderBy(`comment.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();

    await this.cache.set(cacheKey, recentComment);
    return recentComment;
  }

  async getCommentStats(authorId: string): Promise<AuthorCommentStats> {
    const [commentStats] = await this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comment")
      .where("post.authorId = :authorId", { authorId })
      .select(AUTHOR_DASHBOARD_CONSTANTS.AUTHOR_COMMENT_STATS_SELECT)
      .getRawMany();
    const result = {
      totalComments: Number(commentStats.totalcomments),
      pendingComments: Number(commentStats.pendingcomments),
    };
    return result;
  }

  async getPostStats(authorId: string): Promise<AuthorPostStats> {
    const [postStats] = await this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.authorId = :authorId", { authorId })
      .select(AUTHOR_DASHBOARD_CONSTANTS.AUTHOR_POST_STATS)
      .getRawMany();

    const result = {
      totalPosts: Number(postStats.totalposts),
      publishedPosts: Number(postStats.publishedposts),
      draftPosts: Number(postStats.draftposts),
    };

    return result;
  }
}
