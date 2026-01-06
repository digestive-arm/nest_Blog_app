import {
  Body,
  Controller,
  Res,
  Req,
  Post,
  InternalServerErrorException,
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: CreateUserDto,
  })
  async register(@Res() res: Response, @Body() user: CreateUserDto) {
    try {
      await this.authService.register(user);
      responseUtils.success(res, {
        data: { message: 'User created successfully' },
        status: StatusCodes.CREATED,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() user: LoginUserDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.login({
        email: user.email,
        password: user.password,
      });

      res.cookie('refreshToken', refreshToken, refreshTokenConfig);

      res.cookie('accessToken', accessToken, accessTokenConfig);
      responseUtils.success(res, {
        data: { message: 'Logged in successfully' },
        status: StatusCodes.OK,
      });
    } catch (error) {
      console.log(error);
      responseUtils.error({ res, error });
    }
  }

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

      responseUtils.success(res, {
        data: { message: 'AccessToken updated' },
        status: StatusCodes.OK,
      });
    } catch (error) {
      responseUtils.error({ res, error });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    responseUtils.success(res, {
      data: { message: 'Logged-out successfully!' },
      status: StatusCodes.NO_CONTENT,
    });
  }
}
