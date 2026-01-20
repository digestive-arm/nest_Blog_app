import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from 'src/modules/database/entities/comment.entity';
import { UserEntity } from 'src/modules/database/entities/user.entity';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, UserEntity, BlogpostEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentEntity],
  exports: [CommentEntity],
})
export class CommentsModule {}
