import {
  Body,
  Controller,
  Res,
  Req,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import responseUtils from 'src/utils/response.utils';
import { StatusCodes } from 'http-status-codes';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import {
  refreshTokenConfig,
  accessTokenConfig,
} from 'src/config/cookie.config';
import { ApiSwaggerResponse } from 'src/modules/swagger/swagger.decorator';
import { MessageResponse } from 'src/modules/swagger/dtos/response.dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.CREATED })
  async register(@Res() res: Response, @Body() user: CreateUserDto) {
    try {
      await this.authService.register(user);
      return responseUtils.success(res, {
        data: { message: 'User created successfully' },
        transformWith: MessageResponse,
        status: StatusCodes.CREATED,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post('login')
  async login(@Res() res: Response, @Body() user: LoginUserDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.login({
        email: user.email,
        password: user.password,
      });

      res.cookie('refreshToken', refreshToken, refreshTokenConfig);

      res.cookie('accessToken', accessToken, accessTokenConfig);
      return responseUtils.success(res, {
        data: { message: 'Logged in successfully' },
        transformWith: MessageResponse,
      });
    } catch (error) {
      console.log(error);
      responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse)
  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const token: unknown = req.cookies['refreshToken'];

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Invalid refresh token format!');
    }

    const oldRefrshToken = token;

    try {
      const { accessToken, refreshToken } =
        await this.authService.refresh(oldRefrshToken);

      res.cookie('refreshToken', refreshToken, refreshTokenConfig);
      res.cookie('accessToken', accessToken, accessTokenConfig);

      return responseUtils.success(res, {
        data: { message: 'AccessToken updated' },
        transformWith: MessageResponse,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }

  @ApiSwaggerResponse(MessageResponse, { status: StatusCodes.NO_CONTENT })
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return responseUtils.success(res, {
      data: { message: 'Logged-out successfully!' },
      transformWith: MessageResponse,
      status: StatusCodes.NO_CONTENT,
    });
  }
}
