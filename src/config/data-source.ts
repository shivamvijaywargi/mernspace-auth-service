import "reflect-metadata";

import { DataSource } from "typeorm";

import { CONFIG } from ".";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DB_HOST,
  port: CONFIG.DB_PORT,
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB_NAME,
  synchronize: CONFIG.NODE_ENV === "test" || CONFIG.NODE_ENV === "development",
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
