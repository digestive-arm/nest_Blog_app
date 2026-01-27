import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { type TokenPayload } from "src/auth/auth-types";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { USER_ROUTES } from "src/constants/routes";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import responseUtils from "src/utils/response.utils";

import { UpdateUserDto } from "./dto/user.dto";
import { USER_ROLES } from "./user-types";
import { FindAllUsersResponse, UserResponse } from "./user.response";
import { UserService } from "./user.service";

import type { Response } from "express";

@ApiTags(USER_ROUTES.USER)
@Controller(USER_ROUTES.USER)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiSwaggerResponse(FindAllUsersResponse)
  @Get()
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async findAll(
    @Res() res: Response,
    @Query() { page, limit, isPagination }: PaginationDto,
  ) {
    try {
      const result = await this.userService.findAll({
        page,
        limit,
        isPagination,
      });
      return responseUtils.success(res, {
        data: result,
        transformWith: FindAllUsersResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(UserResponse)
  @Get(USER_ROUTES.FIND_ONE)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async findOne(@Res() res: Response, @Param("id") id: string) {
    try {
      const result = await this.userService.findOne(id);
      return responseUtils.success(res, {
        data: result,
        transformWith: UserResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Patch(USER_ROUTES.UPDATE)
  @UseGuards(AuthGuard)
  async update(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body() updateUserParams: UpdateUserDto,
  ) {
    try {
      await this.userService.update(user.id, id, updateUserParams);
      responseUtils.success(res, {
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
  @Delete(USER_ROUTES.DELETE)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async remove(@Res() res: Response, @Param("id") id: string) {
    try {
      await this.userService.remove(id);
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
