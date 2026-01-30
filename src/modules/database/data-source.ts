import { config } from "dotenv";
import { DataSource, type DataSourceOptions } from "typeorm";

config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env["DATABASE_HOST"],
  port: +(process.env["DATABASE_PORT"] ?? 5432),
  username: process.env["DATABASE_USER"],
  password: process.env["DATABASE_PASSWORD"],
  database: process.env["DATABASE_NAME"],
  synchronize: false,
  entities: ["src/modules/**/*.entity.ts", "dist/modules/**/*.entity.js"],
  migrations: ["dist/migrations/*.{js,ts}"],
  migrationsRun: false,
  migrationsTableName: "migrations",
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
