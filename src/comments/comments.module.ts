import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/modules/database/entities/comment.entity';
import { UserEntity } from 'src/modules/database/entities/user.entity';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { AuthUtils } from 'src/utils/auth.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, UserEntity, BlogpostEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentEntity, AuthGuard, AuthUtils],
  exports: [CommentEntity],
})
export class CommentsModule {}
