import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { DataSource, EntityManager, Repository } from "typeorm";

import { TokenPayload } from "src/auth/auth-types";
import { COMMENT_STATUS } from "src/comments/comments-types";
import { SORT_ORDER, SORTBY } from "src/common/enums";
import {
  getOffset,
  getPaginationMeta,
} from "src/common/helper/pagination.helper";
import {
  PaginationInput,
  PaginationMeta,
} from "src/common/interfaces/pagination.interfaces";
import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { AttachmentEntity } from "src/modules/database/entities/attachment.entity";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { UploadResult } from "src/uploads/upload.interface";
import { UploadsService } from "src/uploads/uploads.service";
import { USER_ROLES } from "src/user/user-types";
import { generateSlug } from "src/utils/blogpost.utils";
import { findExistingEntity } from "src/utils/db.utils";

import { BLOG_POST_STATUS } from "./blogpost-types";
import { BLOG_POST_CONSTANTS } from "./blogpost.constants";
import {
  CreateBlogPostInput,
  GetCommentsOnPostInput,
  UpdateBlogPostInput,
} from "./interfaces/blogpost.interface";

@Injectable()
export class BlogpostService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly attachmentService: UploadsService,
    private readonly dataSource: DataSource,
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepository: Repository<AttachmentEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(
    createBlogPostInput: CreateBlogPostInput,
    files: Express.Multer.File[],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const transactionalBlogPostRepo = manager.withRepository(
        this.blogPostRepository,
      );
      const transactionalCategoryRepo = manager.withRepository(
        this.categoryRepository,
      );
      const existing = await findExistingEntity(transactionalBlogPostRepo, {
        title: createBlogPostInput.title,
      });
      if (existing) {
        throw new ConflictException(ERROR_MESSAGES.CONFLICT);
      }

      const blogPost = transactionalBlogPostRepo.create(createBlogPostInput);

      if (createBlogPostInput.categoryId) {
        const existingCategory = await findExistingEntity(
          transactionalCategoryRepo,
          {
            id: createBlogPostInput.categoryId,
          },
        );

        if (!existingCategory) {
          throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
        }
        blogPost.categoryId = createBlogPostInput.categoryId;
      }

      blogPost.slug = generateSlug(blogPost.title);

      const savedPost = await transactionalBlogPostRepo.save(blogPost);

      await this.saveAttachment(savedPost.id, files, manager);
    });
  }

  async findAll(
    { page, limit, isPagination }: PaginationInput,
    q?: string,
  ): Promise<PaginationMeta<BlogpostEntity>> {
    const cacheKey =
      `blogPosts:v1:` +
      `page=${page}:` +
      `limit=${limit}:` +
      `pagination=${isPagination}:` +
      `q=${q ?? "none"}`;

    const cached =
      await this.cache.get<PaginationMeta<BlogpostEntity>>(cacheKey);
    if (cached) return cached;

    const qb = this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoin("post.attachments", "attachment")
      .select(BLOG_POST_CONSTANTS.GET_ALL_BLOG_POST_SELECT);
    if (q) {
      qb.where(BLOG_POST_CONSTANTS.SEARCH_QUERY, {
        q: `%${q}%`,
      });
    }
    qb.andWhere("post.status = :status", {
      status: BLOG_POST_STATUS.PUBLISHED,
    }).orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.DESC);

    if (isPagination) {
      const offset = getOffset(page, limit);
      qb.skip(offset).take(limit);
    }
    const [items, total] = await qb.getManyAndCount();
    const result = getPaginationMeta({ items, page, limit, total });
    await this.cache.set(cacheKey, result, 5000);
    return result;
  }

  async findOne(slug: string): Promise<BlogpostEntity> {
    const cacheKey = `post:${slug}`;
    const cached = await this.cache.get<BlogpostEntity>(cacheKey);
    if (cached) return cached;

    const result = await this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoin("post.attachments", "attachment")
      .select(BLOG_POST_CONSTANTS.GET_ALL_BLOG_POST_SELECT)
      .where("post.slug = :slug", {
        slug,
      })
      .getOne();

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    await this.cache.set(cacheKey, result, 5000);
    return result;
  }

  async update(
    userId: string,
    id: string,
    updateBlogPostInput: UpdateBlogPostInput,
  ): Promise<void> {
    const blogPost = await this.blogPostRepository
      .createQueryBuilder("post")
      .where("post.id = :id", {
        id,
      })
      .getOne();

    if (!blogPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const isOwnerOfPost = blogPost.authorId === userId;

    if (!isOwnerOfPost) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    if (updateBlogPostInput.content)
      blogPost.content = updateBlogPostInput.content;

    if (updateBlogPostInput.summary)
      blogPost.summary = updateBlogPostInput.summary;

    if (updateBlogPostInput.title) {
      blogPost.title = updateBlogPostInput.title;
    }

    if (
      updateBlogPostInput.title &&
      blogPost.status === BLOG_POST_STATUS.DRAFT
    ) {
      blogPost.slug = generateSlug(updateBlogPostInput.title, id);
    }

    if (updateBlogPostInput.categoryId) {
      const existingCategory = await findExistingEntity(
        this.categoryRepository,
        {
          id: updateBlogPostInput.categoryId,
        },
      );

      if (!existingCategory) {
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }
      blogPost.categoryId = updateBlogPostInput.categoryId;
    }

    await this.blogPostRepository.save(blogPost);
  }

  async remove(id: string, user: TokenPayload): Promise<void> {
    const blogPost = await this.blogPostRepository.findOne({
      where: {
        id,
      },
    });

    if (!blogPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const isOwner = blogPost.authorId === user.id;
    const isAdmin = user.role === USER_ROLES.ADMIN;

    if (!isOwner && !isAdmin)
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);

    await this.blogPostRepository.softRemove(blogPost);
  }

  async publish(id: string, user: TokenPayload): Promise<void> {
    const blogPost = await this.blogPostRepository.preload({
      id,
      status: BLOG_POST_STATUS.PUBLISHED,
    });

    if (!blogPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const isOwner = blogPost.authorId === user.id;

    if (!isOwner) throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);

    await this.blogPostRepository.save(blogPost);
  }

  async getCommentsOnPost(
    id: string,
    { isPagination, page, limit, isPending }: GetCommentsOnPostInput,
  ): Promise<PaginationMeta<CommentEntity>> {
    const cacheKey = `post:${id}:comments:page=${page}:limit=${limit}:isPagination=${isPagination}`;
    const cached =
      await this.cache.get<PaginationMeta<CommentEntity>>(cacheKey);
    if (cached) {
      return cached;
    }

    const existingPost = await findExistingEntity(this.blogPostRepository, {
      id,
    });
    if (!existingPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const qb = this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "author")
      .select(BLOG_POST_CONSTANTS.GET_COMMENTS_ON_POST_SELECT)
      .where("comment.postId = :id", {
        id,
      });

    if (isPending) {
      qb.andWhere("comment.status = :status", {
        status: COMMENT_STATUS.PENDING,
      });
    } else {
      qb.andWhere("comment.status IN (:...statuses)", {
        statuses: [COMMENT_STATUS.APPROVED, COMMENT_STATUS.PENDING],
      });
    }

    if (isPagination) {
      const skip = getOffset(page, limit);
      qb.skip(skip).limit(limit);
    }

    const [items, total] = await qb.getManyAndCount();
    const result = getPaginationMeta({ items, page, limit, total });
    await this.cache.set(cacheKey, result, 5000);
    return result;
  }

  async saveAttachment(
    postId: string,
    files: Express.Multer.File[],
    manager?: EntityManager,
  ): Promise<void> {
    const attachmentRepo = manager
      ? manager.withRepository(this.attachmentRepository)
      : this.attachmentRepository;
    let uploads: UploadResult[] = [];
    try {
      if (files.length) {
        uploads = (
          await this.attachmentService.uploadMultipleAttachments(files)
        ).data;
      }

      if (uploads.length) {
        await attachmentRepo.save(
          uploads.map((u) => ({
            postId,
            publicId: u.public_id,
            url: u.secure_url,
          })),
        );
      }
    } catch (error) {
      if (uploads.length) {
        await this.attachmentService.deleteMultipleAttachments(
          uploads.map((u) => u.public_id),
        );
      }

      throw error;
    }
  }

  async cleanupSoftDeleteRecords(): Promise<void> {
    const cutOffDate = new Date();
    cutOffDate.setDate(
      cutOffDate.getDate() -
        BLOG_POST_CONSTANTS.SOFT_DELETED_POSTS_CLEANUP_INTERVAL,
    );

    const expiredPosts = await this.blogPostRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.attachments", "image")
      .select(["post.id", "image.id", "image.publicId"])
      .withDeleted()
      .where("post.deletedAt < :cutOffDate", {
        cutOffDate,
      })
      .getMany();

    if (expiredPosts.length === 0) return;

    const postIds = expiredPosts.map((post) => post.id);
    const attachmentPublicIds = expiredPosts.flatMap((post) =>
      post.attachments.map((attachment) => attachment.publicId),
    );

    if (attachmentPublicIds.length > 0) {
      await this.attachmentService.deleteMultipleAttachments(
        attachmentPublicIds,
      );
    }

    await this.blogPostRepository.delete(postIds);
  }
}
