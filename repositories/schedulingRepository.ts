import { executeQuery } from "../lib/database/executeQuery";

export const SchedulingRepository = {
  async getAttendanceByStaff(staffId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.ATTENDANCE (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        agency_id VARCHAR(50),
        date VARCHAR(20),
        check_in VARCHAR(20),
        check_out VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.ATTENDANCE WHERE staff_id = ? ORDER BY date DESC;`;
    const rows = await executeQuery<any>(sql, [staffId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      staffId: row.STAFF_ID || row.staff_id,
      agencyId: row.AGENCY_ID || row.agency_id,
      date: row.DATE || row.date,
      checkIn: row.CHECK_IN || row.check_in,
      checkOut: row.CHECK_OUT || row.check_out,
      status: row.STATUS || row.status,
    }));
  },

  async logAttendance(record: { staffId: string; agencyId: string; date: string; checkIn: string; checkOut: string; status: "present" | "absent" | "late" }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.ATTENDANCE (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        agency_id VARCHAR(50),
        date VARCHAR(20),
        check_in VARCHAR(20),
        check_out VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `att-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.ATTENDANCE (id, staff_id, agency_id, date, check_in, check_out, status)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    await executeQuery(sql, [id, record.staffId, record.agencyId, record.date, record.checkIn, record.checkOut, record.status]);
    return { id, ...record };
  },

  async getLeaveRecordsByStaff(staffId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.LEAVE_RECORDS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        date VARCHAR(20),
        type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.LEAVE_RECORDS WHERE staff_id = ? ORDER BY date DESC;`;
    const rows = await executeQuery<any>(sql, [staffId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      staffId: row.STAFF_ID || row.staff_id,
      date: row.DATE || row.date,
      type: row.TYPE || row.type,
      status: row.STATUS || row.status,
    }));
  },

  async requestLeave(record: { staffId: string; date: string; type: "sick" | "casual" | "annual"; status: "pending" | "approved" | "rejected" }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.LEAVE_RECORDS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        date VARCHAR(20),
        type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `lv-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.LEAVE_RECORDS (id, staff_id, date, type, status)
      VALUES (?, ?, ?, ?, ?);
    `;
    await executeQuery(sql, [id, record.staffId, record.date, record.type, record.status]);
    return { id, ...record };
  },

  async updateLeaveStatus(id: string, status: "approved" | "rejected") {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.LEAVE_RECORDS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        date VARCHAR(20),
        type VARCHAR(20),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `UPDATE CORE.LEAVE_RECORDS SET status = ? WHERE id = ?;`;
    await executeQuery(sql, [status, id]);

    const selectSql = `SELECT * FROM CORE.LEAVE_RECORDS WHERE id = ?;`;
    const rows = await executeQuery<any>(selectSql, [id]);
    if (rows[0]) {
      const row = rows[0];
      return {
        id: row.ID || row.id,
        staffId: row.STAFF_ID || row.staff_id,
        date: row.DATE || row.date,
        type: row.TYPE || row.type,
        status: row.STATUS || row.status,
      };
    }
    return undefined;
  },

  async getCertificationsByStaff(staffId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.CERTIFICATIONS (
        id VARCHAR(50) PRIMARY KEY,
        staff_id VARCHAR(50),
        name VARCHAR(150),
        authority VARCHAR(100),
        issue_date VARCHAR(20),
        expiry_date VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.CERTIFICATIONS WHERE staff_id = ?;`;
    const rows = await executeQuery<any>(sql, [staffId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      staffId: row.STAFF_ID || row.staff_id,
      name: row.NAME || row.name,
      authority: row.AUTHORITY || row.authority,
      issueDate: row.ISSUE_DATE || row.issue_date,
      expiryDate: row.EXPIRY_DATE || row.expiry_date,
    }));
  }
};
