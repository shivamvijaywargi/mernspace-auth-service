import winston from "winston";

import { CONFIG } from ".";

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

export const logger = winston.createLogger({
  level: CONFIG.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss:ms A" }),
    winston.format.prettyPrint(),
    winston.format.json(),
  ),
  defaultMeta: { service: "auth-service" },
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.Console({
      level: "info",
      silent: CONFIG.NODE_ENV === "test",
      format: winston.format.combine(
        winston.format.colorize({
          all: true,
        }),
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "logs/exceptions.log",
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: "logs/rejections.log",
    }),
  ],
});
