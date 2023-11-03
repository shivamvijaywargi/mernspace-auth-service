import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";

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
    it("should return valid json response", async () => {
      const payload = {
        email: "one@one.one",
        password: "12345678",
      };

      const response = await request(app).post("/auth/login").send(payload);

      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("should find the user in the database and return 200 status code", async () => {
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(userData);
      const response = await request(app).post("/auth/login").send(userData);

      const userRepository = connection.getRepository(User);

      const user = await userRepository.findOne({
        where: { email: userData.email },
      });

      expect(user?.email).toBe(userData.email);
      expect(response.statusCode).toBe(200);
    });

    it("should match user entered plain password with hashed password", async () => {
      const payload = {
        email: "one@one.one",
        password: "12345678",
      };

      await request(app).post("/auth/login").send(payload);

      const userRepository = connection.getRepository(User);

      const user = await userRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      expect(user?.password).not.toBe(payload.password);
    });

    it("should return 400 status code if email does not exists", async () => {
      const payload = {
        email: "test@never.one",
        password: "12345678",
      };

      const response = await request(app).post("/auth/login").send(payload);

      expect(response.statusCode).toEqual(400);
    });
  });

  describe("Fields are missing", () => {});
});
