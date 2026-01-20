import { InjectRepository } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { generateSlug } from 'src/utils/blogpost.utils';
import { SORT_ORDER, SORTBY } from 'src/common/enums';
import { paginationMeta } from 'src/common/interfaces/pagination.interfaces';
import { GET_ALL_BLOG_POST_SELECT } from './blogpost.constants';
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
}
