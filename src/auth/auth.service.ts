import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { ERROR_MESSAGES } from "src/constants/messages.constants";
import { UserEntity } from "src/modules/database/entities/user.entity";
import { USER_CONSTANTS } from "src/user/user.constants";
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  validatePassword,
} from "src/utils/auth.utils";

import {
  CreateUserParams,
  LoginUserParams,
  AuthResponse,
  TokenPayload,
} from "./auth-types";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(loginUserParams: LoginUserParams): Promise<AuthResponse> {
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

    const validPassword = await validatePassword(password, hashed);

    if (!validPassword) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_PASSWORD);
    }

    const tokenPayload: TokenPayload = {
      email,
      id,
      role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

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
  }: CreateUserParams): Promise<void> {
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

    const hashedPassword = await hashPassword(password);

    await this.userRepository.save({
      email,
      password: hashedPassword,
      userName,
      firstName,
      lastName,
    });
  }

  async refresh(receivedRefreshToken: string): Promise<AuthResponse> {
    const tokenPayload = decodeToken(receivedRefreshToken);
    const { id } = tokenPayload;

    const user = await this.userRepository
      .createQueryBuilder("user")
      .select("user.refreshToken")
      .where("user.id = :id ", { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }

    if (user.refreshToken !== receivedRefreshToken) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    delete tokenPayload["iat"];
    delete tokenPayload["exp"];

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id ", { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND);
    }
    user.refreshToken = null;

    await this.userRepository.save(user);
  }
}
