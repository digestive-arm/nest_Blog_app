import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BlogpostService } from "src/blogpost/blogpost.service";
import { UploadsService } from "src/uploads/uploads.service";

import { AttachmentEntity } from "../database/entities/attachment.entity";
import { BlogpostEntity } from "../database/entities/blogpost.entity";
import { CategoryEntity } from "../database/entities/category.entity";
import { CommentEntity } from "../database/entities/comment.entity";

import { CronService } from "./cron.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogpostEntity,
      CategoryEntity,
      AttachmentEntity,
      CommentEntity,
    ]),
  ],
  providers: [CronService, BlogpostService, UploadsService],
})
export class CronModule {}
