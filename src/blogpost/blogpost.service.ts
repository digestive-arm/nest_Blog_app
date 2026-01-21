import { InjectRepository } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { generateSlug } from 'src/utils/blogpost.utils';
import { SORT_ORDER, SORTBY } from 'src/common/enums';
import {
  paginationInput,
  paginationMeta,
} from 'src/common/interfaces/pagination.interfaces';
import {
  GET_ALL_BLOG_POST_SELECT,
  GET_COMMENTS_ON_POST_SELECT,
  SOFT_DELETED_POSTS_CLEANUP_INTERVAL,
} from './blogpost.constants';
import { BLOG_POST_STATUS } from './blogpost-types';
import { AttachmentEntity } from 'src/modules/database/entities/attachment.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { UploadResult } from 'src/uploads/upload.interface';
import { CategoryEntity } from 'src/modules/database/entities/category.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  getOffset,
  getPageinationMeta,
} from 'src/common/helper/pagination.helper';
import {
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from './interfaces/blogpost.interface';
import { COMMENT_STATUS } from 'src/comments/comments-types';
import { CommentEntity } from 'src/modules/database/entities/comment.entity';
import { findExistingEntity } from 'src/utils/db.utils';

@Injectable()
export class BlogpostService {
  constructor(
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepository: Repository<AttachmentEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly attachmentService: UploadsService,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(
    createBlogPostInput: CreateBlogPostInput,
    files: Express.Multer.File[],
  ): Promise<void> {
    const existing = await this.blogPostRepository.exists({
      where: { title: createBlogPostInput.title },
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.CONFLICT);
    }

    const blogPost = this.blogPostRepository.create(createBlogPostInput);
    blogPost.slug = generateSlug(blogPost.title);

    if (createBlogPostInput.categoryId) {
      const exisingCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.id = :id', {
          id: createBlogPostInput.categoryId,
        })
        .getOne();

      if (!exisingCategory) {
        throw new NotFoundException('No category exists with provided id');
      }

      blogPost.categoryId = createBlogPostInput.categoryId;
    }

    const savedPost = await this.blogPostRepository.save(blogPost);

    await this.saveAttachment(savedPost.id, files);
  }

  async findAll(
    page: number,
    limit: number,
    isPagination: boolean,
  ): Promise<paginationMeta> {
    const queryBuilder = this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoin('post.attachments', 'attachment')
      .select(GET_ALL_BLOG_POST_SELECT)
      .orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.DESC);

    if (isPagination) {
      const offset = getOffset(page, limit);
      queryBuilder.skip(offset).take(limit);
    }
    const [items, total] = await queryBuilder.getManyAndCount();
    const result = getPageinationMeta({ items, page, limit, total });

    return result;
  }

  async findOne(slug: string) {
    const result = await this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoin('post.attachments', 'attachment')
      .select(GET_ALL_BLOG_POST_SELECT)
      .where('post.slug = :slug', {
        slug,
      })
      .getOne();

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    return result;
  }

  async update(id: string, updateBlogPostInput: UpdateBlogPostInput) {
    if (updateBlogPostInput.categoryId) {
      const existingCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.id = :id', {
          id: updateBlogPostInput.categoryId,
        })
        .getOne();

      if (!existingCategory) {
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }
    }
    let slug: string = '';

    if (updateBlogPostInput.title) {
      slug = generateSlug(updateBlogPostInput.title, id);
      const existing = await this.blogPostRepository
        .createQueryBuilder('post')
        .where('post.title = :title OR post.slug = :slug', {
          title: updateBlogPostInput.title,
          slug,
        })
        .getOne();

      if (existing) {
        throw new ConflictException(ERROR_MESSAGES.CONFLICT);
      }
    }
    const blogPost = await this.blogPostRepository.preload({
      id: id,
      ...updateBlogPostInput,
    });

    if (!blogPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    if (updateBlogPostInput.title) {
      blogPost.slug = slug;
    }

    await this.blogPostRepository.save(blogPost);
  }

  async remove(id: string) {
    const blogPost = await this.blogPostRepository.findOne({
      where: {
        id,
      },
    });

    if (!blogPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.blogPostRepository.softRemove(blogPost);
  }

  async publish(id: string) {
    const blogPost = await this.blogPostRepository.preload({
      id,
      status: BLOG_POST_STATUS.PUBLISHED,
    });

    if (!blogPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.blogPostRepository.save(blogPost);
  }

  async processComment(commentId: string, isApproved: boolean) {
    const status = isApproved
      ? COMMENT_STATUS.APPROVED
      : COMMENT_STATUS.REJECTED;
    const comment = await this.commentRepository.preload({
      id: commentId,
      status,
    });
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.commentRepository.save(comment);
  }

  async getCommentsOnPost(
    id: string,
    { page, limit, isPagination }: paginationInput,
  ) {
    const existingPost = await findExistingEntity(this.blogPostRepository, {
      id,
    });
    if (!existingPost) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'author')
      .select(GET_COMMENTS_ON_POST_SELECT)
      .where('comment.postId = :id', { id })
      .andWhere('comment.status = :status', {
        status: COMMENT_STATUS.APPROVED,
      });

    if (isPagination) {
      const skip = getOffset(page, limit);
      qb.skip(skip).limit(limit);
    }

    const [items, total] = await qb.getManyAndCount();
    const result = getPageinationMeta({ items, page, limit, total });
    return result;
  }

  async saveAttachment(postId: string, files: Express.Multer.File[]) {
    let uploads: UploadResult[] = [];
    try {
      if (files.length) {
        uploads = (
          await this.attachmentService.uploadMultipleAttachments(files)
        ).data;
      }

      if (uploads.length) {
        await this.attachmentRepository.save(
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

  async cleanupSoftDeleteRecords() {
    const cutOffDate = new Date();
    cutOffDate.setDate(
      cutOffDate.getDate() - SOFT_DELETED_POSTS_CLEANUP_INTERVAL,
    );

    const expiredPosts = await this.blogPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.attachments', 'image')
      .select(['post.id', 'image.id', 'image.publicId'])
      .withDeleted()
      .where('post.deletedAt < :cutOffDate', {
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
