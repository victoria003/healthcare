import { executeQuery } from "../lib/database/executeQuery";

export interface PatientDomain {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string;
}

export interface PatientProfileDomain {
  patient: PatientDomain;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  medicalHistory?: string;
  allergies: string[];
}

function mapPatientProfile(row: any): PatientProfileDomain {
  const fullName = row.FULL_NAME || "Demo Patient";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  let allergies: string[] = [];
  try {
    if (row.ALLERGIES) {
      allergies = typeof row.ALLERGIES === "string" ? JSON.parse(row.ALLERGIES) : (Array.isArray(row.ALLERGIES) ? row.ALLERGIES : []);
    }
  } catch {
    allergies = [];
  }

  return {
    patient: {
      id: row.PATIENT_ID || row.patient_id,
      firstName,
      lastName,
      email: row.EMAIL || row.email || "",
      phone: row.PHONE_NUMBER || row.phone_number || row.phone || "",
      profilePhoto: row.AVATAR_URL || row.avatar_url || "",
    },
    dateOfBirth: "1990-01-01",
    gender: "Male",
    bloodGroup: row.BLOOD_GROUP || row.blood_group || "O+",
    address: {
      street: "123 Care Street",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "India",
    },
    medicalHistory: row.MEDICAL_HISTORY || row.medical_history || "",
    allergies,
  };
}

export const PatientRepository = {
  async getAll(): Promise<PatientDomain[]> {
    const sql = `
      SELECT 
        p.PATIENT_ID,
        u.EMAIL,
        u.FULL_NAME,
        u.PHONE_NUMBER,
        u.AVATAR_URL
      FROM CORE.PATIENT_PROFILES p
      JOIN CORE.USERS u ON p.PATIENT_ID = u.USER_ID;
    `;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => {
      const fullName = row.FULL_NAME || row.full_name || "Demo Patient";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      return {
        id: row.PATIENT_ID || row.patient_id,
        firstName,
        lastName,
        email: row.EMAIL || row.email || "",
        phone: row.PHONE_NUMBER || row.phone_number || row.phone || "",
        profilePhoto: row.AVATAR_URL || row.avatar_url || "",
      };
    });
  },

  async getPatient(id: string): Promise<PatientDomain | undefined> {
    const profile = await this.getProfile(id);
    return profile?.patient;
  },

  async getProfile(id: string): Promise<PatientProfileDomain | undefined> {
    const sql = `
      SELECT 
        p.PATIENT_ID,
        p.MEDICAL_HISTORY,
        p.ALLERGIES,
        p.BLOOD_GROUP,
        u.EMAIL,
        u.FULL_NAME,
        u.PHONE_NUMBER,
        u.AVATAR_URL
      FROM CORE.PATIENT_PROFILES p
      JOIN CORE.USERS u ON p.PATIENT_ID = u.USER_ID
      WHERE p.PATIENT_ID = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapPatientProfile(rows[0]) : undefined;
  },

  async create(patient: {
    patientId: string;
    medicalHistory?: string;
    allergies?: string[];
    bloodGroup?: string;
  }): Promise<PatientProfileDomain> {
    const medicalHistory = patient.medicalHistory || "";
    const allergiesString = JSON.stringify(patient.allergies || []);
    const bloodGroup = patient.bloodGroup || "";

    const sql = `
      INSERT INTO CORE.PATIENT_PROFILES (PATIENT_ID, MEDICAL_HISTORY, ALLERGIES, BLOOD_GROUP, CREATED_AT, UPDATED_AT)
      VALUES (?, ?, PARSE_JSON(?), ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
    `;

    await executeQuery(sql, [
      patient.patientId,
      medicalHistory,
      allergiesString,
      bloodGroup,
    ]);

    const created = await this.getProfile(patient.patientId);
    if (!created) throw new Error("Failed to retrieve created patient profile.");
    return created;
  },
};
