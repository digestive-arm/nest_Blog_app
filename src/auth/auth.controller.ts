import {
  Body,
  Controller,
  Res,
  Req,
  Post,
  UnauthorizedException,
  Get,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBody } from "@nestjs/swagger";

import { StatusCodes } from "http-status-codes";

import { CreateUserDto, LoginUserDto } from "src/auth/dto/auth.dto";
import {
  refreshTokenCookieConfig,
  accessTokenCookieConfig,
} from "src/config/cookie.config";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "src/constants/messages.constants";
import { AUTH_ROUTES } from "src/constants/routes";
import { CurrentUser } from "src/modules/decorators/get-current-user.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import responseUtils, { CommonResponseType } from "src/utils/response.utils";

import { type TokenPayload } from "./auth-types";
import { CurrentUserResponse } from "./auth.response";
import { AuthService } from "./auth.service";

import type { Response, Request } from "express";

@ApiTags(AUTH_ROUTES.AUTH)
@Controller(AUTH_ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSwaggerResponse(CurrentUserResponse)
  @Get(AUTH_ROUTES.ME)
  @UseGuards(AuthGuard)
  getMe(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
  ): Response<CommonResponseType<TokenPayload>> {
    return responseUtils.success(res, {
      data: user,
      transformWith: CurrentUserResponse,
    });
  }

  @Post(AUTH_ROUTES.REGISTER)
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  async register(
    @Res() res: Response,
    @Body() user: CreateUserDto,
  ): Promise<Response<CommonResponseType<MessageResponse>>> {
    try {
      await this.authService.register(user);
      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.CREATED },
        transformWith: MessageResponse,
        status: StatusCodes.CREATED,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post(AUTH_ROUTES.LOGIN)
  async login(
    @Res() res: Response,
    @Body() { email, password }: LoginUserDto,
  ): Promise<Response<CommonResponseType<MessageResponse>>> {
    try {
      const { accessToken, refreshToken } = await this.authService.login({
        email,
        password,
      });

      res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);
      res.cookie("accessToken", accessToken, accessTokenCookieConfig);

      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.LOGGED_IN },
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post(AUTH_ROUTES.REFRESH)
  async refresh(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<CommonResponseType<MessageResponse>>> {
    const oldRefreshToken: unknown = req.cookies["refreshToken"];

    if (typeof oldRefreshToken !== "string") {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    try {
      const { accessToken, refreshToken } =
        await this.authService.refresh(oldRefreshToken);

      res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);
      res.cookie("accessToken", accessToken, accessTokenCookieConfig);

      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.SUCCESS },
        transformWith: MessageResponse,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.NO_CONTENT })
  @Post(AUTH_ROUTES.LOGOUT)
  @UseGuards(AuthGuard)
  async logout(
    @Res() res: Response,
    @CurrentUser() user: TokenPayload,
  ): Promise<Response<CommonResponseType<MessageResponse>>> {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      await this.authService.logout(user.id);

      return responseUtils.success(res, {
        data: { message: SUCCESS_MESSAGES.SUCCESS },
        transformWith: MessageResponse,
        status: StatusCodes.NO_CONTENT,
      });
    } catch (error) {
      return responseUtils.error({ res, error });
    }
  }
}
