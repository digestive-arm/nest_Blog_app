import {
  ConflictException,
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
import { ERROR_MESSAGES } from 'src/constants/messages.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authUtils: AuthUtils,
  ) {}

  async login(loginUserParams: loginUserParams): Promise<AuthResponse> {
    const { email, password } = loginUserParams;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.role'])
      .addSelect('user.password')
      .where('user.email = :email', {
        email,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    const { password: hashed, id, role } = user;

    const validPassword = await this.authUtils.validatePassword(
      password,
      hashed,
    );

    if (!validPassword) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    const tokenPayload: TokenPayload = {
      email,
      id,
      role,
    };

    const accessToken = this.authUtils.generateAccessToken(tokenPayload);
    const refreshToken = this.authUtils.generateRefreshToken(tokenPayload);

    await this.userRepository
      .createQueryBuilder('')
      .update({ refreshToken })
      .where('id = :id', {
        id,
      })
      .execute();

    return { accessToken, refreshToken };
  }

  async register(createUserParams: createUserParams): Promise<void> {
    const { email, username, password, firstname, lastname } = createUserParams;
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.email', 'user.password'])
      .where('user.email = :email', {
        email,
      })
      .orWhere('user.username = :username', {
        username,
      })
      .getOne();

    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS_ACCOUNT);
    }

    const hashedPassword = await this.authUtils.hashPassword(password);

    await this.userRepository
      .createQueryBuilder('user')
      .insert()
      .into(User)
      .values([
        {
          email,
          password: hashedPassword,
          username,
          firstname,
          lastname,
        },
      ])
      .execute();
  }

  async refresh(receivedRefreshToken: string): Promise<AuthResponse> {
    const tokenPayload = this.authUtils.decodeToken(receivedRefreshToken);
    const { id } = tokenPayload;

    delete tokenPayload['iat'];
    delete tokenPayload['exp'];

    const accessToken = this.authUtils.generateAccessToken(tokenPayload);
    const refreshToken = this.authUtils.generateRefreshToken(tokenPayload);

    await this.userRepository
      .createQueryBuilder()
      .update({ refreshToken })
      .where('id = :id', {
        id,
      })
      .execute();

    return { accessToken, refreshToken };
  }
}
