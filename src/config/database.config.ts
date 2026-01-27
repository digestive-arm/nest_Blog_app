import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { dataSourceOptions } from "src/modules/database/data-source";

import { getOsEnv } from "../config/env.config";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: getOsEnv("DATABASE_HOST"),
  port: +getOsEnv("DATABASE_PORT"),
  username: getOsEnv("DATABASE_USER"),
  password: getOsEnv("DATABASE_PASSWORD"),
  database: getOsEnv("DATABASE_NAME"),
  ssl: false,
  synchronize: false,
  autoLoadEntities: true,
  retryAttempts: 3,
  retryDelay: 5000,
};
