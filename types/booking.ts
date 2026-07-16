export enum BookingStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export interface Booking {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  time: string;
  status: BookingStatus;
  
  // Rich details populated from database mappings
  serviceName?: string;
  serviceCategory?: string;
  amount?: number;
  timeSlot?: string;
  patientName?: string;
  assignedStaffId?: string;
  address?: {
    id?: string;
    label?: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface BookingSummary {
  upcoming: number;
  completed: number;
  cancelled: number;
}
