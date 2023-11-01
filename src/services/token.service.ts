import fs from "fs";
import path from "path";

import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";

import { CONFIG } from "@/config";

export class TokenService {
  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;

    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, "../../certs/private.pem"),
      );
    } catch (error) {
      const err = createHttpError(500, "Error while reading private.pem file");

      throw err;
    }

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth-service",
    });

    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = jwt.sign(payload, CONFIG.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(payload.id),
    });

    return refreshToken;
  }
}
