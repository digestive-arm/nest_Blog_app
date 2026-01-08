import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { userRoles } from 'src/user/user-types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class AccessRoleGuard implements CanActivate {
  constructor(
    protected readonly userRepository: Repository<User>,
    protected readonly allowedRoles: userRoles[],
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const reqUser = request.user;

    if (!reqUser?.id) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({
      where: { id: reqUser.id },
      select: ['id', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Required roles: ${this.allowedRoles.join(', ')}`,
      );
    }

    return true;
  }
}

export const RolesGuard = (...roles: userRoles[]): Type<any> => {
  @Injectable()
  class RolesGuardWithArgs extends AccessRoleGuard {
    constructor(
      @InjectRepository(User)
      userRepository: Repository<User>,
    ) {
      super(userRepository, roles);
    }
  }

  return RolesGuardWithArgs;
};
