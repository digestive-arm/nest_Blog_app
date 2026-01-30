import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationMeta } from "src/common/interfaces/pagination.interfaces";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { USER_ROUTES } from "src/constants/routes";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { messageResponse } from "src/utils/response.utils";

import { UpdateUserDto } from "./dto/user.dto";
import { USER_ROLES } from "./user-types";
import { FindAllUsersResponse, UserResponse } from "./user.response";
import { UserService } from "./user.service";

@ApiTags(USER_ROUTES.USER)
@Controller(USER_ROUTES.USER)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(USER_ROUTES.FIND_ALL)
  @ApiSwaggerResponse(FindAllUsersResponse)
  @TransformWith(FindAllUsersResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async findAll(
    @Query() { page, limit, isPagination }: PaginationDto,
  ): Promise<PaginationMeta<UserEntity>> {
    return await this.userService.findAll({
      page,
      limit,
      isPagination,
    });
  }

  @Get(USER_ROUTES.FIND_ONE)
  @ApiSwaggerResponse(UserResponse)
  @TransformWith(UserResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async findOne(@Param("id") id: string): Promise<UserEntity> {
    return await this.userService.findOne(id);
  }

  @Patch(USER_ROUTES.UPDATE)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard)
  async update(
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body() updateUserParams: UpdateUserDto,
  ): Promise<MessageResponse> {
    await this.userService.update(user.id, id, updateUserParams);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }

  @Delete(USER_ROUTES.DELETE)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async remove(@Param("id") id: string): Promise<MessageResponse> {
    await this.userService.remove(id);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }
}
