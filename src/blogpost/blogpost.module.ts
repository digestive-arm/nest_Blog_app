import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { OwnershipGuard } from 'src/modules/guards/ownership.guard';
import { AuthUtils } from 'src/utils/auth.utils';
import { UserEntity } from 'src/modules/database/entities/user.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { AttachmentEntity } from 'src/modules/database/entities/attachment.entity';
import { CategoryEntity } from 'src/modules/database/entities/category.entity';
import { CommentEntity } from 'src/modules/database/entities/comment.entity';
import { CommentsService } from 'src/comments/comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogpostEntity,
      UserEntity,
      AttachmentEntity,
      CommentEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [BlogpostController],
  providers: [
    BlogpostService,
    CommentsService,
    BlogpostEntity,
    AuthGuard,
    OwnershipGuard,
    AuthUtils,
    CategoryEntity,
    CommentEntity,
    AttachmentEntity,
    UploadsService,
  ],
  exports: [BlogpostEntity],
})
export class BlogpostModule {}
