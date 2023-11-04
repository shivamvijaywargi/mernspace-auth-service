import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /auth/self", () => {
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
    it("should return 200 status code", async () => {
      const response = await request(app).get("/auth/self").send();

      expect(response.statusCode).toBe(200);
    });

    it("should return the user data", async () => {
      // Register user
      await request(app).get("/auth/self").send();
    });
  });

  describe("Fields are missing", () => {});
});
