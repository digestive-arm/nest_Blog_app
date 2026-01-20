import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import CloudinaryProvider from 'src/config/upload.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentEntity } from 'src/modules/database/entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentEntity])],
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class UploadsModule {}
