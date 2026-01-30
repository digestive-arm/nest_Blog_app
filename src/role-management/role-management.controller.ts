import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { PaginationDto } from "src/common/dto/pagination.dto";
import { PaginationMeta } from "src/common/interfaces/pagination.interfaces";
import { SUCCESS_MESSAGES } from "src/constants/messages.constants";
import { ROLE_MANAGEMENT_ROUTES } from "src/constants/routes";
import { RoleApproval } from "src/modules/database/entities/role-management.entity";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";
import { messageResponse } from "src/utils/response.utils";

import {
  ProcessRoleApprovalRequestDto,
  UpdateRoleDto,
} from "./dto/role-management.dto";
import {
  MyRequestsResponse,
  PendingRequestsResponse,
} from "./role-management.response";
import { RoleManagementService } from "./role-management.service";

import type { TokenPayload } from "src/auth/auth-types";

@ApiTags(ROLE_MANAGEMENT_ROUTES.ROLE)
@Controller(ROLE_MANAGEMENT_ROUTES.ROLE)
@UseGuards(AuthGuard)
export class RoleManagementController {
  constructor(private readonly roleManagementService: RoleManagementService) {}

  // get my requests
  @Get(ROLE_MANAGEMENT_ROUTES.MY_REQUESTS)
  @ApiSwaggerResponse(MyRequestsResponse)
  @TransformWith(MyRequestsResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.READER, USER_ROLES.ADMIN))
  async getMyRequests(
    @CurrentUser() user: TokenPayload,
  ): Promise<(RoleApproval | undefined)[]> {
    return await this.roleManagementService.getMyRequests(user.id);
  }

  // request upgrade
  @Post(ROLE_MANAGEMENT_ROUTES.UPGRADE_ROLE)
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.CREATED)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.READER, USER_ROLES.AUTHOR))
  async requestUpgrade(
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: TokenPayload,
  ): Promise<MessageResponse> {
    await this.roleManagementService.requestUpgrade(updateRoleDto.role, user);

    return messageResponse(SUCCESS_MESSAGES.CREATED);
  }
  // get pending requests
  @Get(ROLE_MANAGEMENT_ROUTES.PENDING_REQUESTS)
  @ApiSwaggerResponse(PendingRequestsResponse, {})
  @TransformWith(PendingRequestsResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(RolesGuard(USER_ROLES.ADMIN))
  async getPendingRequest(
    @Query() { page, limit, isPagination }: PaginationDto,
  ): Promise<PaginationMeta<RoleApproval>> {
    return await this.roleManagementService.getPendingRequest({
      page,
      limit,
      isPagination,
    });
  }
  // approve / reject request
  @Patch(ROLE_MANAGEMENT_ROUTES.PROCESS_REQUEST)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(RolesGuard(USER_ROLES.ADMIN))
  async processRequest(
    @Body() { isApproved }: ProcessRoleApprovalRequestDto,
    @Param("id") roleApprovalRequestId: string,
  ): Promise<MessageResponse> {
    await this.roleManagementService.processRequest(
      isApproved,
      roleApprovalRequestId,
    );

    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }
}
