import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { BlogpostService } from 'src/blogpost/blogpost.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogpostEntity } from '../database/entities/blogpost.entity';
import { CategoryEntity } from '../database/entities/category.entity';
import { AttachmentEntity } from '../database/entities/attachment.entity';
import { CommentEntity } from '../database/entities/comment.entity';
import { UploadsService } from 'src/uploads/uploads.service';

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
