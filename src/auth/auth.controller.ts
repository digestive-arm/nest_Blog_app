import {
  Body,
  Controller,
  Res,
  Req,
  Post,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { CreateUserDto, LoginUserDto } from 'src/auth/dto/auth.dto';
import responseUtils from 'src/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import {
  refreshTokenCookieConfig,
  accessTokenCookieConfig,
} from 'src/config/cookie.config';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/constants/messages.constants';
import { AUTH_ROUTES } from 'src/constants/routes';
import { CurrentUser } from 'src/modules/decorators/get-current-user.decorator';
import { AuthGuard } from 'src/modules/guards/auth.guard';
import { type TokenPayload } from './auth-types';
import { CurrentUserResponse } from './auth.response';

@ApiTags(AUTH_ROUTES.AUTH)
@Controller(AUTH_ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiSwaggerResponse(CurrentUserResponse)
  @Get(AUTH_ROUTES.ME)
  @UseGuards(AuthGuard)
  getMe(@Res() res: Response, @CurrentUser() user: TokenPayload) {
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
  async register(@Res() res: Response, @Body() user: CreateUserDto) {
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
  async login(@Res() res: Response, @Body() { email, password }: LoginUserDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.login({
        email,
        password,
      });

      res.cookie('refreshToken', refreshToken, refreshTokenCookieConfig);
      res.cookie('accessToken', accessToken, accessTokenCookieConfig);

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
  async refresh(@Res() res: Response, @Req() req: Request) {
    const oldRefrshToken: unknown = req.cookies['refreshToken'];

    if (typeof oldRefrshToken !== 'string') {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESHTOKEN);
    }

    try {
      const { accessToken, refreshToken } =
        await this.authService.refresh(oldRefrshToken);

      res.cookie('refreshToken', refreshToken, refreshTokenCookieConfig);
      res.cookie('accessToken', accessToken, accessTokenCookieConfig);

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
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return responseUtils.success(res, {
      data: { message: SUCCESS_MESSAGES.SUCCESS },
      transformWith: MessageResponse,
      status: StatusCodes.NO_CONTENT,
    });
  }
}
