export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePhoto: string;
}

export interface PatientProfile {
  patient: Patient;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: PatientAddress;
}

export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalRecordSummary {
  recordCount: number;
  lastUpdated: string;
}
