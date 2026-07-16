import * as jose from "jose";
import { JWTPayload } from "../../types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "homecare_jwt_access_secure_platform_secret_token_2026_key_super_secret_access";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "homecare_jwt_refresh_secure_platform_secret_token_2026_key_super_secret_refresh";

const secretKey = new TextEncoder().encode(JWT_SECRET);
const refreshSecretKey = new TextEncoder().encode(JWT_REFRESH_SECRET);

export const JWTLib = {
  async signAccessToken(payload: JWTPayload): Promise<string> {
    return await new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(secretKey);
  },

  async signRefreshToken(payload: JWTPayload): Promise<string> {
    return await new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(refreshSecretKey);
  },

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    const { payload } = await jose.jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  },

  async verifyRefreshToken(token: string): Promise<JWTPayload> {
    const { payload } = await jose.jwtVerify(token, refreshSecretKey);
    return payload as unknown as JWTPayload;
  },
};
