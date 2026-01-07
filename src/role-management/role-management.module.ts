import { Module } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagementController } from './role-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleApproval } from 'src/entities/role-approval.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { AuthUtils } from 'src/utils/auth.utils';

@Module({
  imports: [TypeOrmModule.forFeature([RoleApproval, User])],
  controllers: [RoleManagementController],
  providers: [RoleManagementService, RoleApproval, User, AuthUtils, AuthGuard],
  exports: [TypeOrmModule.forFeature([RoleApproval])],
})
export class RoleManagementModule {}
