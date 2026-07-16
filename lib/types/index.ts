/**
 * HomeCare Marketplace Shared Types
 * Expanded Feature-based, multi-tenant enterprise health platform definitions.
 */

export enum UserRole {
  PATIENT = "Patient",
  FAMILY_MEMBER = "Family Member",
  AGENCY_OWNER = "Agency Owner",
  AGENCY_ADMIN = "Agency Admin",
  NURSE = "Nurse",
  CAREGIVER = "Caregiver",
  PHYSIOTHERAPIST = "Physiotherapist",
  DOCTOR = "Doctor",
  PLATFORM_ADMIN = "Platform Admin"
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

export interface PatientProfile {
  userId: string;
  medicalHistory: string;
  allergies: string[];
  bloodGroup: string;
  emergencyContacts: EmergencyContact[];
  savedAddresses: SavedAddress[];
  familyMembers: FamilyMember[];
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface SavedAddress {
  id: string;
  label: string; // Home, Work, Parent's House
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  age: number;
}

export interface Agency {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  registrationNumber: string;
  gstNumber?: string;
  panNumber?: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  status: "pending" | "approved" | "suspended" | "rejected";
  documents: VerificationDocument[];
  bankDetails?: BankDetails;
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  type: "license" | "gst" | "pan" | "aadhaar" | "police_clearance" | "nursing_reg" | "degree_cert" | "address_proof" | "owner_kyc";
  fileUrl: string;
  fileName?: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  uploadedAt: string;
}

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export enum ServiceCategory {
  NURSING = "Nursing",
  CAREGIVER = "Caregiver",
  PHYSIOTHERAPY = "Physiotherapy",
  DOCTOR = "Doctors",
  MOTHER_BABY = "Mother & Baby"
}

export interface ServiceDefinition {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  basePrice: number; // in INR
  billingUnit: "hour" | "visit" | "day";
}

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "rescheduled"
  | "booking_created"
  | "payment_pending"
  | "agency_accepted"
  | "assign_staff"
  | "staff_accepted"
  | "travel_started"
  | "arrived"
  | "check_in"
  | "vitals"
  | "care"
  | "patient_signature"
  | "check_out"
  | "invoice"
  | "payment"
  | "review";

export interface Booking {
  id: string;
  agencyId: string;
  agencyName: string;
  patientId: string;
  patientName: string;
  familyMemberId?: string; // If booked for family member
  serviceCategory: ServiceCategory;
  serviceName: string;
  status: BookingStatus;
  date: string;
  timeSlot: string;
  durationHours: number;
  frequency: "one-time" | "weekly" | "monthly";
  address: SavedAddress;
  amount: number;
  paymentStatus: "unpaid" | "paid" | "refunded";
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  assignedStaffAvatar?: string;
  liveLocation?: { lat: number; lng: number; lastUpdated: string };
  etaMinutes?: number;
  vitals?: VitalsLog;
  visitNotes?: string;
  selfieVerified?: boolean;
  patientSignatureUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VitalsLog {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  spO2: number;
  loggedAt: string;
}

export interface StaffProfile {
  id: string; // Matches User ID
  agencyId: string;
  fullName: string;
  role: UserRole; // Nurse, Caregiver, etc.
  skills: string[];
  experienceYears: number;
  rating: number;
  status: "active" | "inactive" | "on-visit";
  latitude?: number;
  longitude?: number;
  selfieUrl?: string;
  livenessVerified?: boolean;
}

export interface InventoryItem {
  id: string;
  agencyId: string;
  name: string;
  category: "consumable" | "supply" | "equipment";
  quantity: number;
  minThreshold: number;
  unit: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  agencyId: string;
  diagnosis: string;
  goals: string[];
  frequency: string;
  prescriptions: string[];
  riskAssessment: "low" | "medium" | "high";
  riskDetails?: string;
  createdBy: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  patientName: string;
  agencyName: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  createdAt: string;
}

export interface SnowflakeConfig {
  account?: string;
  username?: string;
  warehouse?: string;
  database?: string;
  schema?: string;
  isConnected: boolean;
  queryLog: { query: string; timestamp: string; durationMs: number; status: "success" | "error" }[];
}

export interface AuditLog {
  log_id: number;
  actor_id: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}
