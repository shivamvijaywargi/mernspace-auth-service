import { z } from "zod";

import { Roles } from "../constants";

const userBodySchema = z.object({
  firstName: z
    .string({
      required_error: "First Name is required",
    })
    .trim()
    .min(1, "First Name cannot be empty"),
  lastName: z
    .string({
      required_error: "Last Name is required",
    })
    .trim()
    .min(1, "Last Name cannot be empty"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .trim()
    .min(8, "Password must be atleast 8 characters long"),
  role: z.enum([Roles.ADMIN, Roles.MANAGER, Roles.CUSTOMER]).optional(),
  tenantId: z.number().optional(),
});

export const registerUserSchema = z.object({
  body: userBodySchema,
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .trim()
      .min(1, "Email cannot be empty")
      .email("Invalid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .trim()
      .min(8, "Password must be atleast 8 characters long"),
  }),
});

export const updateUserSchema = z.object({
  body: userBodySchema.partial(),
  params: z.object({
    id: z.string(),
  }),
});
