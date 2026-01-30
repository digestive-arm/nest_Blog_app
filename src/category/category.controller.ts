import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationMeta } from "src/common/interfaces/pagination.interfaces";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { CATEGORY_ROUTES } from "src/constants/routes";
import { CategoryEntity } from "src/modules/database/entities/category.entity";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import { messageResponse } from "src/utils/response.utils";

import { CategoryResponse, GetAllCategoryResponse } from "./category.response";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@ApiTags(CATEGORY_ROUTES.CATEGORY)
@Controller(CATEGORY_ROUTES.CATEGORY)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(CATEGORY_ROUTES.CREATE)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.CREATED)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async create(
    @Body() { name, description }: CreateCategoryDto,
  ): Promise<MessageResponse> {
    await this.categoryService.create({ name, description });
    return messageResponse(SUCCESS_MESSAGES.CREATED);
  }

  @Get(CATEGORY_ROUTES.GET_ALL)
  @ApiSwaggerResponse(GetAllCategoryResponse)
  @TransformWith(GetAllCategoryResponse)
  @HttpCode(StatusCodes.OK)
  async findAll(
    @Query() { page, limit, isPagination }: PaginationDto,
  ): Promise<PaginationMeta<CategoryEntity>> {
    return await this.categoryService.findAll({
      page,
      limit,
      isPagination,
    });
  }

  @Get(CATEGORY_ROUTES.GET_ONE)
  @ApiSwaggerResponse(CategoryResponse)
  @TransformWith(CategoryResponse)
  @HttpCode(StatusCodes.OK)
  async findOne(@Param("id") id: string): Promise<CategoryEntity | null> {
    return await this.categoryService.findOne(id);
  }

  @Patch(CATEGORY_ROUTES.UPDATE)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async update(
    @Param("id") id: string,
    @Body() { name, description, isActive }: UpdateCategoryDto,
  ): Promise<MessageResponse> {
    await this.categoryService.update(id, { name, description, isActive });
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }

  @Delete(CATEGORY_ROUTES.DELETE)
  @ApiSwaggerResponse(MessageResponse)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  async remove(@Param("id") id: string): Promise<MessageResponse> {
    await this.categoryService.remove(id);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }
}
