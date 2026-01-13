import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogpostEntity } from '../database/entities/blogpost.entity';
import { Repository } from 'typeorm';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { UserEntity } from '../database/entities/user.entity';
import { USER_ROLES } from 'src/user/user-types';

export class OwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(BlogpostEntity)
    private readonly blogPostRepository: Repository<BlogpostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user: decoded } = request;
    const { id: postId } = request.params;

    if (!decoded?.id) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.id },
      select: ['id', 'role'],
    });

    const post = await this.blogPostRepository.findOne({
      where: { id: postId },
      select: ['authorId', 'id'],
    });

    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    if (!user || user.role !== USER_ROLES.AUTHOR) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    //Only author of the post can publish it.
    if (post.authorId !== user.id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    return true;
  }
}
