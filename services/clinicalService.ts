import { ClinicalRepository } from "../repositories/clinicalRepository";

export const ClinicalService = {
  async getTimelineSummary(patientId: string) {
    const events = await ClinicalRepository.getMedicalTimeline(patientId);
    return {
      totalEvents: events.length,
      vitalsCount: events.filter(e => e.category === "vitals").length,
      activitiesCount: events.filter(e => e.category === "care_activity").length,
      events
    };
  },

  async createNewCarePlan(plan: any) {
    // Business logic checking
    if (!plan.patientId || !plan.diagnosis) {
      throw new Error("Patient ID and Diagnosis are required for Care Plan.");
    }
    return ClinicalRepository.createCarePlan(plan);
  }
};
