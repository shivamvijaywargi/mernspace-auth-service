import fs from "fs";
import path from "path";

import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Logger } from "winston";

import { UserService } from "@/services/user.service";
import { IRegisterUserRequest } from "@/types";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
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

      let privateKey: Buffer;

      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/private.pem"),
        );
      } catch (error) {
        const err = createHttpError(
          500,
          "Error while reading private.pem file",
        );

        return next(err);
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });

      const refreshToken = "refreshToken";

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
