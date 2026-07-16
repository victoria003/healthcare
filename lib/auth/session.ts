import { AuthRepository } from "../../repositories/auth.repository";
import { Session } from "../../types/auth";

export const SessionLib = {
  async createSession(userId: string, token: string, refreshToken: string): Promise<Session> {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days expiry
    const newSession: Session = {
      id: `sess-${Date.now()}`,
      userId,
      token,
      refreshToken,
      expiresAt,
      revoked: false,
      createdAt: new Date().toISOString()
    };
    return await AuthRepository.saveSession(newSession);
  },

  async revokeSession(token: string): Promise<boolean> {
    return await AuthRepository.deleteSession(token);
  }
};
