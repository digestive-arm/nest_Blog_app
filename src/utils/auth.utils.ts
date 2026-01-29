import { UnauthorizedException } from "@nestjs/common/exceptions";

import * as bcrypt from "bcryptjs";
import { type SignOptions, verify, sign } from "jsonwebtoken";

import { secretConfig } from "src/config/env.config";
import { ERROR_MESSAGES } from "src/constants/messages.constants";

import { type TokenPayload } from "../auth/auth-types";

export function jwtSign(payload: object, expiresIn: number): string {
  const signOptions: SignOptions = {
    expiresIn: Number(expiresIn),
  };
  return sign(payload, secretConfig.jwtSecretKey, signOptions);
}

export function verifyToken(token: string): TokenPayload {
  try {
    return <TokenPayload>verify(token, secretConfig.jwtSecretKey);
  } catch (error) {
    throw new UnauthorizedException(error, ERROR_MESSAGES.UNAUTHORIZED);
  }
}

export function decodeToken(authToken: string): TokenPayload {
  if (!authToken) {
    throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
  }

  const payload = verifyToken(authToken);

  return payload;
}

export function generateAccessToken(payload: TokenPayload): string {
  const expiresIn = Number(secretConfig.accessTokenExpirationTime);
  return jwtSign(payload, expiresIn);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const expiresIn = Number(secretConfig.refreshTokenExpirationTime);
  return jwtSign(payload, expiresIn);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function validatePassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, storedHash);
  return isMatch;
}
