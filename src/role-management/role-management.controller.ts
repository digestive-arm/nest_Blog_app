import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import type { Response } from 'express';
import { UpdateRoleDto } from './dto/role-management.dto';
import { processRoleApprovalRequestDto } from './dto/role-management.dto';
import responseUtils from 'src/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import {
  MyRequestsResponse,
  PendingRequestsResponse,
} from './role-management.response';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/messages.constants';
import { ROLE_MANAGEMENT_ROUTES } from 'src/constants/routes';
import { RolesGuard } from 'src/modules/guards/role.guard';

@Controller(ROLE_MANAGEMENT_ROUTES.ROLE)
@UseGuards(AuthGuard)
export class RoleManagementController {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  //get my requests
  @ApiSwaggerResponse(MyRequestsResponse)
  @Get(ROLE_MANAGEMENT_ROUTES.MY_REQUESTS)
  async getMyRequests(@Res() res: Response, @Param('id') userId: string) {
    try {
      const result = await this.roleManagementService.getMyRequests(userId);

      return responseUtils.success(res, {
        data: result,
        transformWith: MyRequestsResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  //request upgrade
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post(ROLE_MANAGEMENT_ROUTES.UPGRADE_ROLE)
  async requestUpdgrade(
    @Res() res: Response,
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id') userId: string,
  ) {
    if (!updateRoleDto.role) {
      throw new BadRequestException(ERROR_MESSAGES.BAD_REQUEST);
    }

    try {
      await this.roleManagementService.requestUpdgrade(
        updateRoleDto.role,
        userId,
      );

      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.CREATED },
        status: StatusCodes.CREATED,
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
  //get pending reqests
  @ApiSwaggerResponse(PendingRequestsResponse, {})
  @Get(ROLE_MANAGEMENT_ROUTES.PENDING_REQUESTS)
  @UseGuards(RolesGuard())
  async getPendingRequest(@Res() res: Response) {
    try {
      const result = await this.roleManagementService.getPendingRequest();
      return responseUtils.success(res, {
        data: result,
        transformWith: PendingRequestsResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
  //approve / reject request
  @ApiSwaggerResponse(MessageResponse)
  @Patch(ROLE_MANAGEMENT_ROUTES.PROCESS_REQUEST)
  @UseGuards(RolesGuard())
  async processRequest(
    @Res() res: Response,
    @Body() { isApproved }: processRoleApprovalRequestDto,
    @Param('id') roleApprovalRequestId: string,
  ) {
    try {
      await this.roleManagementService.processRequest(
        isApproved,
        roleApprovalRequestId,
      );

      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.SUCCESS },
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
