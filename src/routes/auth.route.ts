import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";

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
authRouter.post(
  "/register",
  validateRequest(registerUserSchema) as RequestHandler,
  (req, res, next) =>
    authController.register(req, res, next) as unknown as RequestHandler,
);

authRouter.post(
  "/login",
  validateRequest(loginUserSchema) as RequestHandler,
  (req, res, next) =>
    authController.login(req, res, next) as unknown as RequestHandler,
);

authRouter.get(
  "/self",
  authMiddleware as RequestHandler,
  (req, res, next) =>
    authController.self(
      req as IAuthRequest,
      res,
      next,
    ) as unknown as RequestHandler,
);

authRouter.post(
  "/refresh",
  validateTokenMiddleware as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(
      req as IAuthRequest,
      res,
      next,
    ) as unknown as RequestHandler,
);

authRouter.post(
  "/logout",
  authMiddleware as RequestHandler,
  parseRefreshTokenMiddleware as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(
      req as IAuthRequest,
      res,
      next,
    ) as unknown as RequestHandler,
);

export default authRouter;
