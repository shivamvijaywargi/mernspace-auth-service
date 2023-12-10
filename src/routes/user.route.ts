import express, { NextFunction, Response } from "express";

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

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
  "/",
  authMiddleware,
  canAccess([Roles.ADMIN]),
  validateRequest(registerUserSchema),
  (req: IRegisterUserRequest, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);

router.patch(
  "/:id",
  authMiddleware,
  canAccess([Roles.ADMIN]),
  validateRequest(updateUserSchema),
  (req: IUpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next),
);

router.get("/", authMiddleware, canAccess([Roles.ADMIN]), (req, res, next) =>
  userController.getAll(req, res, next),
);

router.get("/:id", authMiddleware, canAccess([Roles.ADMIN]), (req, res, next) =>
  userController.getOne(req, res, next),
);

router.delete(
  "/:id",
  authMiddleware,
  canAccess([Roles.ADMIN]),
  (req, res, next) => userController.destroy(req, res, next),
);

export default router;
