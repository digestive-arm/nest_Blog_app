import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { updateUserParams } from './user-types';
import {
  getOffset,
  getPageinationMeta,
} from 'src/common/helper/pagination.helper';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { paginationMeta } from 'src/common/interfaces/pagination.interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    isPagination: boolean,
  ): Promise<paginationMeta> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.role',
        'user.username',
        'user.firstname',
        'user.lastname',
      ])
      .orderBy('user.createdAt', 'DESC');

    if (isPagination) {
      const offset = getOffset(page, limit);
      queryBuilder.skip(offset).take(limit);
    }
    const [items, total] = await queryBuilder.getManyAndCount();
    const result = getPageinationMeta({ items, page, limit, total });

    return result;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.role',
        'user.username',
        'user.firstname',
        'user.lastname',
      ])
      .where('user.id = :id', {
        id,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    return user;
  }

  async update(id: string, updateUserParams: updateUserParams): Promise<void> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .update({
        ...updateUserParams,
        updatedAt: () => 'CURRENT_TIMESTAMP',
      })
      .where('id = :id', { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
  }

  async remove(id: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id })
      .execute();
  }
}
