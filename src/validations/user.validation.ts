import { z } from "zod";

const userQuerySchema = z.object({
  page: z.coerce
    .number({
      invalid_type_error: "Page must be a number",
    })
    .positive()
    .min(1)
    .default(1)
    .optional(),
  limit: z.coerce
    .number({
      invalid_type_error: "Limit must be a number",
    })
    .positive()
    .min(1)
    .default(6)
    .optional(),
});

export const getUserQuerySchema = z.object({
  query: userQuerySchema,
});

export type UserQuery = z.infer<typeof userQuerySchema>;
