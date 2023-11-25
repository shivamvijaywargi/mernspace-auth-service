import { NextFunction, Request, Response, Router } from "express";

import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { AuthController } from "../controllers/auth.controller";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import authMiddleware from "../middlewares/auth.middleware";
import parseRefreshTokenMiddleware from "../middlewares/parseRefreshToken.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import validateTokenMiddleware from "../middlewares/validateToken.middleware";
import { CredentialService } from "../services/credential.service";
import { TokenService } from "../services/token.service";
import { UserService } from "../services/user.service";
import { IAuthRequest } from "../types";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/auth.validation";

const authRouter = Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const userService = new UserService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

// authController bind Read more: https://www.freecodecamp.org/news/this-is-why-we-need-to-bind-event-handlers-in-class-components-in-react-f7ea1a6f93eb/
// eslint-disable-next-line @typescript-eslint/no-misused-promises
authRouter.post(
  "/register",
  validateRequest(registerUserSchema),
  (req, res, next) => authController.register(req, res, next),
);

authRouter.post("/login", validateRequest(loginUserSchema), (req, res, next) =>
  authController.login(req, res, next),
);

authRouter.get("/self", authMiddleware, (req, res, next) =>
  authController.self(req as IAuthRequest, res, next),
);

authRouter.post(
  "/refresh",
  validateTokenMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as IAuthRequest, res, next),
);

authRouter.post(
  "/logout",
  authMiddleware,
  parseRefreshTokenMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as IAuthRequest, res, next),
);

export default authRouter;
