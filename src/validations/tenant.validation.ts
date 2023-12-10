import { z } from "zod";

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
