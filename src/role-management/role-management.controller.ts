import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { ROLE_MANAGEMENT_ROUTES } from "src/constants/routes";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import responseUtils, { CommonResponseType } from "src/utils/response.utils";

import {
  UpdateRoleDto,
  ProcessRoleApprovalRequestDto,
} from "./dto/role-management.dto";
import {
  GetAllPendingRequestResponse,
  MyRequestsResponse,
} from "./role-management.response";
import { RoleManagementService } from "./role-management.service";

import type { Response } from "express";

@ApiTags(ROLE_MANAGEMENT_ROUTES.ROLE)
@Controller(ROLE_MANAGEMENT_ROUTES.ROLE)
@UseGuards(AuthGuard)
export class RoleManagementController {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  // get my requests
  @ApiSwaggerResponse(MyRequestsResponse)
  @Get(ROLE_MANAGEMENT_ROUTES.MY_REQUESTS)
  async getMyRequests(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
  ): Promise<Response<CommonResponseType<MyRequestsResponse>>> {
    try {
      const result = await this.roleManagementService.getMyRequests(user.id);

      return responseUtils.success(res, {
        data: result,
        transformWith: MyRequestsResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  // request upgrade
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @Post(ROLE_MANAGEMENT_ROUTES.UPGRADE_ROLE)
  async requestUpgrade(
    @Res() res: Response,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<Response<CommonResponseType<MessageResponse>>> {
    try {
      await this.roleManagementService.requestUpgrade(updateRoleDto.role, user);

      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.CREATED },
        status: StatusCodes.CREATED,
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
  // get pending requests
  @ApiSwaggerResponse(GetAllPendingRequestResponse, {})
  @Get(ROLE_MANAGEMENT_ROUTES.PENDING_REQUESTS)
  @UseGuards(RolesGuard(USER_ROLES.ADMIN))
  async getPendingRequest(
    @Res() res: Response,
    @Query() { page, limit, isPagination }: PaginationDto,
  ): Promise<Response<CommonResponseType<GetAllPendingRequestResponse>>> {
    try {
      const result = await this.roleManagementService.getPendingRequest({
        page,
        limit,
        isPagination,
      });
      return responseUtils.success(res, {
        data: result,
        transformWith: GetAllPendingRequestResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
  // approve / reject request
  @ApiSwaggerResponse(MessageResponse)
  @Patch(ROLE_MANAGEMENT_ROUTES.PROCESS_REQUEST)
  @UseGuards(RolesGuard(USER_ROLES.ADMIN))
  async processRequest(
    @Res() res: Response,
    @Body() { isApproved }: ProcessRoleApprovalRequestDto,
    @Param("id") roleApprovalRequestId: string,
  ): Promise<Response<CommonResponseType<MessageResponse>>> {
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
