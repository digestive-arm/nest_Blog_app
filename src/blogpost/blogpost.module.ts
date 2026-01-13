import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { OwnershipGuard } from 'src/modules/guards/ownership.guard';
import { AuthUtils } from 'src/utils/auth.utils';
import { UserEntity } from 'src/modules/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogpostEntity, UserEntity])],
  controllers: [BlogpostController],
  providers: [
    BlogpostService,
    BlogpostEntity,
    AuthGuard,
    OwnershipGuard,
    AuthUtils,
  ],
  exports: [BlogpostEntity],
})
export class BlogpostModule {}
