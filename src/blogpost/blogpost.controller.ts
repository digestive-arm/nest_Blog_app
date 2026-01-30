import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { CommentsService } from "src/comments/comments.service";
import { CreateCommentDto } from "src/comments/dto/comment.dto";
import { PaginationMeta } from "src/common/interfaces/pagination.interfaces";
import { uploadOptions } from "src/config/upload.config";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { BLOG_POST_ROUTES } from "src/constants/routes";
import { UPLOAD_CONSTANTS } from "src/constants/upload.constants";
import { BlogpostEntity } from "src/modules/database/entities/blogpost.entity";
import { CommentEntity } from "src/modules/database/entities/comment.entity";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import { messageResponse } from "src/utils/response.utils";

import { PaginationDto } from "../common/dto/pagination.dto";

import {
  BlogPostResponse,
  GetAllBlogPostResponse,
  GetAllCommentsOnPostResponse,
} from "./blogpost.response";
import { BlogpostService } from "./blogpost.service";
import { CreateBlogPostDto, UpdateBlogPostDto } from "./dto/blogpost.dto";
import { SearchBlogPostDto } from "./dto/search.dto";

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
  @Post(BLOG_POST_ROUTES.CREATE)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.CREATED)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async create(
    @CurrentUser() user: TokenPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() { title, content, summary, categoryId }: CreateBlogPostDto,
  ): Promise<MessageResponse> {
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

    return messageResponse(SUCCESS_MESSAGES.CREATED);
  }

  @Get(BLOG_POST_ROUTES.GET_ALL)
  @ApiSwaggerResponse(GetAllBlogPostResponse, {
    status: StatusCodes.OK,
  })
  @TransformWith(GetAllBlogPostResponse)
  @HttpCode(StatusCodes.OK)
  async findAll(
    @Query() { q, isPagination, page, limit }: SearchBlogPostDto,
  ): Promise<PaginationMeta<BlogpostEntity>> {
    return await this.blogpostService.findAll(
      {
        page,
        limit,
        isPagination,
      },
      q,
    );
  }

  @Get(BLOG_POST_ROUTES.GET_ONE)
  @ApiSwaggerResponse(BlogPostResponse, {
    status: StatusCodes.OK,
  })
  @TransformWith(BlogPostResponse)
  @HttpCode(StatusCodes.OK)
  async findOne(@Param("slug") slug: string): Promise<BlogpostEntity> {
    return await this.blogpostService.findOne(slug);
  }

  @Patch(BLOG_POST_ROUTES.UPDATE)
  @ApiSwaggerResponse(MessageResponse)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async update(
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body() { title, content, summary, categoryId }: UpdateBlogPostDto,
  ): Promise<MessageResponse> {
    await this.blogpostService.update(user.id, id, {
      title,
      categoryId,
      content,
      summary,
    });
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }

  @Delete(BLOG_POST_ROUTES.DELETE)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async remove(
    @Param("id") id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<MessageResponse> {
    await this.blogpostService.remove(id, user);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }

  @ApiSwaggerResponse(MessageResponse)
  @Patch(BLOG_POST_ROUTES.PUBLISH)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  async publish(
    @Param("id") id: string,
    @CurrentUser() user: TokenPayload,
  ): Promise<MessageResponse> {
    await this.blogpostService.publish(id, user);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }

  @Post(BLOG_POST_ROUTES.CREATE_COMMENT)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.CREATED)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async createComment(
    @CurrentUser() user: TokenPayload,
    @Param("id") postId: string,
    @Body() { content }: CreateCommentDto,
  ): Promise<MessageResponse> {
    await this.commentService.create({ content, authorId: user.id, postId });
    return messageResponse(SUCCESS_MESSAGES.CREATED);
  }

  @Get(BLOG_POST_ROUTES.GET_COMMENTS_ON_POST)
  @ApiSwaggerResponse(GetAllCommentsOnPostResponse)
  @TransformWith(GetAllCommentsOnPostResponse)
  @HttpCode(StatusCodes.OK)
  async getCommentsOnPost(
    @Query() { page, limit, isPagination }: PaginationDto,
    @Param("id") id: string,
  ): Promise<PaginationMeta<CommentEntity>> {
    return await this.blogpostService.getCommentsOnPost(id, {
      page,
      limit,
      isPagination,
    });
  }
}
