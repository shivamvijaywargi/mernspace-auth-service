import { NextFunction, Response } from "express";
import { Logger } from "winston";

import { TenantService } from "../services/tenant.service";
import { ICreateTenantRequest } from "../types";

export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly logger: Logger,
  ) {}

  async create(req: ICreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;

    this.logger.debug("Request for creating a tenant", req.body);

    try {
      const tenant = await this.tenantService.create({ name, address });

      this.logger.info(`Tenant with id: ${tenant.id} has been created.`, {
        id: tenant.id,
      });

      res.status(201).json({
        success: true,
        message: `User created successfully`,
        id: tenant.id,
      });
    } catch (error) {
      next(error);
    }
  }
}
