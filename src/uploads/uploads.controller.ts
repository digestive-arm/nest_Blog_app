import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { uploadOptions } from "src/config/upload.config";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { UPLOAD_ROUTES } from "src/constants/routes";
import { UPLOAD_CONSTANTS } from "src/constants/upload.constants";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { messageResponse } from "src/utils/response.utils";

import { UploadResult } from "./upload.interface";
import { UploadMultipleResponse } from "./uploads.response";
import { UploadsService } from "./uploads.service";

@ApiTags(UPLOAD_ROUTES.UPLOAD)
@Controller(UPLOAD_ROUTES.UPLOAD)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseInterceptors(
    FilesInterceptor(
      UPLOAD_CONSTANTS.FILE_NAME,
      UPLOAD_CONSTANTS.MAX_UPLOAD_COUNT,
      uploadOptions,
    ),
  )
  @Post(UPLOAD_ROUTES.CREATE_UPLOAD)
  @ApiSwaggerResponse(UploadMultipleResponse, {
    status: StatusCodes.CREATED,
  })
  @TransformWith(UploadMultipleResponse)
  @HttpCode(StatusCodes.CREATED)
  async uploadMultipleAttachment(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{
    data: UploadResult[];
  }> {
    return await this.uploadsService.uploadMultipleAttachments(files);
  }

  @Delete(UPLOAD_ROUTES.DELETE_UPLOAD)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  async deleteSingleAttachment(
    @Param("folder") folder: string,
    @Param("id") id: string,
  ): Promise<MessageResponse> {
    const publicId = `${folder}/${id}`;
    await this.uploadsService.deleteSingleAttachment(publicId);
    return messageResponse(SUCCESS_MESSAGES.DELETED);
  }
}
