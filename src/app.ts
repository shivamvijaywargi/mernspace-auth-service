import "dotenv/config";
import "reflect-metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { CONFIG } from "./config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRouter from "./routes/auth.route";
import tenantRouter from "./routes/tenant.route";
import usersRouter from "./routes/user.route";

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
app.use("/users", usersRouter);

// CatchAll - 404
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.method} ${req.originalUrl}`,
  });
});

// Gloabl error middleware
app.use(errorHandler);

export default app;
