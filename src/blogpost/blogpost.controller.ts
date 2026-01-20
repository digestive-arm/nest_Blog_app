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
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blogpost.dto';
import { SUCCESS_MESSAGES } from 'src/constants/messages.constants';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import { StatusCodes } from 'http-status-codes';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BlogPostResponse, GetAllBlogPostResponse } from './blogpost.response';
import { BLOG_POST_ROUTES, SEARCH_ROUTES } from 'src/constants/routes';
import responseUtils from 'src/utils/response.utils';
import type { Response } from 'express';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { RolesGuard } from 'src/modules/guards/role.guard';
import { USER_ROLES } from 'src/user/user-types';
import { OwnershipGuard } from 'src/modules/guards/ownership.guard';
import { SearchService } from './search.service';
import { SearchBlogPostDto } from './dto/search.dto';
import { SearchResponse } from './search.response';
import { ApiTags } from '@nestjs/swagger';
import { FILE_NAME, MAX_UPLOAD_COUNT } from 'src/constants/upload.constants';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadOptions } from 'src/config/upload.config';

@ApiTags(BLOG_POST_ROUTES.BLOG_POST)
@Controller(BLOG_POST_ROUTES.BLOG_POST)
export class BlogpostController {
  constructor(
    private readonly blogpostService: BlogpostService,
    private readonly searchService: SearchService,
  ) {}

  @UseInterceptors(FilesInterceptor(FILE_NAME, MAX_UPLOAD_COUNT, uploadOptions))
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  @Post(BLOG_POST_ROUTES.CREATE)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  async create(
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
    @Body()
    { title, content, summary, authorId, categoryId }: CreateBlogPostDto,
  ) {
    try {
      await this.blogpostService.create(
        { title, content, summary, authorId, categoryId },
        files,
      );
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

  @Get(BLOG_POST_ROUTES.GET_ONE)
  @ApiSwaggerResponse(BlogPostResponse, {
    status: StatusCodes.OK,
  })
  async findOne(@Res() res: Response, @Param('slug') slug: string) {
    try {
      const result = await this.blogpostService.findOne(slug);
      return responseUtils.success(res, {
        data: result,
        transformWith: BlogPostResponse,
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
    @Body() { title, content, summary, categoryId }: UpdateBlogPostDto,
  ) {
    try {
      await this.blogpostService.update(id, {
        title,
        content,
        summary,
        categoryId,
      });
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

  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR), OwnershipGuard)
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

  @ApiSwaggerResponse(SearchResponse, {
    status: StatusCodes.OK,
  })
  @Get(SEARCH_ROUTES.SEARCH)
  async search(@Res() res: Response, @Query() query: SearchBlogPostDto) {
    try {
      const result = await this.searchService.search(query);
      return responseUtils.success(res, {
        data: result,
        transformWith: SearchResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
