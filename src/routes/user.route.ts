import express, { NextFunction, RequestHandler, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { Roles } from "../constants";
import { UserController } from "../controllers/user.controller";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/auth.middleware";
import { canAccess } from "../middlewares/canAccess.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { UserService } from "../services/user.service";
import { IRegisterUserRequest, IUpdateUserRequest } from "../types";
import {
  registerUserSchema,
  updateUserSchema,
} from "../validations/auth.validation";
import { getUserQuerySchema } from "../validations/user.validation";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
  "/",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  validateRequest(registerUserSchema) as RequestHandler,
  (req: IRegisterUserRequest, res: Response, next: NextFunction) =>
    userController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
  "/:id",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  validateRequest(updateUserSchema) as RequestHandler,
  (req: IUpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next) as unknown as RequestHandler,
);

router.get(
  "/",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  validateRequest(getUserQuerySchema) as RequestHandler,
  (req, res, next) =>
    userController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
  "/:id",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req, res, next) =>
    userController.getOne(req, res, next) as unknown as RequestHandler,
);

router.delete(
  "/:id",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req, res, next) =>
    userController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
