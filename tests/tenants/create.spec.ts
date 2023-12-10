import createJWKSMock from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenants", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;
  let adminToken: string;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");

    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();

    // Generate token
    adminToken = jwks.token({ sub: "1", role: Roles.ADMIN });

    // Database Truncate
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterEach(() => {
    jwks.stop();
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
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(payload);

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
      await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${adminToken}`])
        .send(payload);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      // ASSERT
      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(payload.name);
      expect(tenants[0].address).toBe(payload.address);
    });

    it("should return 401 is user is not authenticated", async () => {
      // ARRANGE
      const payload = {
        name: "Tenant Name",
        address: "Tenant Address",
      };

      // ACT
      const response = await request(app).post("/tenants").send(payload);

      expect(response.statusCode).toBe(401);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      // ASSERT
      expect(tenants).toHaveLength(0);
    });
  });

  describe("Fields are missing", () => {});
});
