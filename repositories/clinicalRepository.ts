import { executeQuery } from "../lib/database/executeQuery";
import { CarePlan } from "../lib/types";

function mapCarePlanRow(row: any): CarePlan {
  let goals: string[] = [];
  let prescriptions: string[] = [];
  try {
    if (row.GOALS) {
      goals = typeof row.GOALS === "string" ? JSON.parse(row.GOALS) : (Array.isArray(row.GOALS) ? row.GOALS : []);
    }
  } catch {
    goals = [];
  }
  try {
    if (row.PRESCRIPTIONS) {
      prescriptions = typeof row.PRESCRIPTIONS === "string" ? JSON.parse(row.PRESCRIPTIONS) : (Array.isArray(row.PRESCRIPTIONS) ? row.PRESCRIPTIONS : []);
    }
  } catch {
    prescriptions = [];
  }

  return {
    id: row.ID || row.id,
    patientId: row.PATIENT_ID || row.patient_id,
    patientName: row.PATIENT_NAME || row.patient_name || "Demo Patient",
    agencyId: row.AGENCY_ID || row.agency_id,
    diagnosis: row.DIAGNOSIS || row.diagnosis || "",
    goals,
    frequency: row.FREQUENCY || row.frequency || "",
    prescriptions,
    riskAssessment: (row.RISK_ASSESSMENT || row.risk_assessment || "low") as any,
    riskDetails: row.RISK_DETAILS || row.risk_details || "",
    createdBy: row.CREATED_BY || row.created_by || "Clinical Admin",
    createdAt: row.CREATED_AT || row.created_at,
  };
}

export const ClinicalRepository = {
  async getCarePlansByPatient(patientId: string): Promise<CarePlan[]> {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.CARE_PLANS (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        agency_id VARCHAR(50),
        diagnosis TEXT,
        goals ARRAY,
        frequency VARCHAR(100),
        prescriptions ARRAY,
        risk_assessment VARCHAR(20),
        risk_details TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `
      SELECT cp.*, u.full_name AS patient_name
      FROM CORE.CARE_PLANS cp
      LEFT JOIN CORE.USERS u ON cp.patient_id = u.user_id
      WHERE cp.patient_id = ?;
    `;
    const rows = await executeQuery<any>(sql, [patientId]);
    return rows.map(mapCarePlanRow);
  },

  async getCarePlanById(id: string): Promise<CarePlan | undefined> {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.CARE_PLANS (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        agency_id VARCHAR(50),
        diagnosis TEXT,
        goals ARRAY,
        frequency VARCHAR(100),
        prescriptions ARRAY,
        risk_assessment VARCHAR(20),
        risk_details TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `
      SELECT cp.*, u.full_name AS patient_name
      FROM CORE.CARE_PLANS cp
      LEFT JOIN CORE.USERS u ON cp.patient_id = u.user_id
      WHERE cp.id = ?;
    `;
    const rows = await executeQuery<any>(sql, [id]);
    return rows[0] ? mapCarePlanRow(rows[0]) : undefined;
  },

  async createCarePlan(carePlan: Omit<CarePlan, "id" | "createdAt">): Promise<CarePlan> {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.CARE_PLANS (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        agency_id VARCHAR(50),
        diagnosis TEXT,
        goals ARRAY,
        frequency VARCHAR(100),
        prescriptions ARRAY,
        risk_assessment VARCHAR(20),
        risk_details TEXT,
        created_by VARCHAR(100),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `cp-${Date.now()}`;
    const goalsJson = JSON.stringify(carePlan.goals || []);
    const rxJson = JSON.stringify(carePlan.prescriptions || []);

    const sql = `
      INSERT INTO CORE.CARE_PLANS (id, patient_id, agency_id, diagnosis, goals, frequency, prescriptions, risk_assessment, risk_details, created_by)
      VALUES (?, ?, ?, ?, PARSE_JSON(?), ?, PARSE_JSON(?), ?, ?, ?);
    `;
    await executeQuery(sql, [
      id,
      carePlan.patientId,
      carePlan.agencyId,
      carePlan.diagnosis,
      goalsJson,
      carePlan.frequency,
      rxJson,
      carePlan.riskAssessment,
      carePlan.riskDetails || "",
      carePlan.createdBy,
    ]);

    const created = await this.getCarePlanById(id);
    if (!created) throw new Error("Failed to retrieve created care plan.");
    return created;
  },

  async getMedicalTimeline(patientId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.MEDICAL_TIMELINE (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        title VARCHAR(200),
        description TEXT,
        category VARCHAR(20),
        timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.MEDICAL_TIMELINE WHERE patient_id = ? ORDER BY timestamp DESC;`;
    const rows = await executeQuery<any>(sql, [patientId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      patientId: row.PATIENT_ID || row.patient_id,
      title: row.TITLE || row.title,
      description: row.DESCRIPTION || row.description,
      category: row.CATEGORY || row.category,
      timestamp: row.TIMESTAMP || row.timestamp,
    }));
  },

  async addTimelineEvent(event: { patientId: string; title: string; description: string; category: "vitals" | "diagnosis" | "care_activity" | "prescription" }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.MEDICAL_TIMELINE (
        id VARCHAR(50) PRIMARY KEY,
        patient_id VARCHAR(50),
        title VARCHAR(200),
        description TEXT,
        category VARCHAR(20),
        timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `mte-${Date.now()}`;
    const sql = `
      INSERT INTO CORE.MEDICAL_TIMELINE (id, patient_id, title, description, category)
      VALUES (?, ?, ?, ?, ?);
    `;
    await executeQuery(sql, [id, event.patientId, event.title, event.description, event.category]);
    return { id, ...event, timestamp: new Date().toISOString() };
  },

  async getVisitTemplates(agencyId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.VISIT_TEMPLATES (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        name VARCHAR(150),
        description TEXT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.VISIT_TEMPLATES WHERE agency_id = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      agencyId: row.AGENCY_ID || row.agency_id,
      name: row.NAME || row.name,
      description: row.DESCRIPTION || row.description,
    }));
  }
};
