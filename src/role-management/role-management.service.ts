import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository, DataSource } from "typeorm";

import { TokenPayload } from "src/auth/auth-types";
import {
  getOffset,
  getPaginationMeta,
} from "src/common/helper/pagination.helper";
import { PaginationMeta } from "src/common/interfaces/pagination.interfaces";
import { ERROR_MESSAGES } from "src/constants/messages.constants";
import {
  RoleApproval,
  RoleApprovalStatus,
} from "src/modules/database/entities/role-management.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_ROLES } from "src/user/user-types";
import { findExistingEntity } from "src/utils/db.utils";

import { ProcessRequestInput } from "./interfaces/role-management.interface";

@Injectable()
export class RoleManagementService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(RoleApproval)
    private readonly roleApprovalRepository: Repository<RoleApproval>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // request upgrade
  async requestUpgrade(
    requestedRole: USER_ROLES,
    user: TokenPayload,
  ): Promise<void> {
    const existingUser = await findExistingEntity(this.userRepository, {
      id: user.id,
    });

    if (!existingUser) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    if (user.role === requestedRole) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    const requestExists = await findExistingEntity(
      this.roleApprovalRepository,
      {
        userId: user.id,
        status: RoleApprovalStatus.PENDING,
      },
    );

    if (requestExists) {
      throw new ConflictException(ERROR_MESSAGES.CONFLICT);
    }

    await this.roleApprovalRepository.save({
      requestedRole,
      userId: user.id,
    });
  }

  // get my requests
  async getMyRequests(id: string): Promise<Partial<RoleApproval[]>> {
    const user = await findExistingEntity(this.userRepository, {
      id,
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const result = await this.roleApprovalRepository
      .createQueryBuilder("role")
      .where("role.userId = :id", {
        id,
      })
      .getMany();

    return result;
  }

  // get pending requests
  async getPendingRequest({
    page,
    limit,
    isPagination,
  }: ProcessRequestInput): Promise<PaginationMeta<RoleApproval>> {
    const qb = this.roleApprovalRepository
      .createQueryBuilder("role")
      .where("role.status = :status", {
        status: RoleApprovalStatus.PENDING,
      });

    if (isPagination) {
      const offset = getOffset(page, limit);
      qb.skip(offset).take(limit);
    }
    const [items, total] = await qb.getManyAndCount();

    const result = getPaginationMeta({ items, total, page, limit });
    return result;
  }

  // approve / reject request
  async processRequest(
    isApproved: boolean,
    roleApprovalRequestId: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const transactionalRoleRepo = manager.withRepository(
        this.roleApprovalRepository,
      );
      const transactionalUserRepo = manager.withRepository(this.userRepository);

      const requestExists = await transactionalRoleRepo
        .createQueryBuilder("role")
        .where("role.id = :roleApprovalRequestId", {
          roleApprovalRequestId,
        })
        .getOne();

      if (!requestExists) {
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }
      const { userId, requestedRole: role } = requestExists;

      if (isApproved) {
        const user = await transactionalUserRepo.preload({
          id: userId,
          role,
        });

        if (!user) {
          throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
        }

        await transactionalUserRepo.save(user);
      }
      requestExists.status = isApproved
        ? RoleApprovalStatus.APPROVED
        : RoleApprovalStatus.REJECTED;

      await transactionalRoleRepo.save(requestExists);
    });
  }
}
