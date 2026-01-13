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

@ApiTags(USER_ROUTES.USER)
@Controller(USER_ROUTES.USER)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiSwaggerResponse(FindAllUsersResponse)
  @Get()
  @UseGuards(RolesGuard())
  async findAll(
    @Res() res: Response,
    @Query() { page, limit, isPagination }: PaginationDto,
  ) {
    try {
      const result = await this.userService.findAll(page, limit, isPagination);
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
  async findOne(@Res() res: Response, @Param('id') id: string) {
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
  update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateUserParams: UpdateUserDto,
  ) {
    try {
      this.userService.update(id, updateUserParams);
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
  remove(@Res() res: Response, @Param('id') id: string) {
    try {
      this.userService.remove(id);
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
