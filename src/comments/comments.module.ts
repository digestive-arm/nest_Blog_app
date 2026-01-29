import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { AuthGuard } from "src/modules/guards/auth.guard";

import { CommentsController } from "./comments.controller";
import { CommentsService } from "./comments.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, UserEntity, BlogpostEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentEntity, AuthGuard],
  exports: [CommentEntity],
})
export class CommentsModule {}
