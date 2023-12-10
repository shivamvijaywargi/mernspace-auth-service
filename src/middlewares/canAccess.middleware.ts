import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { IAuthRequest } from "../types";

export const canAccess =
  (roles: Array<string>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const _req = req as IAuthRequest;

    const roleFromToken = _req.auth.role;

    if (!roles.includes(roleFromToken)) {
      return next(
        createHttpError(403, `You are not authorized to perform this action`),
      );
    }

    next();
  };
