import { Patient, PatientProfile } from "@/types/patient";

export class PatientRepository {
  private mockPatient: Patient = {
    id: "patient-1",
    firstName: "Demo",
    lastName: "Patient",
    email: "patient@homecare.in",
    phone: "+91 98765 43210",
    profilePhoto: "",
  };

  private mockProfile: PatientProfile = {
    patient: this.mockPatient,
    dateOfBirth: "1990-01-01",
    gender: "Male",
    bloodGroup: "O+",
    address: {
      street: "123 Care Street",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "India",
    },
  };

  async getPatient(): Promise<Patient> {
    return this.mockPatient;
  }

  async getProfile(): Promise<PatientProfile> {
    return this.mockProfile;
  }
}

export const patientRepository = new PatientRepository();
