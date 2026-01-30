import { secretConfig } from "./env.config";

import type { CookieOptions } from "express";

export const refreshTokenCookieConfig: CookieOptions = {
  maxAge: Number(secretConfig.refreshCookieExpirationDay) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false, // dev
  path: "/",
};

export const accessTokenCookieConfig: CookieOptions = {
  maxAge: Number(secretConfig.accessCookieExpirationTime) * 60 * 1000,
  httpOnly: true,
  secure: false, // dev
  path: "/",
};
