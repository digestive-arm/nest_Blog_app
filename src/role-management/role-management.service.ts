import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  RoleApproval,
  RoleApprovalStatus,
} from 'src/modules/database/entities/role-management.entity';
import { Repository } from 'typeorm';
import { USER_ROLES } from 'src/user/user-types';
import { User } from 'src/modules/database/entities/user.entity';
import { ERROR_MESSAGES } from 'src/constants/messages.constants';
import { ID_SELECT_FIELDS } from 'src/user/user.constants';

@Injectable()
export class RoleManagementService {
  constructor(
    @InjectRepository(RoleApproval)
    private readonly roleApprovalRepository: Repository<RoleApproval>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //request upgrade
  async requestUpdgrade(requestedRole: USER_ROLES, id: string): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(ID_SELECT_FIELDS)
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

    await this.roleApprovalRepository.save({
      requestedRole,
      userId: id,
    });
  }

  //get my requests
  async getMyRequests(id: string): Promise<Partial<RoleApproval[]>> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(ID_SELECT_FIELDS)
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
