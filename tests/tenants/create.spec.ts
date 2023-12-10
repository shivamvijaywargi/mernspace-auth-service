import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";

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
  });

  describe("Fields are missing", () => {});
});
