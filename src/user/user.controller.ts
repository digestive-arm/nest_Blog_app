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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { FindAllUsersResponse, UserResponse } from './user.response';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import { SUCCESS_MESSAGES } from 'src/constants/messages.constants';
import responseUtils from 'src/utils/response.utils';
import type { Response } from 'express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { USER_ROUTES } from 'src/constants/routes';
import { RolesGuard } from 'src/modules/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';
import { USER_ROLES } from './user-types';
import { CurrentUser } from 'src/modules/decorators/get-current-user.decorator';
import { type TokenPayload } from 'src/auth/auth-types';

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
    const result = await this.userService.findAll({
      page,
      limit,
      isPagination,
    });
    return responseUtils.success(res, {
      data: result,
      transformWith: FindAllUsersResponse,
    });
  }

  @ApiSwaggerResponse(UserResponse)
  @Get(USER_ROUTES.FIND_ONE)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.userService.findOne(id);
    return responseUtils.success(res, {
      data: result,
      transformWith: UserResponse,
    });
  }

  @ApiSwaggerResponse(MessageResponse)
  @Patch(USER_ROUTES.UPDATE)
  @UseGuards(AuthGuard)
  update(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
    @Param('id') id: string,
    @Body() updateUserParams: UpdateUserDto,
  ) {
    this.userService.update(user.id, id, updateUserParams);
    responseUtils.success(res, {
      data: {
        message: SUCCESS_MESSAGES.UPDATED,
      },
      transformWith: MessageResponse,
    });
  }

  @ApiSwaggerResponse(MessageResponse)
  @Delete(USER_ROUTES.DELETE)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.ADMIN))
  remove(@Res() res: Response, @Param('id') id: string) {
    this.userService.remove(id);
    return responseUtils.success(res, {
      data: {
        message: SUCCESS_MESSAGES.DELETED,
      },
      transformWith: MessageResponse,
    });
  }
}
