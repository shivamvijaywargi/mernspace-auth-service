import { Router } from "express";

import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { Roles } from "../constants";
import { TenantController } from "../controllers/tenant.controller";
import { Tenant } from "../entity/Tenant";
import authMiddleware from "../middlewares/auth.middleware";
import { canAccess } from "../middlewares/canAccess.middleware";
import { TenantService } from "../services/tenant.service";

const tenantRouter = Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

tenantRouter.post(
  "/",
  authMiddleware,
  canAccess([Roles.ADMIN]),
  (req, res, next) => tenantController.create(req, res, next),
);

export default tenantRouter;
