import {
  Controller,
  Delete,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

import { uploadOptions } from "src/config/upload.config";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { UPLOAD_ROUTES } from "src/constants/routes";
import { UPLOAD_CONSTANTS } from "src/constants/upload.constants";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import responseUtils from "src/utils/response.utils";

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
  async uploadMultipleAttachment(
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const result = await this.uploadsService.uploadMultipleAttachments(files);
      return responseUtils.success(res, {
        data: result,
        transformWith: UploadMultipleResponse,
        status: StatusCodes.CREATED,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }

  @Delete(UPLOAD_ROUTES.DELETE_UPLOAD)
  @ApiSwaggerResponse(MessageResponse)
  async deleteSingleAttachment(
    @Res() res: Response,
    @Param("folder") folder: string,
    @Param("id") id: string,
  ) {
    try {
      const publicId = `${folder}/${id}`;
      await this.uploadsService.deleteSingleAttachment(publicId);
      return responseUtils.success(res, {
        data: {
          message: SUCCESS_MESSAGES.DELETED,
        },
        transformWith: MessageResponse,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
}
