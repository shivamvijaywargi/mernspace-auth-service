import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Logger } from "winston";

import { UserService } from "../services/user.service";
import { IRegisterUserRequest, IUpdateUserRequest } from "../types";
import { UserQuery } from "../validations/user.validation";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async create(req: IRegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, tenantId, role } = req.body;

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        tenantId,
        role,
      });
      res.status(201).json({ id: user.id });
    } catch (err) {
      next(err);
    }
  }

  async update(req: IUpdateUserRequest, res: Response, next: NextFunction) {
    // In our project: We are not allowing user to change the email id since it is used as username
    // In our project: We are not allowing admin user to change others password

    const { firstName, lastName, role, tenantId, email } = req.body;
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    this.logger.debug("Request for updating a user", req.body);

    try {
      await this.userService.update(Number(userId), {
        firstName,
        lastName,
        role,
        email,
        tenantId,
      });

      this.logger.info("User has been updated", { id: userId });

      res.json({ id: Number(userId) });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const queryParams = req.query as UserQuery;

    try {
      const [users, count] = await this.userService.getAll(queryParams);

      this.logger.info("All users have been fetched");
      res.json({
        currentPage: queryParams.page ?? 1,
        perPage: queryParams.limit ?? 6,
        total: count,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      const user = await this.userService.findById(Number(userId));

      if (!user) {
        next(createHttpError(400, "User does not exist."));
        return;
      }

      this.logger.info("User has been fetched", { id: user.id });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    try {
      await this.userService.deleteById(Number(userId));

      this.logger.info("User has been deleted", {
        id: Number(userId),
      });
      res.json({ id: Number(userId) });
    } catch (err) {
      next(err);
    }
  }
}
