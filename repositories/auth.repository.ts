import { executeQuery } from "../lib/database/executeQuery";
import { User, Session } from "../types/auth";

export const AuthRepository = {
  async createUser(
    user: Omit<User, "createdAt" | "updatedAt"> & { passwordHash: string; role: string }
  ): Promise<User> {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const newUser: User = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: "active",
      createdAt,
      updatedAt,
    };

    // 1. App User SQL
    const insertUserSql = `
      INSERT INTO CORE.APP_USER (user_id, first_name, last_name, email, phone, password_hash, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;
    await executeQuery(insertUserSql, [user.id, user.firstName, user.lastName, user.email, user.phone, user.passwordHash]);

    // 2. Role assignment SQL. We find the role matching the input name (e.g. role-1 for PATIENT, etc.)
    const roleIdMap: Record<string, string> = {
      PATIENT: "role-1",
      PROFESSIONAL: "role-2",
      AGENCY: "role-3",
      ADMIN: "role-4",
      SUPER_ADMIN: "role-5",
    };
    const assignedRoleId = roleIdMap[user.role.toUpperCase()] || "role-1";
    const userRoleId = `ur-${Date.now()}`;
    const insertUserRoleSql = `
      INSERT INTO CORE.USER_ROLE (user_role_id, user_id, role_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP());
    `;
    await executeQuery(insertUserRoleSql, [userRoleId, user.id, assignedRoleId]);

    return newUser;
  },

  async findUserByEmail(email: string): Promise<(User & { passwordHash: string; role: string }) | undefined> {
    const selectUserSql = `
      SELECT u.*, r.role_name 
      FROM CORE.APP_USER u
      LEFT JOIN CORE.USER_ROLE ur ON u.user_id = ur.user_id
      LEFT JOIN CORE.ROLE r ON ur.role_id = r.role_id
      WHERE LOWER(u.email) = LOWER(?);
    `;
    const rows = await executeQuery(selectUserSql, [email]);
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        id: row.USER_ID || row.user_id,
        firstName: row.FIRST_NAME || row.first_name,
        lastName: row.LAST_NAME || row.last_name,
        email: row.EMAIL || row.email,
        phone: row.PHONE || row.phone,
        status: (row.STATUS || row.status || "active") as any,
        createdAt: row.CREATED_AT || row.created_at,
        updatedAt: row.UPDATED_AT || row.updated_at,
        passwordHash: row.PASSWORD_HASH || row.password_hash,
        role: row.ROLE_NAME || row.role_name || "PATIENT",
      };
    }
    return undefined;
  },

  async findUserById(id: string): Promise<(User & { passwordHash: string; role: string }) | undefined> {
    const selectUserSql = `
      SELECT u.*, r.role_name 
      FROM CORE.APP_USER u
      LEFT JOIN CORE.USER_ROLE ur ON u.user_id = ur.user_id
      LEFT JOIN CORE.ROLE r ON ur.role_id = r.role_id
      WHERE u.user_id = ?;
    `;
    const rows = await executeQuery(selectUserSql, [id]);
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        id: row.USER_ID || row.user_id,
        firstName: row.FIRST_NAME || row.first_name,
        lastName: row.LAST_NAME || row.last_name,
        email: row.EMAIL || row.email,
        phone: row.PHONE || row.phone,
        status: (row.STATUS || row.status || "active") as any,
        createdAt: row.CREATED_AT || row.created_at,
        updatedAt: row.UPDATED_AT || row.updated_at,
        passwordHash: row.PASSWORD_HASH || row.password_hash,
        role: row.ROLE_NAME || row.role_name || "PATIENT",
      };
    }
    return undefined;
  },

  async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
    const updatePasswordSql = `
      UPDATE CORE.APP_USER 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP()
      WHERE user_id = ?;
    `;
    await executeQuery(updatePasswordSql, [passwordHash, userId]);
    return true;
  },

  async saveSession(session: Session): Promise<Session> {
    const insertSessionSql = `
      INSERT INTO CORE.USER_SESSION (session_id, user_id, token, refresh_token, expires_at, revoked, created_at)
      VALUES (?, ?, ?, ?, ?, FALSE, CURRENT_TIMESTAMP());
    `;
    await executeQuery(insertSessionSql, [session.id, session.userId, session.token, session.refreshToken, session.expiresAt]);
    return session;
  },

  async deleteSession(token: string): Promise<boolean> {
    const deleteSessionSql = `
      UPDATE CORE.USER_SESSION 
      SET revoked = TRUE 
      WHERE token = ? OR refresh_token = ?;
    `;
    await executeQuery(deleteSessionSql, [token, token]);
    return true;
  },

  async saveResetToken(userId: string, token: string, expiresAt: string): Promise<boolean> {
    const id = `reset-${Date.now()}`;
    const insertResetSql = `
      INSERT INTO CORE.PASSWORD_RESET (reset_id, user_id, token, expires_at, used, created_at)
      VALUES (?, ?, ?, ?, FALSE, CURRENT_TIMESTAMP());
    `;
    await executeQuery(insertResetSql, [id, userId, token, expiresAt]);
    return true;
  },

  async findResetToken(token: string): Promise<{ userId: string; expiresAt: string; used: boolean } | undefined> {
    const selectResetSql = `
      SELECT * FROM CORE.PASSWORD_RESET 
      WHERE token = ? AND used = FALSE;
    `;
    const rows = await executeQuery(selectResetSql, [token]);
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        userId: row.USER_ID || row.user_id,
        expiresAt: row.EXPIRES_AT || row.expires_at,
        used: !!(row.USED || row.used),
      };
    }
    return undefined;
  },

  async updateLastLogin(userId: string): Promise<boolean> {
    const updateLoginSql = `
      UPDATE CORE.APP_USER 
      SET updated_at = CURRENT_TIMESTAMP()
      WHERE user_id = ?;
    `;
    await executeQuery(updateLoginSql, [userId]);
    return true;
  },

  async logLoginHistory(log: {
    userId: string | null;
    ipAddress: string;
    userAgent: string;
    status: "success" | "failed";
    failureReason?: string;
  }): Promise<boolean> {
    const historyId = `hist-${Date.now()}`;
    const insertHistorySql = `
      INSERT INTO CORE.LOGIN_HISTORY (history_id, user_id, login_at, ip_address, user_agent, status, failure_reason)
      VALUES (?, ?, CURRENT_TIMESTAMP(), ?, ?, ?, ?);
    `;
    await executeQuery(insertHistorySql, [historyId, log.userId, log.ipAddress, log.userAgent, log.status, log.failureReason || ""]);
    return true;
  },
};
