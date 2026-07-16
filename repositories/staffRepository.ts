import { executeQuery } from "../lib/database/executeQuery";
import { StaffProfile } from "../lib/types";

function mapStaffRow(row: any): StaffProfile {
  let skills: string[] = [];
  try {
    if (row.SKILLS) {
      skills = typeof row.SKILLS === "string" ? JSON.parse(row.SKILLS) : (Array.isArray(row.SKILLS) ? row.SKILLS : []);
    }
  } catch {
    skills = [];
  }

  return {
    id: row.STAFF_ID || row.staff_id,
    agencyId: row.AGENCY_ID || row.agency_id,
    fullName: row.FULL_NAME || row.full_name || "Care Professional",
    role: (row.ROLE || row.role || "Caregiver") as any,
    skills,
    experienceYears: Number(row.EXPERIENCE_YEARS || row.experience_years || 2),
    rating: Number(row.RATING || row.rating || 5.0),
    status: (row.STATUS || row.status || "active") as any,
  };
}

export const StaffRepository = {
  async getAll(): Promise<StaffProfile[]> {
    const sql = `
      SELECT 
        s.STAFF_ID, s.AGENCY_ID, s.SKILLS, s.EXPERIENCE_YEARS, s.RATING, s.STATUS,
        u.EMAIL, u.FULL_NAME, u.PHONE_NUMBER, u.ROLE, a.NAME as AGENCY_NAME
      FROM CORE.STAFF_PROFILES s
      JOIN CORE.USERS u ON s.STAFF_ID = u.USER_ID
      LEFT JOIN CORE.AGENCIES a ON s.AGENCY_ID = a.AGENCY_ID;
    `;
    const rows = await executeQuery<any>(sql);
    return rows.map(mapStaffRow);
  },

  async findById(id: string): Promise<StaffProfile | undefined> {
    const sql = `
      SELECT 
        s.STAFF_ID, s.AGENCY_ID, s.SKILLS, s.EXPERIENCE_YEARS, s.RATING, s.STATUS,
        u.EMAIL, u.FULL_NAME, u.PHONE_NUMBER, u.ROLE, a.NAME as AGENCY_NAME
      FROM CORE.STAFF_PROFILES s
      JOIN CORE.USERS u ON s.STAFF_ID = u.USER_ID
      LEFT JOIN CORE.AGENCIES a ON s.AGENCY_ID = a.AGENCY_ID
      WHERE s.STAFF_ID = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapStaffRow(rows[0]) : undefined;
  },

  async findByAgency(agencyId: string): Promise<StaffProfile[]> {
    const sql = `
      SELECT 
        s.STAFF_ID, s.AGENCY_ID, s.SKILLS, s.EXPERIENCE_YEARS, s.RATING, s.STATUS,
        u.EMAIL, u.FULL_NAME, u.PHONE_NUMBER, u.ROLE, a.NAME as AGENCY_NAME
      FROM CORE.STAFF_PROFILES s
      JOIN CORE.USERS u ON s.STAFF_ID = u.USER_ID
      LEFT JOIN CORE.AGENCIES a ON s.AGENCY_ID = a.AGENCY_ID
      WHERE s.AGENCY_ID = ?;
    `;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map(mapStaffRow);
  }
};
