import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { COMMENT_ROUTES } from "src/constants/routes";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import responseUtils from "src/utils/response.utils";

import { CommentResponse, GetAllCommentResponse } from "./comment.response";
import { CommentsService } from "./comments.service";
import { UpdateCommentDto } from "./dto/comment.dto";

@ApiTags(COMMENT_ROUTES.COMMENT)
@Controller(COMMENT_ROUTES.COMMENT)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(COMMENT_ROUTES.GET_ONE)
  @ApiSwaggerResponse(CommentResponse)
  async findOne(@Res() res: Response, @Param("id") id: string) {
    try {
      const result = await this.commentsService.findOne(id);
      return responseUtils.success(res, {
        data: result,
        transformWith: CommentResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Patch(COMMENT_ROUTES.UPDATE)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  @ApiSwaggerResponse(MessageResponse)
  async update(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    try {
      await this.commentsService.update(user.id, id, updateCommentDto);
      return responseUtils.success(res, {
        data: {
          message: SUCCESS_MESSAGES.UPDATED,
        },
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Delete(COMMENT_ROUTES.DELETE)
  @ApiSwaggerResponse(MessageResponse)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async remove(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
  ) {
    try {
      await this.commentsService.remove(id, user);
      return responseUtils.success(res, {
        data: {
          message: SUCCESS_MESSAGES.DELETED,
        },
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
