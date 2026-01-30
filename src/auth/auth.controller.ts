import {
  Body,
  Controller,
  Res,
  Req,
  Post,
  UnauthorizedException,
  Get,
  UseGuards,
  HttpCode,
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
import { TransformWith } from "src/modules/decorators/response-transformer.decorator";
import { AuthGuard } from "src/modules/guards/auth.guard";
import { MessageResponse } from "src/modules/swagger/dtos/response.dtos";
import { ApiSwaggerResponse } from "src/modules/swagger/swagger.decorator";
import { messageResponse } from "src/utils/response.utils";

import { type TokenPayload } from "./auth-types";
import { CurrentUserResponse } from "./auth.response";
import { AuthService } from "./auth.service";

import type { Response, Request } from "express";

@ApiTags(AUTH_ROUTES.AUTH)
@Controller(AUTH_ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(AUTH_ROUTES.ME)
  @ApiSwaggerResponse(CurrentUserResponse)
  @TransformWith(CurrentUserResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: TokenPayload): TokenPayload {
    return user;
  }

  @Post(AUTH_ROUTES.REGISTER)
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.CREATED)
  async register(@Body() user: CreateUserDto): Promise<MessageResponse> {
    await this.authService.register(user);
    return messageResponse(SUCCESS_MESSAGES.CREATED);
  }

  @Post(AUTH_ROUTES.LOGIN)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  async login(
    @Res({
      passthrough: true,
    })
    res: Response,
    @Body() { email, password }: LoginUserDto,
  ): Promise<MessageResponse> {
    const { accessToken, refreshToken } = await this.authService.login({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);
    res.cookie("accessToken", accessToken, accessTokenCookieConfig);

    return messageResponse(SUCCESS_MESSAGES.LOGGED_IN);
  }

  @Post(AUTH_ROUTES.REFRESH)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  async refresh(
    @Res({
      passthrough: true,
    })
    res: Response,
    @Req() req: Request,
  ): Promise<MessageResponse> {
    const oldRefreshToken: unknown = req.cookies["refreshToken"];

    if (typeof oldRefreshToken !== "string") {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const { accessToken, refreshToken } =
      await this.authService.refresh(oldRefreshToken);

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);
    res.cookie("accessToken", accessToken, accessTokenCookieConfig);

    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }

  @Post(AUTH_ROUTES.LOGOUT)
  @ApiSwaggerResponse(MessageResponse)
  @TransformWith(MessageResponse)
  @HttpCode(StatusCodes.OK)
  @UseGuards(AuthGuard)
  async logout(
    @Res({
      passthrough: true,
    })
    res: Response,
    @CurrentUser() user: TokenPayload,
  ): Promise<MessageResponse> {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    await this.authService.logout(user.id);
    return messageResponse(SUCCESS_MESSAGES.SUCCESS);
  }
}
