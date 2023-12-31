import "dotenv/config";
import "reflect-metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import morgan from "morgan";

import { CONFIG } from "./config";
import { logger } from "./config/logger";
import authRouter from "./routes/auth.route";
import tenantRouter from "./routes/tenant.route";

const app = express();

// middlewares
app.use(
  cors({
    origin: [CONFIG.CORS_ORIGIN],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
// Health Check Route
app.get("/health-check", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Server is up",
  });
});

// Auth routes
app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);

// CatchAll - 404
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.method} ${req.originalUrl}`,
  });
});

// Gloabl error middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`Something went wrong: ${message}`);

  res.status(statusCode).json({
    success: false,
    errors: [
      {
        type: err.name,
        message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
