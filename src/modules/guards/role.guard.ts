import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_ROLES } from "src/user/user-types";

@Injectable()
export class AccessRoleGuard implements CanActivate {
  constructor(
    protected readonly userRepository: Repository<UserEntity>,
    protected readonly allowedRoles: USER_ROLES[],
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const reqUser = request.user;

    if (!reqUser?.id) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({
      where: { id: reqUser.id },
      select: ["id", "role"],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.role === USER_ROLES.ADMIN) {
      // Admin has access to all routes
      return true;
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Your role doesn't have access to this resource.`,
      );
    }

    return true;
  }
}

export const RolesGuard = (...roles: USER_ROLES[]): Type<any> => {
  @Injectable()
  class RolesGuardWithArgs extends AccessRoleGuard {
    constructor(
      @InjectRepository(UserEntity)
      userRepository: Repository<UserEntity>,
    ) {
      super(userRepository, roles);
    }
  }

  return RolesGuardWithArgs;
};
