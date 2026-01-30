import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { COMMENT_ROUTES } from "src/constants/routes";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import { messageResponse } from "src/utils/response.utils";

import { CommentResponse } from "./comment.response";
import { CommentsService } from "./comments.service";
import { UpdateCommentDto } from "./dto/comment.dto";

@ApiTags(COMMENT_ROUTES.COMMENT)
@Controller(COMMENT_ROUTES.COMMENT)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(COMMENT_ROUTES.GET_ONE)
  @ApiSwaggerResponse(CommentResponse)
  @TransformWith(CommentResponse)
  @HttpCode(StatusCodes.OK)
  async findOne(@Param("id") id: string): Promise<CommentResponse | null> {
    return await this.commentsService.findOne(id);
  }

  @Patch(COMMENT_ROUTES.UPDATE)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.READER, USER_ROLES.AUTHOR))
  async update(
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<MessageResponse> {
    await this.commentsService.update(user.id, id, updateCommentDto);
    return messageResponse(SUCCESS_MESSAGES.UPDATED);
  }

  @Delete(COMMENT_ROUTES.DELETE)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.READER, USER_ROLES.AUTHOR))
  async remove(
    @Param("id") id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<MessageResponse> {
    await this.commentsService.remove(id, user);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }
}
