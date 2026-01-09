import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { getOsEnv } from '../config/env.config';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: getOsEnv('DATABASE_HOST'),
  port: +getOsEnv('DATABASE_PORT'),
  username: getOsEnv('DATABASE_USER'),
  password: getOsEnv('DATABASE_PASSWORD'),
  database: getOsEnv('DATABASE_NAME'),
  synchronize: false,
  ssl: false,
  logging: true,
  autoLoadEntities: true,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  retryAttempts: 3,
  retryDelay: 5000,
};
