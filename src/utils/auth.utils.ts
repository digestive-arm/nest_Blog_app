import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";

import * as bcrypt from "bcryptjs";
import { SignOptions, verify, sign } from "jsonwebtoken";

import { secretConfig } from "src/config/env.config";
import { ERROR_MESSAGES } from "src/constants/messages.constants";

import { TokenPayload } from "../auth/auth-types";

@Injectable()
export class AuthUtils {
  jwtSign(payload: object, expiresIn: number): string {
    const signOptions: SignOptions = {
      expiresIn: Number(expiresIn),
    };
    return sign(payload, secretConfig.jwtSecretKey, signOptions);
  }

  verifyToken(token: string): TokenPayload {
    try {
      return <TokenPayload>verify(token, secretConfig.jwtSecretKey);
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
  }

  decodeToken(authToken: string): TokenPayload {
    if (!authToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const payload = this.verifyToken(authToken);

    return payload;
  }

  generateAccessToken(payload: TokenPayload): string {
    const expiresIn = Number(secretConfig.accessTokenExpirationTime);
    return this.jwtSign(payload, expiresIn);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const expiresIn = Number(secretConfig.refreshTokenExpirationTime);
    return this.jwtSign(payload, expiresIn);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  }
}
