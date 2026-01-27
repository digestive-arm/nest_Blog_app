import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleApproval } from "src/modules/database/entities/role-management.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { AuthUtils } from "src/utils/auth.utils";

import { RoleManagementController } from "./role-management.controller";
import { RoleManagementService } from "./role-management.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoleApproval, UserEntity])],
  controllers: [RoleManagementController],
  providers: [
    RoleManagementService,
    RoleApproval,
    UserEntity,
    AuthUtils,
    AuthGuard,
  ],
  exports: [TypeOrmModule.forFeature([RoleApproval])],
})
export class RoleManagementModule {}
