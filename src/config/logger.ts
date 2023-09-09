import winston from "winston";

import { CONFIG } from ".";

export const logger = winston.createLogger({
  level: CONFIG.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "auth-service" },
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "application.log",
      // level: "info",
      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.Console({
      silent: CONFIG.NODE_ENV === "test" || CONFIG.NODE_ENV === "production",
    }),
  ],
});
