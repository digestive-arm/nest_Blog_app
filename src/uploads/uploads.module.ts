import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import CloudinaryProvider from "src/config/upload.config";
import { AttachmentEntity } from "src/modules/database/entities/attachment.entity";

import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentEntity])],
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class UploadsModule {}
