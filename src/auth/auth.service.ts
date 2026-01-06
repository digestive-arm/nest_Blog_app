import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthUtils } from 'src/utils/auth.utils';
import { Repository } from 'typeorm';
import {
  createUserParams,
  loginUserParams,
  AuthResponse,
  TokenPayload,
} from './auth-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authUtils: AuthUtils,
  ) {}
  //login endpoint
  async login(loginUserParams: loginUserParams): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserParams.email },
      select: ['email', 'password', 'id', 'role'],
    });

    if (!user) {
      throw new NotFoundException('No user exists with provided email');
    }

    const validPassword = await this.authUtils.validatePassword(
      loginUserParams.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('You entered wrong password');
    }

    const tokenPayload: TokenPayload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const accessToken = this.authUtils.generateAccessToken(tokenPayload);
    const refreshToken = this.authUtils.generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await this.userRepository.update(
      { email: user.email },
      { refreshToken: refreshToken },
    );

    return { accessToken, refreshToken };
  }

  async register(
    createUserParams: createUserParams,
  ): Promise<createUserParams> {
    let user = new User();

    const hashedPassword = await this.authUtils.hashPassword(
      createUserParams.password,
    );
    user.email = createUserParams.email;
    user.password = hashedPassword;
    user = await this.userRepository.save(user);

    return user;
  }

  async refresh(receivedRefreshToken: string): Promise<AuthResponse> {
    const tokenPayload = this.authUtils.decodeToken(receivedRefreshToken);

   delete tokenPayload["iat"]
   delete tokenPayload["exp"]

    const accessToken = this.authUtils.generateAccessToken(tokenPayload);
    const refreshToken = this.authUtils.generateRefreshToken(tokenPayload);

    await this.userRepository.update(
      { email: tokenPayload.email },
      {
        refreshToken,
      },
    );

    return { accessToken, refreshToken };
  }
}
