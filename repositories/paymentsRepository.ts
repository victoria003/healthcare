import { executeQuery } from "../lib/database/executeQuery";
import { Invoice } from "../lib/types";

function mapInvoiceRow(row: any): Invoice {
  return {
    id: row.INVOICE_ID || row.invoice_id,
    bookingId: row.BOOKING_ID || row.booking_id,
    patientName: row.PATIENT_NAME || row.patient_name || "Demo Patient",
    agencyName: row.AGENCY_NAME || row.agency_name || "Nisarga Home Healthcare Services",
    amount: Number(row.AMOUNT || row.amount || 0),
    tax: Number(row.TAX || row.tax || 0),
    discount: Number(row.DISCOUNT || row.discount || 0),
    total: Number(row.TOTAL_AMOUNT || row.total_amount || 0),
    status: (row.STATUS || row.status || "unpaid") as any,
    dueDate: row.DUE_DATE || row.due_date || "",
    createdAt: row.CREATED_AT || row.created_at,
  };
}

export const PaymentsRepository = {
  async getInvoices(): Promise<Invoice[]> {
    const sql = `
      SELECT i.*, u.full_name AS patient_name, a.name AS agency_name
      FROM CORE.INVOICES i
      JOIN CORE.BOOKINGS b ON i.booking_id = b.booking_id
      JOIN CORE.USERS u ON b.patient_id = u.user_id
      JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id;
    `;
    const rows = await executeQuery<any>(sql);
    return rows.map(mapInvoiceRow);
  },

  async findInvoiceById(id: string): Promise<Invoice | undefined> {
    const sql = `
      SELECT i.*, u.full_name AS patient_name, a.name AS agency_name
      FROM CORE.INVOICES i
      JOIN CORE.BOOKINGS b ON i.booking_id = b.booking_id
      JOIN CORE.USERS u ON b.patient_id = u.user_id
      JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      WHERE i.invoice_id = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapInvoiceRow(rows[0]) : undefined;
  },

  async updateInvoiceStatus(id: string, status: "paid" | "unpaid" | "overdue"): Promise<Invoice | undefined> {
    const sql = `UPDATE CORE.INVOICES SET status = ? WHERE invoice_id = ?;`;
    await executeQuery(sql, [status, id]);
    return this.findInvoiceById(id);
  },

  async getSubscriptionsByAgency(agencyId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.SUBSCRIPTIONS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        plan VARCHAR(20),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        next_billing_date DATE,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.SUBSCRIPTIONS WHERE agency_id = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      agencyId: row.AGENCY_ID || row.agency_id,
      plan: row.PLAN || row.plan,
      amount: Number(row.AMOUNT || row.amount || 0),
      status: row.STATUS || row.status,
      nextBillingDate: row.NEXT_BILLING_DATE || row.next_billing_date,
    }));
  },

  async createSubscription(sub: { agencyId: string; plan: "basic" | "premium" | "enterprise"; amount: number; status: "active" | "canceled" | "past_due"; nextBillingDate: string }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.SUBSCRIPTIONS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        plan VARCHAR(20),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        next_billing_date DATE,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `sub-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.SUBSCRIPTIONS (id, agency_id, plan, amount, status, next_billing_date)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await executeQuery(sql, [id, sub.agencyId, sub.plan, sub.amount, sub.status, sub.nextBillingDate]);
    return { id, ...sub };
  },

  async getPayrollByAgency(agencyId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.PAYROLL (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        staff_id VARCHAR(50),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.PAYROLL WHERE agency_id = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      agencyId: row.AGENCY_ID || row.agency_id,
      staffId: row.STAFF_ID || row.staff_id,
      amount: Number(row.AMOUNT || row.amount || 0),
      status: row.STATUS || row.status,
    }));
  }
};
