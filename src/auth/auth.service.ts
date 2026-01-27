import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_CONSTANTS } from "src/user/user.constants";
import { AuthUtils } from "src/utils/auth.utils";

import {
  createUserParams,
  loginUserParams,
  AuthResponse,
  TokenPayload,
} from "./auth-types";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authUtils: AuthUtils,
  ) {}

  async login(loginUserParams: loginUserParams): Promise<AuthResponse> {
    const { email, password } = loginUserParams;
    const user = await this.userRepository
      .createQueryBuilder("user")
      .select(USER_CONSTANTS.LOGIN_SELECT_FIELDS)
      .addSelect("user.password")
      .where("user.email = :email", {
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

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async register({
    email,
    userName,
    password,
    firstName,
    lastName,
  }: createUserParams): Promise<void> {
    const existingUser = await this.userRepository
      .createQueryBuilder("user")
      .select(USER_CONSTANTS.REGISTER_SELECT_FIELDS)
      .where("user.email = :email", {
        email,
      })
      .orWhere("user.userName = :userName", {
        userName,
      })
      .getOne();

    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS_ACCOUNT);
    }

    const hashedPassword = await this.authUtils.hashPassword(password);

    await this.userRepository.save({
      email,
      password: hashedPassword,
      userName,
      firstName,
      lastName,
    });
  }

  async refresh(receivedRefreshToken: string): Promise<AuthResponse> {
    const tokenPayload = this.authUtils.decodeToken(receivedRefreshToken);
    const { id } = tokenPayload;

    delete tokenPayload["iat"];
    delete tokenPayload["exp"];

    const accessToken = this.authUtils.generateAccessToken(tokenPayload);
    const refreshToken = this.authUtils.generateRefreshToken(tokenPayload);

    const user = await this.userRepository.preload({
      id,
      refreshToken,
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }
}
