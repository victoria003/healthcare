import { executeQuery } from "../lib/database/executeQuery";

export const SupportRepository = {
  async getTicketsByUser(userId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.SUPPORT_TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        subject VARCHAR(200),
        message TEXT,
        category VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.SUPPORT_TICKETS WHERE user_id = ? ORDER BY created_at DESC;`;
    const rows = await executeQuery<any>(sql, [userId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      userId: row.USER_ID || row.user_id,
      subject: row.SUBJECT || row.subject,
      message: row.MESSAGE || row.message,
      category: row.CATEGORY || row.category,
      status: row.STATUS || row.status,
      createdAt: row.CREATED_AT || row.created_at,
    }));
  },

  async getTickets() {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.SUPPORT_TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        subject VARCHAR(200),
        message TEXT,
        category VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.SUPPORT_TICKETS ORDER BY created_at DESC;`;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      userId: row.USER_ID || row.user_id,
      subject: row.SUBJECT || row.subject,
      message: row.MESSAGE || row.message,
      category: row.CATEGORY || row.category,
      status: row.STATUS || row.status,
      createdAt: row.CREATED_AT || row.created_at,
    }));
  },

  async createTicket(ticket: { userId: string; subject: string; message: string; category: "billing" | "clinical" | "scheduling" | "general"; status: "open" | "in-progress" | "resolved" }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.SUPPORT_TICKETS (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        subject VARCHAR(200),
        message TEXT,
        category VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `t-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.SUPPORT_TICKETS (id, user_id, subject, message, category, status)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await executeQuery(sql, [id, ticket.userId, ticket.subject, ticket.message, ticket.category, ticket.status]);
    return { id, ...ticket, createdAt: new Date().toISOString() };
  },

  async getComplaints() {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.COMPLAINTS (
        id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        complainant_id VARCHAR(50),
        description TEXT,
        escalation_level INT,
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.COMPLAINTS ORDER BY created_at DESC;`;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      bookingId: row.BOOKING_ID || row.booking_id,
      complainantId: row.COMPLAINANT_ID || row.complainant_id,
      description: row.DESCRIPTION || row.description,
      escalationLevel: Number(row.ESCALATION_LEVEL || row.escalation_level || 1),
      status: row.STATUS || row.status,
      createdAt: row.CREATED_AT || row.created_at,
    }));
  },

  async fileComplaint(complaint: { bookingId: string; complainantId: string; description: string; escalationLevel: 1 | 2 | 3; status: "unresolved" | "investigating" | "resolved" }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.COMPLAINTS (
        id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        complainant_id VARCHAR(50),
        description TEXT,
        escalation_level INT,
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `comp-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.COMPLAINTS (id, booking_id, complainant_id, description, escalation_level, status)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await executeQuery(sql, [id, complaint.bookingId, complaint.complainantId, complaint.description, complaint.escalationLevel, complaint.status]);
    return { id, ...complaint };
  },

  async updateComplaintStatus(id: string, status: "unresolved" | "investigating" | "resolved") {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.COMPLAINTS (
        id VARCHAR(50) PRIMARY KEY,
        booking_id VARCHAR(50),
        complainant_id VARCHAR(50),
        description TEXT,
        escalation_level INT,
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `UPDATE CORE.COMPLAINTS SET status = ? WHERE id = ?;`;
    await executeQuery(sql, [status, id]);

    const selectSql = `SELECT * FROM CORE.COMPLAINTS WHERE id = ?;`;
    const rows = await executeQuery<any>(selectSql, [id]);
    if (rows[0]) {
      const row = rows[0];
      return {
        id: row.ID || row.id,
        bookingId: row.BOOKING_ID || row.booking_id,
        complainantId: row.COMPLAINANT_ID || row.complainant_id,
        description: row.DESCRIPTION || row.description,
        escalationLevel: Number(row.ESCALATION_LEVEL || row.escalation_level || 1),
        status: row.STATUS || row.status,
      };
    }
    return undefined;
  }
};
