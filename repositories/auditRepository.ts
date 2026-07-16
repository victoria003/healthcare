import { executeQuery } from "../lib/database/executeQuery";
import { AuditLog } from "../lib/types";

export const AuditRepository = {
  async createLog(actorId: string, action: string, details: string, ip: string): Promise<AuditLog> {
    const sql = `
      INSERT INTO CORE.AUDIT_LOGS (actor_id, action, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP());
    `;
    await executeQuery(sql, [actorId, action, details, ip || "127.0.0.1"]);
    return {
      log_id: Date.now(),
      actor_id: actorId,
      action,
      details,
      ip_address: ip || "127.0.0.1",
      created_at: new Date().toISOString()
    };
  },

  async getAll(): Promise<AuditLog[]> {
    const sql = `SELECT * FROM CORE.AUDIT_LOGS ORDER BY created_at DESC;`;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      log_id: Number(row.LOG_ID || row.log_id || 0),
      actor_id: row.ACTOR_ID || row.actor_id,
      action: row.ACTION || row.action,
      details: row.DETAILS || row.details,
      ip_address: row.IP_ADDRESS || row.ip_address,
      created_at: row.CREATED_AT || row.created_at,
    }));
  }
};
