import { executeQuery } from "../lib/database/executeQuery";

export const NotificationService = {
  async sendNotification(payload: {
    userId: string;
    title: string;
    template: string;
    variables: Record<string, string>;
  }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.NOTIFICATIONS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        title VARCHAR(200),
        message TEXT,
        status VARCHAR(20),
        retries INT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    let message = payload.template;
    Object.keys(payload.variables).forEach((key) => {
      message = message.replace(`{{${key}}}`, payload.variables[key]);
    });

    const id = `notif-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.NOTIFICATIONS (id, user_id, title, message, status, retries)
      VALUES (?, ?, ?, ?, 'delivered', 0);
    `;
    await executeQuery(sql, [id, payload.userId, payload.title, message]);

    return {
      id,
      userId: payload.userId,
      title: payload.title,
      message,
      status: "delivered" as const,
      retries: 0,
      createdAt: new Date().toISOString()
    };
  },

  async getHistory(userId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.NOTIFICATIONS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        title VARCHAR(200),
        message TEXT,
        status VARCHAR(20),
        retries INT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.NOTIFICATIONS WHERE user_id = ? ORDER BY created_at DESC;`;
    const rows = await executeQuery<any>(sql, [userId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      userId: row.USER_ID || row.user_id,
      title: row.TITLE || row.title,
      message: row.MESSAGE || row.message,
      status: row.STATUS || row.status,
      retries: Number(row.RETRIES || row.retries || 0),
      createdAt: row.CREATED_AT || row.created_at,
    }));
  }
};
