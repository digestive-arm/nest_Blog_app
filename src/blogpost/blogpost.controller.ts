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
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { CommentsService } from "src/comments/comments.service";
import { CreateCommentDto } from "src/comments/dto/comment.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { uploadOptions } from "src/config/upload.config";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { BLOG_POST_ROUTES } from "src/constants/routes";
import { UPLOAD_CONSTANTS } from "src/constants/upload.constants";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import responseUtils from "src/utils/response.utils";

import {
  BlogPostResponse,
  GetAllBlogPostResponse,
  GetAllCommentesOnPostResponse,
} from "./blogpost.response";
import { BlogpostService } from "./blogpost.service";
import {
  CreateBlogPostDto,
  GetCommentsOnPostDto,
  UpdateBlogPostDto,
} from "./dto/blogpost.dto";

import { SearchBlogPostDto } from "./dto/search.dto";

import type { Response } from "express";


@ApiTags(BLOG_POST_ROUTES.BLOG_POST)
@Controller(BLOG_POST_ROUTES.BLOG_POST)
export class BlogpostController {
  constructor(
    private readonly blogpostService: BlogpostService,
    private readonly commentService: CommentsService,
  ) {}

  @UseInterceptors(
    FilesInterceptor(
      UPLOAD_CONSTANTS.FILE_NAME,
      UPLOAD_CONSTANTS.MAX_UPLOAD_COUNT,
      uploadOptions,
    ),
  )
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  @Post(BLOG_POST_ROUTES.CREATE)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  async create(
    @CurrentUser() user: TokenPayload,
    @Res() res: Response,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() { title, content, summary, categoryId }: CreateBlogPostDto,
  ) {
    try {
      await this.blogpostService.create(
        {
          title,
          categoryId,
          content,
          summary,
          authorId: user.id,
        },
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
    @Query() { q, isPagination, page, limit }: SearchBlogPostDto,
  ) {
    try {
      const result = await this.blogpostService.findAll(
        {
          page,
          limit,
          isPagination,
        },
        q,
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
  async findOne(@Res() res: Response, @Param("slug") slug: string) {
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
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async update(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body() { title, content, summary, categoryId }: UpdateBlogPostDto,
  ) {
    try {
      await this.blogpostService.update(user.id, id, {
        title,
        categoryId,
        content,
        summary,
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
  @Delete(BLOG_POST_ROUTES.DELETE)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async remove(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
  ) {
    try {
      await this.blogpostService.remove(id, user);
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
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  publish(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
  ) {
    try {
      this.blogpostService.publish(id, user);
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

  @Post(BLOG_POST_ROUTES.CREATE_COMMENT)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async createComment(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") postId: string,
    @Body() { content }: CreateCommentDto,
  ) {
    try {
      await this.commentService.create({ content, authorId: user.id, postId });
      return responseUtils.success(res, {
        data: {
          message: SUCCESS_MESSAGES.CREATED,
        },
        transformWith: MessageResponse,
        status: StatusCodes.CREATED,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Get(BLOG_POST_ROUTES.GET_COMMENTS_ON_POST)
  @ApiSwaggerResponse(GetAllCommentesOnPostResponse)
  async getCommentsOnPost(
    @Res() res: Response,
    @Query()
    { page, limit, isPagination, isPending = false }: GetCommentsOnPostDto,
    @Param("id") id: string,
  ) {
    try {
      const result = await this.blogpostService.getCommentsOnPost(id, {
        page,
        limit,
        isPagination,
        isPending,
      });
      return responseUtils.success(res, {
        data: result,
        transformWith: GetAllCommentesOnPostResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
