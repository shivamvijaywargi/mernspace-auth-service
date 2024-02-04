import { randomUUID } from "crypto";

import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { HttpError } from "http-errors";

import { logger } from "../config/logger";

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const errorId = randomUUID();
  const statusCode = err.status || err.statusCode || 500;

  const isProduction = process.env.NODE_ENV === "production";

  const message = isProduction
    ? "Internal Server Error"
    : err.message || "Internal Server Error";

  logger.error(err.message || "Internal Server Error", {
    id: errorId,
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    errors: [
      {
        ref: errorId,
        type: err.name,
        message,
        path: req.path,
        method: req.method,
        location: "server",
        stack: isProduction ? null : err.stack,
      },
    ],
  });
};
