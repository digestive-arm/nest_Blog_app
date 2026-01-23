import type { CookieOptions } from 'express';
import { secretConfig } from './env.config';

export const refreshTokenCookieConfig: CookieOptions = {
  maxAge: Number(secretConfig.refreshCookieExpirationDay) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false, //dev
  path: '/',
};

export const accessTokenCookieConfig: CookieOptions = {
  maxAge: Number(secretConfig.accessCookieExpirationTime),
  httpOnly: true,
  secure: false, //dev
  path: '/',
};
