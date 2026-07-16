import { executeQuery } from "../lib/database/executeQuery";

export interface ProfessionalDomain {
  id: string;
  agencyId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  category: string;
  role: string;
  organization: string;
  rating: number;
  experienceYears: number;
  status: string;
  skills: string[];
}

function mapProfessional(row: any): ProfessionalDomain {
  let skills: string[] = [];
  try {
    if (row.SKILLS) {
      skills = typeof row.SKILLS === "string" ? JSON.parse(row.SKILLS) : (Array.isArray(row.SKILLS) ? row.SKILLS : []);
    }
  } catch {
    skills = [];
  }

  const role = (row.ROLE || row.role || "").toLowerCase();
  let category = "Caregivers";
  if (role.includes("nurse") || role === "nursing") {
    category = "Nurses";
  } else if (role.includes("doctor") || role.includes("physician") || role.includes("specialist")) {
    category = "Doctors";
  } else if (role.includes("physiotherapist") || role.includes("physio")) {
    category = "Physiotherapists";
  } else if (skills.some(s => s.toLowerCase().includes("icu") || s.toLowerCase().includes("nurs"))) {
    category = "Nurses";
  }

  return {
    id: row.STAFF_ID || row.staff_id,
    agencyId: row.AGENCY_ID || row.agency_id,
    fullName: row.FULL_NAME || row.full_name,
    email: row.EMAIL || row.email,
    phone: row.PHONE_NUMBER || row.phone_number || row.phone,
    avatarUrl: row.AVATAR_URL || row.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    category,
    role: row.ROLE || row.role || "Caregiver",
    organization: row.AGENCY_NAME || row.agency_name || "HomeCare Partner",
    rating: Number(row.RATING || row.rating || 5.0),
    experienceYears: Number(row.EXPERIENCE_YEARS || row.experience_years || 2),
    status: row.STATUS || row.status || "active",
    skills,
  };
}

export const ProfessionalRepository = {
  async getAll(): Promise<ProfessionalDomain[]> {
    const sql = `
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID;
    `;
    const rows = await executeQuery<any>(sql);
    return rows.map(mapProfessional);
  },

  async findById(id: string): Promise<ProfessionalDomain | undefined> {
    const sql = `
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID
      WHERE p.PROFESSIONAL_ID = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapProfessional(rows[0]) : undefined;
  },

  async findByAgency(agencyId: string): Promise<ProfessionalDomain[]> {
    // Agency mapping is not direct in the new PROFESSIONAL table yet
    return [];
  },

  async create(staff: {
    fullName: string;
    email: string;
    phone: string;
    experienceYears: number;
  }): Promise<ProfessionalDomain> {
    const parts = staff.fullName.split(" ");
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";

    const sql = `
      INSERT INTO CORE.PROFESSIONAL (
        FIRST_NAME, LAST_NAME, EMAIL, PHONE, EXPERIENCE_YEARS, PROFESSIONAL_CATEGORY_ID, SPECIALIZATION_ID, VERIFICATION_STATUS_ID, CREATED_AT
      ) VALUES (?, ?, ?, ?, ?, 1, 1, 1, CURRENT_TIMESTAMP());
    `;

    await executeQuery(sql, [
      firstName,
      lastName,
      staff.email,
      staff.phone,
      staff.experienceYears,
    ]);

    // Fetch the inserted record
    const sqlFetch = `
      SELECT 
        p.PROFESSIONAL_ID as STAFF_ID,
        p.FIRST_NAME || ' ' || p.LAST_NAME as FULL_NAME,
        p.EMAIL,
        p.PHONE,
        pc.CATEGORY_CODE as ROLE,
        sm.SPECIALIZATION_NAME as SKILLS,
        p.EXPERIENCE_YEARS,
        p.VERIFICATION_STATUS_ID,
        5.0 as RATING,
        'active' as STATUS,
        '' as AVATAR_URL,
        NULL as AGENCY_ID,
        '' as AGENCY_NAME
      FROM CORE.PROFESSIONAL p
      LEFT JOIN CORE.PROFESSIONAL_CATEGORY_MASTER pc ON p.PROFESSIONAL_CATEGORY_ID = pc.PROFESSIONAL_CATEGORY_ID
      LEFT JOIN CORE.SPECIALIZATION_MASTER sm ON p.SPECIALIZATION_ID = sm.SPECIALIZATION_ID
      WHERE p.EMAIL = ?;
    `;
    const rows = await executeQuery<any>(sqlFetch, [staff.email]);
    if (!rows || rows.length === 0) throw new Error("Failed to retrieve created professional.");
    return mapProfessional(rows[0]);
  },

  async update(id: string, updates: Partial<ProfessionalDomain>): Promise<ProfessionalDomain | undefined> {
    const sets = [];
    const binds = [];
    
    if (updates.fullName) {
      const parts = updates.fullName.split(" ");
      sets.push("FIRST_NAME = ?"); binds.push(parts[0]);
      sets.push("LAST_NAME = ?"); binds.push(parts.slice(1).join(" "));
    }
    if (updates.email) { sets.push("EMAIL = ?"); binds.push(updates.email); }
    if (updates.phone) { sets.push("PHONE = ?"); binds.push(updates.phone); }
    if (updates.experienceYears !== undefined) { sets.push("EXPERIENCE_YEARS = ?"); binds.push(updates.experienceYears); }

    if (sets.length > 0) {
      binds.push(id);
      const sql = `UPDATE CORE.PROFESSIONAL SET ${sets.join(", ")} WHERE PROFESSIONAL_ID = ?`;
      await executeQuery(sql, binds);
    }
    return this.findById(id);
  },

  async delete(id: string): Promise<void> {
    const sql = `DELETE FROM CORE.PROFESSIONAL WHERE PROFESSIONAL_ID = ?`;
    await executeQuery(sql, [id]);
  },
};
