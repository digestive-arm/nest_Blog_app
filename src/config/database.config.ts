import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { getOsEnv } from '../config/env.config';
import { dataSourceOptions } from 'src/modules/database/data-source';

export const databaseConfig: TypeOrmModuleOptions = {
  ...dataSourceOptions,
  retryAttempts: 3,
  retryDelay: 5000,
};
