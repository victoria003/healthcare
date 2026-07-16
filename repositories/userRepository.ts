import { executeQuery } from "../lib/database/executeQuery";
import { User } from "../lib/types";

function mapUser(row: any): User {
  return {
    id: row.USER_ID || row.user_id,
    email: row.EMAIL || row.email,
    fullName: row.FULL_NAME || row.full_name || "Demo User",
    role: (row.ROLE || row.role || "Patient") as any,
    phone: row.PHONE_NUMBER || row.phone_number || row.phone || "",
    avatarUrl: row.AVATAR_URL || row.avatar_url || "",
    status: (row.STATUS || row.status || "active") as any,
    createdAt: row.CREATED_AT || row.created_at,
  };
}

export const UserRepository = {
  async getAll(): Promise<User[]> {
    const sql = "SELECT * FROM CORE.USERS;";
    const rows = await executeQuery<any>(sql);
    return rows.map(mapUser);
  },

  async findById(id: string): Promise<User | undefined> {
    const sql = "SELECT * FROM CORE.USERS WHERE USER_ID = ?;";
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapUser(rows[0]) : undefined;
  },

  async findByEmail(email: string): Promise<any | undefined> {
    const sql = "SELECT * FROM CORE.USERS WHERE LOWER(EMAIL) = LOWER(?);";
    const rows = await executeQuery<any>(sql, [email]);
    return rows[0] ? { ...mapUser(rows[0]), passwordHash: rows[0].PASSWORD_HASH || rows[0].password_hash } : undefined;
  },

  async findByPhone(phone: string): Promise<User | undefined> {
    const sql = "SELECT * FROM CORE.USERS WHERE PHONE_NUMBER = ?;";
    const rows = await executeQuery<any>(sql, [phone]);
    return rows[0] ? mapUser(rows[0]) : undefined;
  },

  async create(user: Omit<User, "id" | "createdAt"> & { passwordHash: string }): Promise<User> {
    const id = `u-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const sql = `
      INSERT INTO CORE.USERS (user_id, email, password_hash, full_name, phone_number, role, avatar_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;
    await executeQuery(sql, [
      id,
      user.email,
      user.passwordHash,
      user.fullName,
      user.phone,
      user.role,
      user.avatarUrl || null,
    ]);

    return {
      ...user,
      id,
      createdAt
    };
  }
};
