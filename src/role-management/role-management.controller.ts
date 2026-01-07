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
import { UpdateRoleDto } from './dto/upgrade-role.dto';
import { processRoleApprovalRequestDto } from './dto/process-role.dto';
import responseUtils from 'src/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import {
  MyRequestsResponse,
  PendingRequestsResponse,
} from './role-management.response';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';

@Controller('role')
@UseGuards(AuthGuard)
export class RoleManagementController {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  //get my requests
  @ApiSwaggerResponse(MyRequestsResponse)
  @Get(':id/my-requests')
  async getMyRequests(@Res() res: Response, @Param('id') userId: string) {
    try {
      const result = await this.roleManagementService.getMyRequests(userId);

      return responseUtils.success(res, {
        data: result,
        transformWith: MyRequestsResponse,
      });
    } catch (error: AnyType) {
      responseUtils.error({ res, error });
    }
  }

  //request upgrade
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post(':id/upgrade')
  async requestUpdgrade(
    @Res() res: Response,
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id') userId: string,
  ) {
    if (!updateRoleDto.role) {
      throw new BadRequestException('Role is not specified!');
    }

    try {
      await this.roleManagementService.requestUpdgrade(
        updateRoleDto.role,
        userId,
      );

      return responseUtils.success(res, {
        data: { message: 'Role updation request has been created!' },
        status: StatusCodes.CREATED,
        transformWith: MessageResponse,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
  //get pending reqests
  @ApiSwaggerResponse(PendingRequestsResponse, {})
  @Get('pending-requests')
  async getPendingRequest(@Res() res: Response) {
    try {
      const result = await this.roleManagementService.getPendingRequest();
      return responseUtils.success(res, {
        data: result,
        transformWith: PendingRequestsResponse,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
  //approve / reject request
  @ApiSwaggerResponse(MessageResponse)
  @Patch('/:id/process-request')
  async processRequest(
    @Res() res: Response,
    @Body() processRoleApprovalRequestDto: processRoleApprovalRequestDto,
    @Param('id') roleApprovalRequestId: string,
  ) {
    try {
      await this.roleManagementService.processRequest(
        processRoleApprovalRequestDto.isApproved,
        roleApprovalRequestId,
      );

      return responseUtils.success(res, {
        data: { message: 'Request has been processed!' },
        transformWith: MessageResponse,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
}
