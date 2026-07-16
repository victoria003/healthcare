import { executeQuery } from "../lib/database/executeQuery";
import { Booking } from "../lib/types";

function mapBooking(row: any): Booking {
  return {
    id: row.BOOKING_ID || row.booking_id,
    agencyId: row.AGENCY_ID || row.agency_id,
    agencyName: row.AGENCY_NAME || row.agency_name || "Nisarga Home Healthcare Services",
    patientId: row.PATIENT_ID || row.patient_id,
    patientName: row.PATIENT_NAME || row.patient_name || "Demo Patient",
    serviceCategory: row.SERVICE_CATEGORY || row.service_category,
    serviceName: row.SERVICE_NAME || row.service_name,
    status: row.STATUS || row.status || "pending",
    date: row.BOOKING_DATE || row.booking_date || "",
    timeSlot: row.TIME_SLOT || row.time_slot,
    durationHours: Number(row.DURATION_HOURS || row.duration_hours || 0),
    frequency: row.FREQUENCY || row.frequency,
    address: {
      id: "addr-1",
      label: "Home",
      addressLine: row.ADDRESS_LINE || row.address_line || "",
      city: row.CITY || row.city || "",
      state: row.STATE || row.state || "",
      pincode: row.PINCODE || row.pincode || "",
      lat: 17.4442,
      lng: 78.3562
    },
    amount: Number(row.AMOUNT || row.amount || 0),
    paymentStatus: (row.PAYMENT_STATUS || row.payment_status || "unpaid") as any,
    assignedStaffId: row.ASSIGNED_STAFF_ID || row.assigned_staff_id || null,
    assignedStaffName: row.ASSIGNED_STAFF_NAME || row.assigned_staff_name || null,
    assignedStaffPhone: row.ASSIGNED_STAFF_PHONE || row.assigned_staff_phone || null,
    assignedStaffAvatar: row.ASSIGNED_STAFF_AVATAR || row.assigned_staff_avatar || null,
    createdAt: row.CREATED_AT || row.created_at,
  };
}

export const BookingRepository = {
  async getAll(): Promise<Booking[]> {
    const sql = `
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id;
    `;
    const rows = await executeQuery<any>(sql);
    return rows.map(mapBooking);
  },

  async findById(id: string): Promise<Booking | undefined> {
    const sql = `
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.booking_id = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapBooking(rows[0]) : undefined;
  },

  async findByPatient(patientId: string): Promise<Booking[]> {
    const sql = `
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.patient_id = ?;
    `;
    const rows = await executeQuery<any>(sql, [patientId]);
    return rows.map(mapBooking);
  },

  async findByAgency(agencyId: string): Promise<Booking[]> {
    const sql = `
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.agency_id = ?;
    `;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map(mapBooking);
  },

  async findByStaff(staffId: string): Promise<Booking[]> {
    const sql = `
      SELECT b.*, a.name AS agency_name, u.full_name AS patient_name
      FROM CORE.BOOKINGS b
      LEFT JOIN CORE.AGENCIES a ON b.agency_id = a.agency_id
      LEFT JOIN CORE.USERS u ON b.patient_id = u.user_id
      WHERE b.assigned_staff_id = ?;
    `;
    const rows = await executeQuery<any>(sql, [staffId]);
    return rows.map(mapBooking);
  },

  async create(booking: Omit<Booking, "id" | "createdAt" | "status" | "paymentStatus">): Promise<Booking> {
    const id = `book-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const sql = `
      INSERT INTO CORE.BOOKINGS (
        booking_id, agency_id, patient_id, service_category, service_name, status, 
        booking_date, time_slot, duration_hours, frequency, address_line, city, state, pincode, amount, payment_status
      ) VALUES (?, ?, ?, ?, ?, 'booking_created', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid');
    `;
    await executeQuery(sql, [
      id,
      booking.agencyId,
      booking.patientId,
      booking.serviceCategory,
      booking.serviceName,
      booking.date,
      booking.timeSlot,
      booking.durationHours,
      booking.frequency,
      booking.address?.addressLine || "",
      booking.address?.city || "",
      booking.address?.state || "",
      booking.address?.pincode || "",
      booking.amount,
    ]);

    const insertInvoiceSql = `
      INSERT INTO CORE.INVOICES (
        invoice_id, booking_id, amount, tax, discount, total_amount, status, due_date, created_at
      ) VALUES (?, ?, ?, ?, 0, ?, 'unpaid', DATEADD(day, 5, CURRENT_DATE()), CURRENT_TIMESTAMP());
    `;
    await executeQuery(insertInvoiceSql, [
      `INV-${Date.now()}`,
      id,
      booking.amount,
      Math.round(booking.amount * 0.18),
      Math.round(booking.amount * 1.18),
    ]);

    return {
      ...booking,
      id,
      status: "booking_created",
      paymentStatus: "unpaid",
      createdAt,
    };
  },

  async update(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const keys = Object.keys(updates).filter(k => k !== "id" && k !== "createdAt" && updates[k as keyof Booking] !== undefined);
    if (keys.length > 0) {
      const updateFields = keys.map(k => {
        const sqlCol = k.replace(/([A-Z])/g, "_$1").toUpperCase();
        return `${sqlCol} = ?`;
      }).join(", ");
      const binds = keys.map(k => updates[k as keyof Booking]);
      binds.push(id);
      const sql = `UPDATE CORE.BOOKINGS SET ${updateFields}, UPDATED_AT = CURRENT_TIMESTAMP() WHERE BOOKING_ID = ?;`;
      await executeQuery(sql, binds);
    }
    return this.findById(id);
  }
};
