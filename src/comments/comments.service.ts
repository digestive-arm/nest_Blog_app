import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/modules/database/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentInput, UpdateCommentInput } from './comment.interface';
import { paginationInput } from 'src/common/interfaces/pagination.interfaces';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { findExistingEntity } from 'src/utils/db.utils';
import { UserEntity } from 'src/modules/database/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { BLOG_POST_STATUS } from 'src/blogpost/blogpost-types';
import { COMMENT_STATUS } from './comments-types';
import {
  GET_ALL_COMMENTS_SELECT,
  GET_ONE_COMMENT_SELECT,
} from './comments.constants';
import {
  getOffset,
  getPageinationMeta,
} from 'src/common/helper/pagination.helper';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(BlogpostEntity)
    private readonly blogpostRepository: Repository<BlogpostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createCommentInput: CreateCommentInput) {
    const existingPost = await findExistingEntity(this.blogpostRepository, {
      id: createCommentInput.postId,
      status: BLOG_POST_STATUS.PUBLISHED,
    });

    const existingAuthor = await findExistingEntity(this.userRepository, {
      id: createCommentInput.authorId,
    });

    if (!existingPost || !existingAuthor) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const comment = this.commentRepository.create(createCommentInput);
    await this.commentRepository.save(comment);
  }

  async findAll({ page, limit, isPagination }: paginationInput) {
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .select(GET_ALL_COMMENTS_SELECT);
    if (isPagination) {
      const skip = getOffset(page, limit);
      qb.skip(skip).limit(limit);
    }
    const [items, total] = await qb.getManyAndCount();

    const result = getPageinationMeta({ items, page, limit, total });
    return result;
  }

  async findOne(id: string) {
    const existingComment = await findExistingEntity(this.commentRepository, {
      id,
    });
    if (!existingComment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .select(GET_ONE_COMMENT_SELECT)
      .where('comment.id =  :id', { id })
      .getOne();
    return comment;
  }

  async update(id: string, updateCommentInput: UpdateCommentInput) {
    const comment = await this.commentRepository.preload({
      id,
      ...updateCommentInput,
    });
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.commentRepository.save(comment);
  }

  async remove(id: string) {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', {
        id,
      })
      .getOne();

    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.commentRepository.softRemove(comment);
  }
}
