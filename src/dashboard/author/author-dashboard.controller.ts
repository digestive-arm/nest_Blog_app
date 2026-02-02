import { Controller, Get, HttpCode, UseGuards } from "@nestjs/common";

import { StatusCodes } from "http-status-codes";

import { type TokenPayload } from "src/auth/auth-types";
import { AUTHOR_DASHBOARD_ROUTE } from "src/constants/routes";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { RolesGuard } from "src/modules/guards/role.guard";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { USER_ROLES } from "src/user/user-types";

import { AuthorDashboardDataResponse } from "./author-dashboard.response";
import { AuthorDashboardService } from "./author-dashboard.service";

@Controller(AUTHOR_DASHBOARD_ROUTE.AUTHOR_DASHBOARD)
export class AuthorDashboardController {
  constructor(
    private readonly authorDashboardService: AuthorDashboardService,
  ) {}

  @Get()
  @ApiSwaggerResponse(AuthorDashboardDataResponse)
  @TransformWith(AuthorDashboardDataResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard, RolesGuard(USER_ROLES.AUTHOR))
  async getAuthorDashboard(
    @CurrentUser() user: TokenPayload,
  ): Promise<unknown> {
    return await this.authorDashboardService.getAuthorDashboard(user);
  }
}
