import "reflect-metadata";

import { DataSource } from "typeorm";

import { CONFIG } from ".";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT,
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB_NAME,
  // synchronize should be false in produciton, keep it always false, since we have beforeEach() blcok setup in tests (register.spec.ts)
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
