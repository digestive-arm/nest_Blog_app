import { config } from "dotenv";

config();

export function getOsEnv(key: string): string {
  return process.env[key] ?? "";
}

export function getOsEnvOptional(key: string): string | undefined {
  return process.env[key];
}

export const secretConfig = {
  jwtSecretKey: getOsEnv("JWT_SECRET_KEY"),
  accessTokenExpirationTime: getOsEnv("JWT_ACCESS_EXPIRATION_TIME"),
  refreshTokenExpirationTime: getOsEnv("JWT_REFRESH_EXPIRATION_TIME"),
  aesEncryptionKey: getOsEnv("AES_ENCRYPTION_KEY"),
  accessCookieExpirationTime: getOsEnv("ACCESS_COOKIE_EXPIRATION_TIME"),
  refreshCookieExpirationDay: getOsEnv("REFRESH_COOKIE_EXPIRATION_DAY"),
  mailerServiceHost: getOsEnv("MAILER_SERVICE_HOST"),
  mailerServicePort: getOsEnv("MAILER_SERVICE_PORT"),
  mailerServiceUser: getOsEnv("MAILER_SERVICE_USER"),
  mailerServicePassword: getOsEnv("MAILER_SERVICE_PASSWORD"),
  redisHost: getOsEnv("REDIS_HOST"),
  redisPort: getOsEnv("REDIS_PORT"),
  redisTTL: getOsEnv("REDIS_TTL"),
  redisUrl: getOsEnv("REDIS_URL"),
};
