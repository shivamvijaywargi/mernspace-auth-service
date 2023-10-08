import { Router } from "express";

import { AppDataSource } from "@/config/data-source";
import { logger } from "@/config/logger";
import { AuthController } from "@/controllers/auth.controller";
import { User } from "@/entity/User";
import { validateRequest } from "@/middlewares/validateRequest.middleware";
import { UserService } from "@/services/user.service";
import { registerUserSchema } from "@/validations/auth.validation";

const authRouter = Router();

const userReposiroty = AppDataSource.getRepository(User);
const userService = new UserService(userReposiroty);
const authController = new AuthController(userService, logger);

// authController bind Read more: https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post(
  "/register",
  validateRequest(registerUserSchema),
  (req, res, next) => authController.register(req, res, next),
);

export default authRouter;
