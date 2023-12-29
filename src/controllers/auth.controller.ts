import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";

import { Roles } from "../constants";
import { CredentialService } from "../services/credential.service";
import { TokenService } from "../services/token.service";
import { UserService } from "../services/user.service";
import {
  IAuthRequest,
  ILoginUserRequest,
  IRegisterUserRequest,
} from "../types";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {}

  async register(req: IRegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;

    this.logger.debug("New request to register a user", {
      firstName,
      lastName,
      email,
      password: "********",
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role: Roles.CUSTOMER,
      });

      this.logger.info(`User has been registered`, { id: user.id });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      this.logger.info("Generated accessToken", payload);

      // Persist the refresh token in the DB
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);
      this.logger.info("Persist refreshToken");

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });
      this.logger.info("Generated refreshToken", payload);

      this.logger.info("Set accessToken to cookie");
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      this.logger.info("Set refreshToken to cookie");
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      res.status(201).json({
        success: true,
        message: `User created successfully`,
        id: user.id,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req: ILoginUserRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    this.logger.debug("New request to login a user", {
      email,
      password: "********",
    });

    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        const err = createHttpError(
          400,
          "Email or password do not match or user does not exist",
        );

        return next(err);
      }

      const isPasswordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordMatch) {
        const err = createHttpError(
          400,
          "Email or password do not match or user does not exist",
        );

        return next(err);
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      this.logger.info("Generated accessToken", payload);

      // Persist the refresh token in the DB
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);
      this.logger.info("Persist refreshToken");

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });
      this.logger.info("Generated refreshToken", payload);

      this.logger.info("Set accessToken to cookie");
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      this.logger.info("Set refreshToken to cookie");
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      this.logger.info("User has been logged in", { id: user.id });

      res.status(200).json({
        success: true,
        message: `User logged in successfully`,
        id: user.id,
      });
    } catch (error) {
      return next(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async self(req: IAuthRequest, res: Response, next: NextFunction) {
    const user = await this.userService.findById(Number(req.auth.sub));

    res.status(200).json({ ...user, password: undefined });
  }

  async refresh(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: JwtPayload = {
        sub: req.auth.sub,
        role: req.auth.role,
      };

      const user = await this.userService.findById(Number(req.auth.sub));

      if (!user) {
        return next(createHttpError(400, "User with the token does not exist"));
      }

      const accessToken = this.tokenService.generateAccessToken(payload);
      this.logger.info("Generated accessToken", payload);

      // Persist the refresh token in the DB
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);
      this.logger.info("Persist refreshToken");

      // Delete old refresh token
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));
      this.logger.info("Delete old refreshToken from the DB");

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });
      this.logger.info("Generated refreshToken", payload);

      this.logger.info("Set accessToken to cookie");
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      this.logger.info("Set refreshToken to cookie");
      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
      });

      this.logger.info("User has been logged in", { id: user.id });

      res.status(200).json({
        success: true,
        message: `Token refreshed successfully`,
        id: user.id,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      // Delete old refresh token
      this.logger.info(`Deleting old refreshToken from the DB: ${req.auth.id}`);
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));

      this.logger.info("User logged out successfully", { id: req.auth.id });

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: `User logged out successfully`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

// Functional way
// const register: RequestHandler = async (req, res) => {
//   res.status(201).send("Registered");
// };

// export default {
//   register,
// };
