import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

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
import { USER_CONSTANTS } from "src/user/user.constants";
import { findExistingEntity } from "src/utils/db.utils";

import { UserEntity } from "../modules/database/entities/user.entity";

import { UpdateUserParams } from "./interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async findAll({
    page,
    limit,
    isPagination,
  }: PaginationInput): Promise<PaginationMeta<UserEntity>> {
    const cacheKey = `users:v1:page=${page}:limit=${limit}:pagination=${isPagination}`;
    const cached = await this.cache.get<PaginationMeta<UserEntity>>(cacheKey);
    if (cached) return cached;

    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .select(USER_CONSTANTS.USER_SELECT_FIELDS)
      .orderBy(`user.${SORTBY.CREATED_AT}`, SORT_ORDER.DESC);

    if (isPagination) {
      const offset = getOffset(page, limit);
      queryBuilder.skip(offset).take(limit);
    }
    const [items, total] = await queryBuilder.getManyAndCount();
    const result = getPaginationMeta({ items, page, limit, total });

    await this.cache.set(cacheKey, result);
    return result;
  }

  async findOne(id: string): Promise<UserEntity> {
    const cacheKey = `user:id:${id}`;
    const cached = await this.cache.get<UserEntity>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepository
      .createQueryBuilder("user")
      .select(USER_CONSTANTS.USER_SELECT_FIELDS)
      .where("user.id = :id", {
        id,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.cache.set(cacheKey, user);

    return user;
  }

  async update(
    userId: string,
    id: string,
    updateUserParams: UpdateUserParams,
  ): Promise<void> {
    if (userId !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    const cacheKey = `user:id:${id}`;
    if (updateUserParams.userName) {
      const existing = await findExistingEntity(this.userRepository, {
        userName: updateUserParams.userName,
      });

      if (existing) {
        throw new ConflictException(ERROR_MESSAGES.CONFLICT);
      }
    }
    const result = await this.userRepository.preload({
      id,
      ...updateUserParams,
    });

    if (!result) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.userRepository.save(result);
    await this.cache.del(cacheKey);
  }

  async remove(id: string): Promise<void> {
    const cacheKey = `user:id:${id}`;
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", {
        id,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.userRepository.softRemove(user);
    await this.cache.del(cacheKey);
  }
}
