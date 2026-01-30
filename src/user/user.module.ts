import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleApproval } from "src/modules/database/entities/role-management.entity";
import { AuthGuard } from "src/modules/guards/auth.guard";

import { UserEntity } from "../modules/database/entities/user.entity";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleApproval])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
