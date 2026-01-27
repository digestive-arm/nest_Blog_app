import { copyFile } from "fs";

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { SORT_ORDER, SORTBY } from "src/common/enums";
import {
  getOffset,
  getPageinationMeta,
} from "src/common/helper/pagination.helper";
import {
  paginationInput,
  paginationMeta,
} from "src/common/interfaces/pagination.interfaces";
import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { USER_CONSTANTS } from "src/user/user.constants";
import { findExistingEntity } from "src/utils/db.utils";

import { UserEntity } from "../modules/database/entities/user.entity";

import { updateUserParams } from "./user-types";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll({
    page,
    limit,
    isPagination,
  }: paginationInput): Promise<paginationMeta> {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .select(USER_CONSTANTS.USER_SELECT_FIELDS)
      .orderBy(`user.${SORTBY.CREATED_AT}`, SORT_ORDER.DESC);

    if (isPagination) {
      const offset = getOffset(page, limit);
      queryBuilder.skip(offset).take(limit);
    }
    const [items, total] = await queryBuilder.getManyAndCount();
    const result = getPageinationMeta({ items, page, limit, total });

    return result;
  }

  async findOne(id: string): Promise<UserEntity> {
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

    return user;
  }

  async update(
    userId: string,
    id: string,
    updateUserParams: updateUserParams,
  ): Promise<void> {
    if (userId !== id) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

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
  }

  async remove(id: string): Promise<void> {
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
  }
}
