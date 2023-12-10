import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenants", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    // Database Truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  // Follow AAA pattern for writing tests
  // ARRANGE - ACT - ASSERT
  describe("Given all fields", () => {
    it("should return 201 status code", async () => {
      // Arrange
      const payload = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      // ACT
      const response = await request(app).post("/tenants").send(payload);

      // ASSERT
      expect(response.statusCode).toBe(201);
    });

    it("should create a tenant in the database", async () => {
      // ARRANGE
      const payload = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      // ACT
      await request(app).post("/tenants").send(payload);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      // ASSERT
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(payload.name);
      expect(tenants[0].address).toBe(payload.address);
    });
  });

  describe("Fields are missing", () => {});
});
