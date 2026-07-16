export interface Provider {
  id: string;
  fullName: string;
  photo: string;
  category: string;
  experience: string;
  rating: number;
  organizationId: string;
  verified: boolean;
}

export interface ProfessionalSpecialization {
  id: string;
  name: string;
}

export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}
