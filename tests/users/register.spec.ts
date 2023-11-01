import request from "supertest";
import { DataSource } from "typeorm";

import app from "@/app";
import { AppDataSource } from "@/config/data-source";
import { Roles } from "@/constants";
import { RefreshToken } from "@/entity/RefreshToken";
import { User } from "@/entity/User";

import { isJWT } from "../utils";

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
        password: "password",
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
        password: "password",
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
        password: "password",
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
        password: "password",
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
        password: "password",
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
        password: "password",
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
        password: "password",
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

    it("should return access token and refresh token inside a cookie", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      // ACT
      let accessToken = null;
      let refreshToken = null;

      const response = await request(app).post("/auth/register").send(payload);

      interface IHeaders {
        ["set-cookie"]: string[];
      }

      // ASSERT
      const cookies = (response.headers as IHeaders)["set-cookie"] || [];

      cookies.forEach((cookie) => {
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.split(";")[0].split("=")[1];
        }

        if (cookie.startsWith("refreshToken=")) {
          refreshToken = cookie.split(";")[0].split("=")[1];
        }
      });

      expect(accessToken).not.toBeNull();
      expect(refreshToken).not.toBeNull();

      expect(isJWT(accessToken)).toBeTruthy();
      expect(isJWT(refreshToken)).toBeTruthy();
    });

    it("should store the refresh token in the database", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      // ASSERT
      const refreshTokenRepo = connection.getRepository(RefreshToken);
      // const tokens = await refreshTokenRepo.find();

      const tokens = await refreshTokenRepo
        .createQueryBuilder("refreshToken")
        .where("refreshToken.userId = :userId", {
          userId: (response.body as Record<string, string>).id,
        })
        .getMany();

      expect(tokens).toHaveLength(1);
    });
  });

  describe("Fields are missing", () => {
    it("should return 400 status code if email is missing", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      const users = await userRepository.find();

      // ASSERT
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if firstName is missing", async () => {
      // ARRANGE
      const payload = {
        firstName: "",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      const users = await userRepository.find();

      // ASSERT
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if lastName is missing", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      const userRepository = connection.getRepository(User);

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      const users = await userRepository.find();

      // ASSERT
      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(0);
    });

    it("should return 400 status code if password is missing", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "",
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

  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: " vjshivam5@gmail.com ",
        password: "password",
      };

      // ACT
      await request(app).post("/auth/register").send(payload);

      // ASSERT
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0].email).toBe("vjshivam5@gmail.com");
    });

    it("should return 400 status code if email is invalid", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5gmail.com",
        password: "password",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      // ASSERT
      expect(response.statusCode).toBe(400);
    });

    it("should return 400 status code if password length is less than 8 characters", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5gmail.com",
        password: "*******",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      // ASSERT
      expect(response.statusCode).toBe(400);
    });

    it("should return an array of errors if email is missing", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: " vjshivam5gmail.com ",
        password: "*******",
      };

      // ACT
      const response = await request(app).post("/auth/register").send(payload);

      // ASSERT
      expect(response.body).toHaveProperty("errors");
      expect(
        Array.isArray((response.body as Record<string, string>).errors),
      ).toBe(true);
    });
  });
});
