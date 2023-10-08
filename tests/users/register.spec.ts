import request from "supertest";
import { DataSource } from "typeorm";

import app from "@/app";
import { AppDataSource } from "@/config/data-source";
import { Roles } from "@/constatns";
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
      const userRepository = connection.getRepository(User);

      const users = await userRepository.find();

      expect((response.body as User).id).toBe(users[0].id);
    });

    it("should assign a customer role", async () => {
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      // ACT
      await request(app).post("/auth/register").send(payload);

      // ASSERT
      const userRepository = connection.getRepository(User);

      const users = await userRepository.find();

      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("should store the hashed password in the database", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      // ACT
      await request(app).post("/auth/register").send(payload);

      // ASSERT
      const userRepository = connection.getRepository(User);

      const users = await userRepository.find();

      expect(users[0].password).not.toBe(payload.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2a\$\d+\$/);
    });

    it("should return 400 status code if email already exists", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "Secret",
      };

      const userRepository = connection.getRepository(User);

      await userRepository.save({ ...payload, role: "customer" });

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      const users = await userRepository.find();

      // ASSERT
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
  });

  describe("Fields are missing", () => {
    it("should return 400 status code if email is missing", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "",
        password: "Secret",
      };

      const userRepository = connection.getRepository(User);

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      const users = await userRepository.find();

      // ASSERT
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });
  });
});
