import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { updateUserParams } from './user-types';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { paginationMeta } from 'src/common/interfaces/pagination.interfaces';
import { USER_SELECT_FIELDS } from 'src/user/user.constants';
import { SORT_ORDER, SORTBY } from 'src/common/enums';
import {
  getOffset,
  getPageinationMeta,
} from 'src/common/helper/pagination.helper';

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
      .select(USER_SELECT_FIELDS)
      .orderBy(`user.${SORTBY.CREATED_AT}`, SORT_ORDER.DESC);

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
      .select(USER_SELECT_FIELDS)
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
    const result = await this.userRepository.preload({
      id: id,
      ...updateUserParams,
    });

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.userRepository.save(result);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.preload({
      id,
      deletedAt: new Date(),
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.userRepository.save(user);
  }
}
