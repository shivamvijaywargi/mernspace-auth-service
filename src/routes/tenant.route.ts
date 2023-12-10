import { Router } from "express";

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
  authMiddleware,
  canAccess([Roles.ADMIN]),
  validateRequest(createTenantSchema),
  (req, res, next) => tenantController.create(req, res, next),
);

tenantRouter.get("/", (req, res, next) =>
  tenantController.findAll(req, res, next),
);

tenantRouter.get("/:id", (req, res, next) =>
  tenantController.findOne(req, res, next),
);

tenantRouter.patch(
  "/:id",
  authMiddleware,
  canAccess([Roles.ADMIN]),
  validateRequest(updateTenantSchema),
  (req, res, next) => tenantController.update(req, res, next),
);

tenantRouter.delete(
  "/:id",
  authMiddleware,
  canAccess([Roles.ADMIN]),
  validateRequest(updateTenantSchema),
  (req, res, next) => tenantController.delete(req, res, next),
);

export default tenantRouter;
