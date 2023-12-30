import { RequestHandler, Router } from "express";

import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { Roles } from "../constants";
import { TenantController } from "../controllers/tenant.controller";
import { Tenant } from "../entity/Tenant";
import authMiddleware from "../middlewares/auth.middleware";
import { canAccess } from "../middlewares/canAccess.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { TenantService } from "../services/tenant.service";
import {
  createTenantSchema,
  updateTenantSchema,
} from "../validations/tenant.validation";

const tenantRouter = Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

tenantRouter.post(
  "/",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  validateRequest(createTenantSchema) as RequestHandler,
  (req, res, next) =>
    tenantController.create(req, res, next) as unknown as RequestHandler,
);

tenantRouter.get(
  "/",
  (req, res, next) =>
    tenantController.findAll(req, res, next) as unknown as RequestHandler,
);

tenantRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req, res, next) =>
    tenantController.findOne(req, res, next) as unknown as RequestHandler,
);

tenantRouter.patch(
  "/:id",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  validateRequest(updateTenantSchema) as RequestHandler,
  (req, res, next) =>
    tenantController.update(req, res, next) as unknown as RequestHandler,
);

tenantRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  canAccess([Roles.ADMIN]),
  validateRequest(updateTenantSchema) as RequestHandler,
  (req, res, next) =>
    tenantController.delete(req, res, next) as unknown as RequestHandler,
);

export default tenantRouter;
