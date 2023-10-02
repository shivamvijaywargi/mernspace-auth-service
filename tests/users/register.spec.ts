import request from "supertest";
import { DataSource } from "typeorm";

import app from "@/app";
import { AppDataSource } from "@/config/data-source";
import { User } from "@/entity/User";

describe("POST /auth/register", () => {
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

  describe("Given all fields", () => {
    it("should return 201 status code", async () => {
      // Follow AAA pattern for writing tests
      // Arrange
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      // Arrange
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("Should persist the user in the database", async () => {
      // Arrange
      const userData = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      // Act
      await request(app).post("/auth/register").send(userData);

      // Assert
      const userRepository = connection.getRepository(User);

      const users = await userRepository.find();

      expect(users).toHaveLength(1);

      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("should return the ID of the created user", async () => {
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      // ASSERT
      expect((response.body as User).id).toBe(1);
    });
  });

  // describe("Fields are missing", () => {});
});
