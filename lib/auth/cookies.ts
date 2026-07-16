import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "hc_access_token";
const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "hc_refresh_token";

export const CookiesLib = {
  async setAuthCookies(accessToken: string, refreshToken: string) {
    try {
      const cookieStore = await cookies();
      
      cookieStore.set(COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60, // 15 mins in seconds
        path: "/",
      });

      cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
      });
    } catch (err: any) {
      console.warn("[CookiesLib] Unable to set cookies (possibly outside request context):", err.message);
    }
  },

  async clearAuthCookies() {
    try {
      const cookieStore = await cookies();
      cookieStore.delete(COOKIE_NAME);
      cookieStore.delete(REFRESH_COOKIE_NAME);
    } catch (err: any) {
      console.warn("[CookiesLib] Unable to clear cookies (possibly outside request context):", err.message);
    }
  },

  async getAccessToken(): Promise<string | undefined> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get(COOKIE_NAME)?.value;
    } catch (err: any) {
      console.warn("[CookiesLib] Unable to get access token (possibly outside request context):", err.message);
      return undefined;
    }
  },

  async getRefreshToken(): Promise<string | undefined> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    } catch (err: any) {
      console.warn("[CookiesLib] Unable to get refresh token (possibly outside request context):", err.message);
      return undefined;
    }
  }
};
