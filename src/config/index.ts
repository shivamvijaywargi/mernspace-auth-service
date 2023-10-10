import path from "path";

import { config } from "dotenv";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const {
  PORT,
  LOG_LEVEL,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  REFRESH_TOKEN_SECRET,
} = process.env;

export const CONFIG = {
  PORT,
  LOG_LEVEL,
  NODE_ENV,
  DB_HOST,
  DB_PORT: parseInt(DB_PORT || "5432", 10),
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET || "secretKey",
};
