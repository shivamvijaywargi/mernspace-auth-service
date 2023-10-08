import { NextFunction, Response } from "express";
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
