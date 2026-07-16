import { Patient, PatientProfile } from "@/types/patient";

export class PatientService {
  async getPatient(): Promise<any> {
    const res = await fetch("/api/patients");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to fetch patients");
    return (data.patients || []).map((p: any) => ({
      id: p.id,
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      email: p.email || "",
      phone: p.phone || "",
      profilePhoto: p.profilePhoto || "",
    }));
  }

  async getProfile(): Promise<PatientProfile> {
    const meRes = await fetch("/api/auth/me");
    const meData = await meRes.json();
    if (!meData.success) throw new Error(meData.error || "Failed to get current user");
    
    const userId = meData.user.id;
    
    const res = await fetch(`/api/patients/${userId}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to fetch patient profile");
    
    return this.mapToPatientProfile(data.profile);
  }

  private mapToPatientProfile(p: any): PatientProfile {
    return {
      patient: {
        id: p.patient?.id || p.id || "",
        firstName: p.patient?.firstName || p.firstName || "",
        lastName: p.patient?.lastName || p.lastName || "",
        email: p.patient?.email || p.email || "",
        phone: p.patient?.phone || p.phone || "",
        profilePhoto: p.patient?.profilePhoto || p.profilePhoto || "",
      },
      dateOfBirth: p.dateOfBirth || "1990-01-01",
      gender: p.gender || "Male",
      bloodGroup: p.bloodGroup || "O+",
      address: {
        street: p.address?.street || "123 Care Street",
        city: p.address?.city || "Hyderabad",
        state: p.address?.state || "Telangana",
        postalCode: p.address?.postalCode || p.address?.pincode || "500081",
        country: p.address?.country || "India",
      }
    };
  }
}

export const patientService = new PatientService();
