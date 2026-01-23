import { CATEGORY_ROUTES } from './../constants/routes';
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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import responseUtils from 'src/utils/response.utils';
import { type Response } from 'express';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { SUCCESS_MESSAGES } from 'src/constants/messages.constants';
import { StatusCodes } from 'http-status-codes';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoryResponse, GetAllCategoryResponse } from './category.response';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { RolesGuard } from 'src/modules/guards/role.guard';
import { USER_ROLES } from 'src/user/user-types';

@ApiTags(CATEGORY_ROUTES.CATEGORY)
@Controller(CATEGORY_ROUTES.CATEGORY)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(CATEGORY_ROUTES.CREATE)
  @ApiSwaggerResponse(MessageResponse, {
    status: StatusCodes.CREATED,
  })
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async create(
    @Res() res: Response,
    @Body() { name, description }: CreateCategoryDto,
  ) {
    try {
      await this.categoryService.create({ name, description });
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

  @Get(CATEGORY_ROUTES.GET_ALL)
  @ApiSwaggerResponse(GetAllCategoryResponse)
  async findAll(
    @Res() res: Response,
    @Query() { page, limit, isPagination }: PaginationDto,
  ) {
    try {
      const result = await this.categoryService.findAll({
        page,
        limit,
        isPagination,
      });
      return responseUtils.success(res, {
        data: result,
        transformWith: GetAllCategoryResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Get(CATEGORY_ROUTES.GET_ONE)
  @ApiSwaggerResponse(CategoryResponse)
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const result = await this.categoryService.findOne(id);
      return responseUtils.success(res, {
        data: result,
        transformWith: CategoryResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @Patch(CATEGORY_ROUTES.UPDATE)
  @ApiSwaggerResponse(MessageResponse)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() { name, description, isActive }: UpdateCategoryDto,
  ) {
    try {
      this.categoryService.update(id, { name, description, isActive });
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

  @Delete(CATEGORY_ROUTES.DELETE)
  @ApiSwaggerResponse(MessageResponse)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      await this.categoryService.remove(id);
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
