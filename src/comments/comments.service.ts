import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { TokenPayload } from "src/auth/auth-types";
import { BLOG_POST_STATUS } from "src/blogpost/blogpost-types";
import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { USER_ROLES } from "src/user/user-types";
import { findExistingEntity } from "src/utils/db.utils";

import { CreateCommentInput, UpdateCommentInput } from "./comment.interface";
import { COMMENT_STATUS } from "./comments-types";
import {
  commentCacheKeyById,
  invalidateCommentCacheKeyById,
} from "./comments.cache-keys";
import { COMMENT_CONSTANTS } from "./comments.constants";

@Injectable()
export class CommentsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(BlogpostEntity)
    private readonly blogpostRepository: Repository<BlogpostEntity>,
  ) {}
  async create(createCommentInput: CreateCommentInput): Promise<void> {
    const existingPost = await findExistingEntity(this.blogpostRepository, {
      id: createCommentInput.postId,
      status: BLOG_POST_STATUS.PUBLISHED,
    });

    if (!existingPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const comment = this.commentRepository.create(createCommentInput);
    await this.commentRepository.save(comment);
  }

  async findOne(id: string): Promise<CommentEntity> {
    const cacheKey = commentCacheKeyById(id);
    const cached = await this.cache.get<CommentEntity>(cacheKey);
    if (cached) return cached;

    const comment = await this.commentRepository
      .createQueryBuilder("comment")
      .select(COMMENT_CONSTANTS.GET_ONE_COMMENT_SELECT)
      .where("comment.id =  :id", { id })
      .getOne();

    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.cache.set(cacheKey, comment);
    return comment;
  }

  async update(
    userId: string,
    commentId: string,
    updateCommentInput: UpdateCommentInput,
  ): Promise<void> {
    const comment = await this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.blogPost", "blogpost")
      .where("comment.id = :id", {
        id: commentId,
      })
      .getOne();

    if (!comment) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);

    const isCommentOwner = comment.authorId === userId;
    const isPostOwner = comment.blogPost.authorId === userId;

    if (updateCommentInput.content && !isCommentOwner) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }
    if (updateCommentInput.content)
      comment.content = updateCommentInput.content;
    comment.status = COMMENT_STATUS.PENDING;

    if (updateCommentInput.isApproved !== undefined && !isPostOwner) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    if (updateCommentInput.isApproved !== undefined) {
      comment.status = updateCommentInput.isApproved
        ? COMMENT_STATUS.APPROVED
        : COMMENT_STATUS.REJECTED;
    }
    await invalidateCommentCacheKeyById(this.cache, comment.id);
    await this.commentRepository.save(comment);
  }

  async remove(id: string, user: TokenPayload): Promise<void> {
    const comment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.id = :id", {
        id,
      })
      .getOne();

    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const isOwner = comment.authorId === user.id;
    const isAdmin = user.role === USER_ROLES.ADMIN;

    if (!isOwner && !isAdmin)
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);

    await invalidateCommentCacheKeyById(this.cache, comment.id);
    await this.commentRepository.softRemove(comment);
  }
}
