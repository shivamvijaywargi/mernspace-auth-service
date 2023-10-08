import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequest =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync(req);

      if (result.success) {
        // If parsing is successful, assign the parsed value to the request body
        req.body = result.data?.body as Record<string, unknown>;

        next();
      } else {
        // If there are validation errors, send the errors along with the received value
        return res.status(400).json({
          success: false,
          error: result.error.issues.map((e) => ({
            location: e.path[0],
            path: e.path[1],
            message: e.message,
          })),
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  };
