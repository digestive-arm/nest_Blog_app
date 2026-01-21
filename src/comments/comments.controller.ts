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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/comment.dto';
import { COMMENT_ROUTES } from 'src/constants/routes';
import { ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import responseUtils from 'src/utils/response.utils';
import { SUCCESS_MESSAGES } from 'src/constants/messages.constants';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { StatusCodes } from 'http-status-codes';
import { CommentResponse, GetAllCommentResponse } from './comment.response';
import { CurrentUser } from 'src/modules/decorators/get-current-user.decorator';
import { type TokenPayload } from 'src/auth/auth-types';
import { AuthGuard } from 'src/modules/guards/auth.guard';

@ApiTags(COMMENT_ROUTES.COMMENT)
@Controller(COMMENT_ROUTES.COMMENT)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(COMMENT_ROUTES.GET_ALL)
  @ApiSwaggerResponse(GetAllCommentResponse)
  async findAll(
    @Res() res: Response,
    @Param() { page, limit, isPagination }: PaginationDto,
  ) {
    try {
      const result = await this.commentsService.findAll({
        page,
        limit,
        isPagination,
      });
      return responseUtils.success(res, {
        data: result,
        transformWith: GetAllCommentResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Get(COMMENT_ROUTES.GET_ONE)
  @ApiSwaggerResponse(CommentResponse)
  async findOne(@Res() res: Response, @Param('id') id: string) {
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
  @UseGuards(AuthGuard)
  @ApiSwaggerResponse(MessageResponse)
  async update(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
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
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.commentsService.remove(id);
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
