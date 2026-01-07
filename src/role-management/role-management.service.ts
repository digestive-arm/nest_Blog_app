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
import { userRoles } from 'src/user/user.types';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RoleManagementService {
  constructor(
    @InjectRepository(RoleApproval)
    private readonly roleApprovalRepository: Repository<RoleApproval>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //request upgrade
  async requestUpdgrade(
    requestedRole: userRoles,
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('No user exists with provided userid');
    }

    const requestExists = await this.roleApprovalRepository.findOne({
      where: {
        userId: user.id,
        requestedRole,
      },
    });

    if (requestExists) {
      throw new ConflictException('A role approval request already exists!');
    }
    const roleUpdationRequest = new RoleApproval();
    roleUpdationRequest.requestedRole = requestedRole;
    roleUpdationRequest.status = RoleApprovalStatus.PENDING;
    roleUpdationRequest.userId = user.id;

    await this.roleApprovalRepository.save(roleUpdationRequest);
  }

  //get my requests
  async getMyRequests(userId: string): Promise<RoleApproval[]> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('No user exists with provided userId');
    }

    const result = await this.roleApprovalRepository.findBy({
      userId,
    });

    if (result.length === 0) {
      throw new NotFoundException('No requests found for given userId');
    }

    return result;
  }

  //get pending reqests
  async getPendingRequest(): Promise<RoleApproval[]> {
    const result = await this.roleApprovalRepository.find({
      where: {
        status: RoleApprovalStatus.PENDING,
      },
    });

    return result;
  }

  //approve / reject request
  async processRequest(
    isApproved: boolean,
    roleApprovalRequestId: string,
  ): Promise<void> {
    const requestExists = await this.roleApprovalRepository.findOneBy({
      id: roleApprovalRequestId,
    });

    if (!requestExists) {
      throw new NotFoundException(
        'No role approval request exists with given request id',
      );
    }
    const updateStatus = isApproved
      ? RoleApprovalStatus.APPROVED
      : RoleApprovalStatus.REJECTED;

    await this.roleApprovalRepository.update(
      {
        id: roleApprovalRequestId,
      },
      {
        status: updateStatus,
      },
    );

    if (isApproved) {
      await this.userRepository.update(
        {
          id: requestExists.userId,
        },
        {
          role: requestExists.requestedRole,
        },
      );
    }
  }
}
