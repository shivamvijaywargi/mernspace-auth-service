import request from "supertest";
import { DataSource } from "typeorm";

import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { User } from "../../src/entity/User";
import { isJWT } from "../utils";

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
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(payload);
      const response = await request(app).post("/auth/login").send(payload);

      const userRepository = connection.getRepository(User);

      const user = await userRepository.findOne({
        where: { email: payload.email },
      });

      expect(user?.email).toBe(payload.email);
      expect(response.statusCode).toBe(200);
    });

    it("should match user entered plain password with hashed password", async () => {
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "vjshivam5@gmail.com",
        password: "password",
      };

      // Act
      await request(app).post("/auth/register").send(payload);
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

    it("should return access token and refresh token inside a cookie", async () => {
      // ARRANGE
      const payload = {
        firstName: "Shivam",
        lastName: "Vijaywargi",
        email: "one@one.one",
        password: "password",
      };

      // ACT
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      await request(app).post("/auth/register").send(payload);
      const response = await request(app).post("/auth/login").send(payload);

      interface IHeaders {
        ["set-cookie"]: string[];
      }

      // ASSERT
      const cookies =
        (response.headers as unknown as IHeaders)["set-cookie"] || [];

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
        email: "one@one.one",
        password: "password",
      };

      // ACT
      await request(app).post("/auth/register").send(payload);
      const response = await request(app).post("/auth/login").send(payload);

      // ASSERT
      const refreshTokenRepo = connection.getRepository(RefreshToken);
      // const tokens = await refreshTokenRepo.find();

      const tokens = await refreshTokenRepo
        .createQueryBuilder("refreshToken")
        .where("refreshToken.userId = :userId", {
          userId: (response.body as Record<string, string>).id,
        })
        .getMany();

      expect(tokens).toHaveLength(2);
    });
  });

  describe("Fields are missing", () => {});
});
