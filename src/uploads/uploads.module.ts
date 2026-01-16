import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import CloudinaryProvider from 'src/config/upload.config';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class UploadsModule {}
