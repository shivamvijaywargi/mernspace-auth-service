import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
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
      .min(6, "Password must be atleast 6 characters long"),
  }),
});
