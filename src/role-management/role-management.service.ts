import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RoleApproval,
  RoleApprovalStatus,
} from 'src/entities/role-approval.entity';
import { Repository } from 'typeorm';
import { userRoles } from 'src/user/user-types';
import { User } from 'src/user/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';

@Injectable()
export class RoleManagementService {
  constructor(
    @InjectRepository(RoleApproval)
    private readonly roleApprovalRepository: Repository<RoleApproval>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //request upgrade
  async requestUpdgrade(requestedRole: userRoles, id: string): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .where('user.id = :id', {
        id,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const requestExists = await this.roleApprovalRepository
      .createQueryBuilder('role')
      .where('role.userId = :id AND role.requestedRole = :requestedRole', {
        id,
        requestedRole,
      })
      .getOne();

    if (requestExists) {
      throw new ConflictException(ERROR_MESSAGES.CONFLICT);
    }

    await this.roleApprovalRepository
      .createQueryBuilder('role')
      .insert()
      .into(RoleApproval)
      .values([{ requestedRole, userId: id }])
      .execute();
  }

  //get my requests
  async getMyRequests(id: string): Promise<RoleApproval[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id'])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const result = await this.roleApprovalRepository
      .createQueryBuilder('role')
      .where('role.userId = :id', {
        id,
      })
      .getMany();

    if (result.length === 0) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

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

    await this.roleApprovalRepository
      .createQueryBuilder('role')
      .update({ status: updateStatus })
      .where('id = :roleApprovalRequestId', {
        roleApprovalRequestId,
      })
      .execute();

    const { userId, requestedRole: role } = requestExists;

    if (isApproved) {
      await this.userRepository
        .createQueryBuilder('user')
        .update({
          role,
        })
        .where('user.id = :userId', { userId })
        .execute();
    }
  }
}
