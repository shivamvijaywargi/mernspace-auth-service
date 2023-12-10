import { Router } from "express";

import { AppDataSource } from "../config/data-source";
import { logger } from "../config/logger";
import { TenantController } from "../controllers/tenant.controller";
import { Tenant } from "../entity/Tenant";
import { TenantService } from "../services/tenant.service";

const tenantRouter = Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

tenantRouter.post("/", (req, res, next) =>
  tenantController.create(req, res, next),
);

export default tenantRouter;
