import createJWKSMock from "mock-jwks";
import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { User } from "../../src/entity/User";

describe("POST /auth/self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");

    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();

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
    it("should return 200 status code", async () => {
      // Register user
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it("should return the user data", async () => {
      // Register user
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: "1", role: data.role });

      // Add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      // ASSERT
      // Check if user id matches with the registered user
      expect((response.body as Record<string, string>).id).toBe(data.id);
    });

    it("should not return user password", async () => {
      // Register user
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      const data = await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Generate token
      const accessToken = jwks.token({ sub: String(data.id), role: data.role });

      // Add token to cookie
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      // ASSERT
      // Check if user id matches with the registered user
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 401 status code if token does not exist", async () => {
      // Register user
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      // Add token to cookie
      const response = await request(app).get("/auth/self").send();

      // ASSERT
      expect(response.statusCode).toBe(401);
    });
  });

  describe("Fields are missing", () => {});
});
