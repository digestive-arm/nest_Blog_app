import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RoleApproval,
  RoleApprovalStatus,
} from 'src/modules/database/entities/role-management.entity';
import { Repository } from 'typeorm';
import { USER_ROLES } from 'src/user/user-types';
import { UserEntity } from 'src/modules/database/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { findExistingEntity } from 'src/utils/db.utils';

@Injectable()
export class RoleManagementService {
  constructor(
    @InjectRepository(RoleApproval)
    private readonly roleApprovalRepository: Repository<RoleApproval>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  //request upgrade
  async requestUpdgrade(requestedRole: USER_ROLES, id: string): Promise<void> {
    const user = await findExistingEntity(this.userRepository, {
      id,
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const requestExists = await findExistingEntity(
      this.roleApprovalRepository,
      {
        userId: id,
        requestedRole,
      },
    );

    if (requestExists) {
      throw new ConflictException(ERROR_MESSAGES.CONFLICT);
    }

    await this.roleApprovalRepository.save({
      requestedRole,
      userId: id,
    });
  }

  //get my requests
  async getMyRequests(id: string): Promise<Partial<RoleApproval[]>> {
    const user = await findExistingEntity(this.userRepository, {
      id,
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const result = await this.roleApprovalRepository
      .createQueryBuilder('role')
      .where('role.userId = :id', {
        id,
      })
      .getMany();

    return result;
  }

  //get pending reqests
  async getPendingRequest(): Promise<RoleApproval[]> {
    const result = await this.roleApprovalRepository
      .createQueryBuilder('role')
      .where('role.status = :status', {
        status: RoleApprovalStatus.PENDING,
      })
      .getMany();

    return result;
  }

  //approve / reject request
  async processRequest(
    isApproved: boolean,
    roleApprovalRequestId: string,
  ): Promise<void> {
    const requestExists = await this.roleApprovalRepository
      .createQueryBuilder('role')
      .where('role.id = :roleApprovalRequestId', {
        roleApprovalRequestId,
      })
      .getOne();

    if (!requestExists) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    const updateStatus = isApproved
      ? RoleApprovalStatus.APPROVED
      : RoleApprovalStatus.REJECTED;

    const roleApproval = await this.roleApprovalRepository.preload({
      id: roleApprovalRequestId,
      status: updateStatus,
    });

    if (!roleApproval) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.roleApprovalRepository.save(roleApproval);

    const { userId, requestedRole: role } = requestExists;

    if (isApproved) {
      const user = await this.userRepository.preload({
        id: userId,
        role,
      });

      if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
      }

      await this.userRepository.save(user);
    }
  }
}
