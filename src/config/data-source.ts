import "reflect-metadata";

import { DataSource } from "typeorm";

import { CONFIG } from ".";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT,
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB_NAME,
  // synchronize should be false in produciton, keep it always false, since we have beforeEach() blcok setup in tests (register.spec.ts)
  synchronize: true,
  logging: false,
  entities: [User, RefreshToken],
  migrations: [],
  subscribers: [],
});
