import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /auth/login", () => {
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
      const userData = {
        email: "one@one.one",
        password: "12345678",
      };

      const response = await request(app).post("/auth/login").send(userData);

      expect(response.statusCode).toBe(200);
    });
  });

  describe("Fields are missing", () => {});
});
