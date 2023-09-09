import cors from "cors";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import morgan from "morgan";

import { logger } from "./config/logger";

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Other middlewares

// Routes
// Health Check Route
app.get("/health-check", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Server is up",
  });
});

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
  logger.error(err.message);
  res.status(err.statusCode).json({
    name: err.name,
    statusCode: err.statusCode,
    message: err.message,
    details: [],
  });
});

export default app;
