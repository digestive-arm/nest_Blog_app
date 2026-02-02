import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { type TokenPayload } from "src/auth/auth-types";
import { BLOG_POST_STATUS } from "src/blogpost/blogpost-types";
import { COMMENT_STATUS } from "src/comments/comments-types";
import { SORT_ORDER, SORTBY } from "src/common/enums";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";

import {
  RECENT_AUTHOR_COMMENT_LIMIT,
  RECENT_AUTHOR_COMMENT_SELECT,
  RECENT_AUTHOR_POST_LIMIT,
  RECENT_AUTHOR_POST_SELECT,
} from "./author-dashboard.constants";
import {
  AuthorDashboardData,
  AuthorDashboardStats,
} from "./interfaces/author-dashboard.interface";

@Injectable()
export class AuthorDashboardService {
  constructor(
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async getAuthorDashboard({
    id: authorId,
  }: TokenPayload): Promise<AuthorDashboardData> {
    const [stats, recentPosts, recentComments] = await Promise.all([
      this.getAuthorStats(authorId),
      this.findRecent(authorId),
      this.findRecentForAuthor(authorId),
    ]);

    return {
      stats,
      recentPosts,
      recentComments,
    };
  }

  async getAuthorStats(authorId: string): Promise<AuthorDashboardStats> {
    const getTotalPostPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.authorId = :authorId", { authorId })
      .getCount();

    const publishedPostPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.authorId = :authorId", { authorId })
      .andWhere("post.status = :status", { status: BLOG_POST_STATUS.PUBLISHED })
      .getCount();

    const draftPostPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.authorId = :authorId", { authorId })
      .andWhere("post.status = :status", { status: BLOG_POST_STATUS.DRAFT })
      .getCount();

    const totalCommentsPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comment")
      .where("post.authorId = :authorId", { authorId })
      .getCount();

    const pendingCommentsPromise = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comment")
      .where("post.authorId = :authorId", { authorId })
      .andWhere("comment.status = :status", { status: COMMENT_STATUS.PENDING })
      .getCount();
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
    ] = await Promise.all([
      getTotalPostPromise,
      publishedPostPromise,
      draftPostPromise,
      totalCommentsPromise,
      pendingCommentsPromise,
    ]);
    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalComments,
      pendingComments,
    };
  }
  async findRecent(authorId: string): Promise<BlogpostEntity | null> {
    const recentPost = await this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.authorId = :authorId", { authorId })
      .leftJoinAndSelect("post.category", "cat")
      .select(RECENT_AUTHOR_POST_SELECT)
      .take(RECENT_AUTHOR_POST_LIMIT)
      .orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();

    return recentPost;
  }
  async findRecentForAuthor(authorId: string): Promise<CommentEntity | null> {
    const recentComment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.authorId = :authorId", { authorId })
      .leftJoinAndSelect("comment.blogPost", "post")
      .select(RECENT_AUTHOR_COMMENT_SELECT)
      .take(RECENT_AUTHOR_COMMENT_LIMIT)
      .orderBy(`comment.${SORTBY.CREATED_AT}`, SORT_ORDER.ASC)
      .getOne();

    return recentComment;
  }
}
