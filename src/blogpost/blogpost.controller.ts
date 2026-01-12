import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blogpost.dto';
import { SUCCESS_MESSAGES } from 'src/constants/messages.constants';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import { StatusCodes } from 'http-status-codes';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetAllBlogPostResponse } from './blogpost.resonse';
import { BLOG_POST_ROUTES } from 'src/constants/routes';
import responseUtils from 'src/utils/response.utils';
import type { Response } from 'express';

@Controller(BLOG_POST_ROUTES.BLOG_POST)
export class BlogpostController {
  constructor(private readonly blogpostService: BlogpostService) {}

  @Post(BLOG_POST_ROUTES.CREATE)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  async create(
    @Res() res: Response,
    @Body() { title, content, summary, authorId }: CreateBlogPostDto,
  ) {
    try {
      await this.blogpostService.create({ title, content, summary, authorId });
      return responseUtils.success(res, {
        data: {
          message: SUCCESS_MESSAGES.CREATED,
        },
        status: StatusCodes.CREATED,
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Get(BLOG_POST_ROUTES.GET_ALL)
  @ApiSwaggerResponse(GetAllBlogPostResponse, {
    status: StatusCodes.OK,
  })
  async findAll(
    @Res() res: Response,
    @Query() { page, limit, isPagination }: PaginationDto,
  ) {
    try {
      const result = await this.blogpostService.findAll(
        page,
        limit,
        isPagination,
      );
      return responseUtils.success(res, {
        data: result,
        transformWith: GetAllBlogPostResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Patch(BLOG_POST_ROUTES.UPDATE)
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() { title, content, summary }: UpdateBlogPostDto,
  ) {
    try {
      await this.blogpostService.update(id, { title, content, summary });
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

  @ApiSwaggerResponse(MessageResponse)
  @Delete(BLOG_POST_ROUTES.UPDATE)
  remove(@Res() res: Response, @Param('id') id: string) {
    try {
      this.blogpostService.remove(id);
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

  @ApiSwaggerResponse(MessageResponse)
  @Patch(BLOG_POST_ROUTES.PUBLISH)
  publish(@Res() res: Response, @Param('id') id: string) {
    try {
      this.blogpostService.publish(id);
      return responseUtils.success(res, {
        data: {
          message: SUCCESS_MESSAGES.SUCCESS,
        },
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
