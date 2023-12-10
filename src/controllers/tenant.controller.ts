import { NextFunction, Request, Response } from "express";
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
        message: `Tenant created successfully`,
        id: tenant.id,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("Request for fetching all tenants", req.body);

    try {
      const tenants = await this.tenantService.findAll();

      res.status(200).json({
        success: true,
        message: `All tenants`,
        tenants,
      });
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    this.logger.debug("Request for fetching all tenants", req.body);

    try {
      const tenants = await this.tenantService.findOne(+id);

      res.status(200).json({
        success: true,
        message: `All tenants`,
        tenants,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: ICreateTenantRequest, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    const { id } = req.params;

    this.logger.debug("Request for creating a tenant", req.body);

    try {
      await this.tenantService.update(+id, { name, address });

      this.logger.info(`Tenant with id: ${id} has been updated.`, {
        id: id,
      });

      res.status(200).json({
        success: true,
        message: `Tenant updated successfully`,
        id,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    this.logger.debug("Request for creating a tenant", req.body);

    try {
      await this.tenantService.delete(+id);

      this.logger.info(`Tenant with id: ${id} has been deleted.`, {
        id: id,
      });

      res.status(200).json({
        success: true,
        message: `Tenant deleted successfully`,
        id,
      });
    } catch (error) {
      next(error);
    }
  }
}
