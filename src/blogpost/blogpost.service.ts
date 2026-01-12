import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { Repository } from 'typeorm';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { generateSlug } from 'src/utils/blogpost.utils';
import { SORT_ORDER, SORTBY } from 'src/common/enums';
import { paginationMeta } from 'src/common/interfaces/pagination.interfaces';
import { BLOG_POST_SELECT } from './blogpost.constants';

import {
  getOffset,
  getPageinationMeta,
} from 'src/common/helper/pagination.helper';
import {
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from './interfaces/blogpost.interface';
import { BLOG_POST_STATUS } from './blogpost-types';

@Injectable()
export class BlogpostService {
  constructor(
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
  ) {}

  async create(createBlogPostInput: CreateBlogPostInput): Promise<void> {
    const existing = await this.blogPostRepository.exists({
      where: { title: createBlogPostInput.title },
    });

    if (existing) {
      throw new ConflictException(ERROR_MESSAGES.CONFLICT);
    }

    const blogPost = this.blogPostRepository.create(createBlogPostInput);
    const slug = generateSlug(blogPost.title, blogPost.id);

    blogPost.slug = slug;

    await this.blogPostRepository.save(blogPost);
  }

  async findAll(
    page: number,
    limit: number,
    isPagination: boolean,
  ): Promise<paginationMeta> {
    const queryBuilder = this.blogPostRepository
      .createQueryBuilder('post')
      .select(BLOG_POST_SELECT)
      .orderBy(`post.${SORTBY.CREATED_AT}`, SORT_ORDER.DESC);

    if (isPagination) {
      const offset = getOffset(page, limit);
      queryBuilder.skip(offset).take(limit);
    }
    const [items, total] = await queryBuilder.getManyAndCount();
    const result = getPageinationMeta({ items, page, limit, total });

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogpost`;
  }

  async update(id: string, updateBlogPostInput: UpdateBlogPostInput) {
    const result = await this.blogPostRepository.preload({
      id: id,
      ...updateBlogPostInput,
    });

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const newSlug = generateSlug(updateBlogPostInput.title, id);
    result.slug = newSlug;

    await this.blogPostRepository.save(result);
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
}
