import { executeQuery } from "../lib/database/executeQuery";
import { Agency } from "../lib/types";

export const AgencyRepository = {
  async getAll(): Promise<Agency[]> {
    const sql = `
      SELECT 
        a.AGENCY_ID, 
        a.AGENCY_NAME, 
        a.REGISTRATION_NO, 
        a.GST_NO, 
        a.PHONE, 
        a.EMAIL, 
        c.CITY_NAME as CITY,
        a.VERIFICATION_STATUS_ID,
        a.CREATED_AT
      FROM CORE.AGENCY a
      LEFT JOIN CORE.CITY_MASTER c ON a.CITY_ID = c.CITY_ID;
    `;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      id: row.AGENCY_ID || row.agency_id,
      name: row.AGENCY_NAME || row.agency_name,
      description: "",
      registrationNumber: row.REGISTRATION_NO || row.registration_no,
      gstNumber: row.GST_NO || row.gst_no,
      panNumber: "",
      ownerName: "",
      phone: row.PHONE || row.phone,
      email: row.EMAIL || row.email,
      city: row.CITY || row.city || "",
      state: "",
      pincode: "",
      rating: 5.0,
      reviewCount: 0,
      verified: row.VERIFICATION_STATUS_ID === 3,
      status: "approved",
      documents: [],
      createdAt: row.CREATED_AT || row.created_at,
    }));
  },

  async findById(id: string): Promise<Agency | undefined> {
    const sql = `
      SELECT 
        a.AGENCY_ID, 
        a.AGENCY_NAME, 
        a.REGISTRATION_NO, 
        a.GST_NO, 
        a.PHONE, 
        a.EMAIL, 
        c.CITY_NAME as CITY,
        a.VERIFICATION_STATUS_ID,
        a.CREATED_AT
      FROM CORE.AGENCY a
      LEFT JOIN CORE.CITY_MASTER c ON a.CITY_ID = c.CITY_ID
      WHERE a.AGENCY_ID = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        id: row.AGENCY_ID || row.agency_id,
        name: row.AGENCY_NAME || row.agency_name,
        description: "",
        registrationNumber: row.REGISTRATION_NO || row.registration_no,
        gstNumber: row.GST_NO || row.gst_no,
        panNumber: "",
        ownerName: "",
        phone: row.PHONE || row.phone,
        email: row.EMAIL || row.email,
        city: row.CITY || row.city || "",
        state: "",
        pincode: "",
        rating: 5.0,
        reviewCount: 0,
        verified: row.VERIFICATION_STATUS_ID === 3,
        status: "approved",
        documents: [],
        createdAt: row.CREATED_AT || row.created_at,
      };
    }
    return undefined;
  },

  async findByEmail(email: string): Promise<Agency | undefined> {
    const sql = "SELECT * FROM CORE.AGENCIES WHERE EMAIL = ?;";
    const rows = await executeQuery<any>(sql, [email]);
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        id: row.AGENCY_ID || row.agency_id,
        name: row.NAME || row.name,
        description: row.DESCRIPTION || row.description,
        registrationNumber: row.REGISTRATION_NUMBER || row.registration_number,
        gstNumber: row.GST_NUMBER || row.gst_number,
        panNumber: row.PAN_NUMBER || row.pan_number,
        ownerName: row.OWNER_NAME || row.owner_name,
        phone: row.PHONE || row.phone,
        email: row.EMAIL || row.email,
        city: row.CITY || row.city,
        state: row.STATE || row.state,
        pincode: row.PINCODE || row.pincode,
        rating: Number(row.RATING || row.rating || 5.0),
        reviewCount: Number(row.REVIEW_COUNT || row.review_count || 0),
        verified: !!(row.VERIFIED || row.verified),
        status: (row.STATUS || row.status || "pending") as any,
        documents: [],
        createdAt: row.CREATED_AT || row.created_at,
      };
    }
    return undefined;
  },

  async create(agency: Omit<Agency, "id" | "createdAt" | "rating" | "reviewCount" | "verified" | "status" | "documents">): Promise<Agency> {
    const createdAt = new Date().toISOString();

    const sql = `
      INSERT INTO CORE.AGENCY (
        AGENCY_NAME, REGISTRATION_NO, GST_NO, PHONE, EMAIL, CITY_ID, VERIFICATION_STATUS_ID, CREATED_AT
      ) VALUES (?, ?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP());
    `;
    await executeQuery(sql, [
      agency.name,
      agency.registrationNumber,
      agency.gstNumber || null,
      agency.phone,
      agency.email,
    ]);

    // Snowflake does not return the inserted ID easily for auto-increment.
    // Fetch it by email.
    const created = await this.findByEmail(agency.email);
    if (!created) throw new Error("Failed to create agency");
    return created;
  },

  async update(id: string, updates: Partial<Agency>): Promise<Agency | undefined> {
    const sets = [];
    const binds = [];
    if (updates.name) { sets.push("AGENCY_NAME = ?"); binds.push(updates.name); }
    if (updates.registrationNumber) { sets.push("REGISTRATION_NO = ?"); binds.push(updates.registrationNumber); }
    if (updates.gstNumber) { sets.push("GST_NO = ?"); binds.push(updates.gstNumber); }
    if (updates.phone) { sets.push("PHONE = ?"); binds.push(updates.phone); }
    if (updates.email) { sets.push("EMAIL = ?"); binds.push(updates.email); }

    if (sets.length > 0) {
      binds.push(id);
      const sql = `UPDATE CORE.AGENCY SET ${sets.join(", ")} WHERE AGENCY_ID = ?;`;
      await executeQuery(sql, binds);
    }
    return this.findById(id);
  },

  async delete(id: string): Promise<void> {
    const sql = "DELETE FROM CORE.AGENCY WHERE AGENCY_ID = ?;";
    await executeQuery(sql, [id]);
  },

  async saveDocument(agencyId: string, doc: any): Promise<any> {
    const id = `doc-${Date.now()}`;
    const sql = `
      CREATE TABLE IF NOT EXISTS CORE.DOCUMENTS (
        document_id VARCHAR(50) PRIMARY KEY,
        owner_id VARCHAR(50),
        type VARCHAR(50),
        file_url VARCHAR(500),
        status VARCHAR(20),
        uploaded_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(sql);

    const insertSql = `
      INSERT INTO CORE.DOCUMENTS (document_id, owner_id, type, file_url, status)
      VALUES (?, ?, ?, ?, 'pending');
    `;
    await executeQuery(insertSql, [id, agencyId, doc.type, doc.fileUrl]);

    return {
      id,
      status: "pending",
      uploadedAt: new Date().toISOString(),
      ...doc
    };
  }
};
