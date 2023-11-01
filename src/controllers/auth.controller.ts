import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";

import { AppDataSource } from "@/config/data-source";
import { MS_IN_YEAR } from "@/constants";
import { RefreshToken } from "@/entity/RefreshToken";
import { TokenService } from "@/services/token.service";
import { UserService } from "@/services/user.service";
import { IRegisterUserRequest } from "@/types";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
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
      });

      this.logger.info(`User has been registered`, { id: user.id });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist the refresh token in the DB
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

      const newRefreshToken = await refreshTokenRepository.save({
        user: user,
        expiresAt: new Date(Date.now() + MS_IN_YEAR),
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

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
}

// Functional way
// const register: RequestHandler = async (req, res) => {
//   res.status(201).send("Registered");
// };

// export default {
//   register,
// };
