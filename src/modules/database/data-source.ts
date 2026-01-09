import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env['DATABASE_HOST'],
  port: +(process.env['DATABASE_PORT'] ?? 5432),
  username: process.env['DATABASE_USER'],
  password: process.env['DATABASE_PASSWORD'],
  database: process.env['DATABASE_NAME'],
  synchronize: false,
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['src/migrations/*.{ts}'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
});
