import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommentsService } from "src/comments/comments.service";
import { AttachmentEntity } from "src/modules/database/entities/attachment.entity";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { UploadsService } from "src/uploads/uploads.service";

import { BlogpostController } from "./blogpost.controller";
import { BlogpostService } from "./blogpost.service";

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
    CategoryEntity,
    CommentEntity,
    AttachmentEntity,
    UploadsService,
  ],
  exports: [BlogpostEntity],
})
export class BlogpostModule {}
