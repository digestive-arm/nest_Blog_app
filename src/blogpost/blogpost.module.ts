import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { OwnershipGuard } from 'src/modules/guards/ownership.guard';
import { AuthUtils } from 'src/utils/auth.utils';
import { UserEntity } from 'src/modules/database/entities/user.entity';
import { SearchService } from './search.service';
import { CommentEntity } from 'src/modules/database/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogpostEntity, UserEntity, CommentEntity]),
  ],
  controllers: [BlogpostController],
  providers: [
    BlogpostService,
    BlogpostEntity,
    SearchService,
    AuthGuard,
    OwnershipGuard,
    AuthUtils,
  ],
  exports: [BlogpostEntity],
})
export class BlogpostModule {}
