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
      .min(8, "Password must be atleast 8 characters long"),
  }),
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

const tenantBodySchema = z.object({
  name: z
    .string({
      required_error: "Tenant name is required",
    })
    .trim()
    .min(1, "Tenant name cannot be empty")
    .max(20, "Tenant name cannot be more than 20 characters"),
  address: z
    .string({
      required_error: "Tenant address is required",
    })
    .trim()
    .min(1, "Tenant address cannot be empty")
    .max(50, "Tenant address cannot be more than 50 characters"),
});

export const createTenantSchema = z.object({
  body: tenantBodySchema,
});

export const updateTenantSchema = z.object({
  body: tenantBodySchema.partial(),
  params: z.object({
    id: z.string(),
  }),
});
