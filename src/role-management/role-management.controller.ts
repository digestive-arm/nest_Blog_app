import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import type { Response } from 'express';
import { UpdateRoleDto } from './dto/upgrade-role.dto';
import { processRoleApprovalRequestDto } from './dto/process-role.dto';
import responseUtils from 'src/utils/response.utils';
import { StatusCodes } from 'http-status-codes';

@Controller('role')
export class RoleManagementController {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  //get my requests
  @Get(':id/my-requests')
  async getMyRequests(@Res() res: Response, @Param('id') userId: string) {
    try {
      const result = await this.roleManagementService.getMyRequests(userId);

      responseUtils.success(res, { data: result, status: StatusCodes.OK });
    } catch (error: AnyType) {
      responseUtils.error({ res, error });
    }
  }

  //request upgrade
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

      responseUtils.success(res, { data: null, status: StatusCodes.OK });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
  //get pending reqests
  @Get('pending-requests')
  async getPendingRequest(@Res() res: Response) {
    try {
      const result = await this.roleManagementService.getPendingRequest();
      responseUtils.success(res, { data: result, status: StatusCodes.OK });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
  //approve / reject request
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

      responseUtils.success(res, {
        data: null,
        status: StatusCodes.OK,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }
}
