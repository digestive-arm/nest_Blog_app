import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '../modules/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleApproval } from 'src/modules/database/entities/role-management.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { AuthUtils } from 'src/utils/auth.utils';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleApproval])],
  controllers: [UserController],
  providers: [UserService, AuthUtils, AuthGuard],
  exports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
