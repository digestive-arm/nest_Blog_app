import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";

import { StatusCodes } from "http-status-codes";

import { ADMIN_DASHBOARD_ROUTE } from "src/constants/routes";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { USER_ROLES } from "src/user/user-types";

import { AdminDashboardDataResponse } from "./admin-dashboard.response";
import { AdminDashboardService } from "./admin-dashboard.service";
import { AdminDashboardData } from "./admin.interface";

@Controller(ADMIN_DASHBOARD_ROUTE.ADMIN_DASHBOARD)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  @TransformWith(AdminDashboardDataResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async getAdminDashboard(): Promise<AdminDashboardData> {
    return this.adminDashboardService.getAdminDashboard();
  }
}
