import { User, UserRole, Agency, Booking, StaffProfile, InventoryItem, CarePlan, Invoice, SavedAddress, ServiceCategory, AuditLog } from "../types";

// Dynamic interfaces for new features
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: "billing" | "clinical" | "scheduling" | "general";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: "pending" | "joined" | "rewarded";
  rewardAmount: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  agencyId: string;
  plan: "basic" | "premium" | "enterprise";
  amount: number;
  status: "active" | "canceled" | "past_due";
  nextBillingDate: string;
}

export interface FranchiseNode {
  id: string;
  name: string;
  region: string;
  manager: string;
  agenciesCount: number;
}

export interface CorporateAccount {
  id: string;
  companyName: string;
  contactEmail: string;
  employeeCount: number;
  subsidyPercentage: number;
}

export interface ConsentForm {
  id: string;
  bookingId: string;
  patientId: string;
  signedBy: string;
  signedAt: string;
  ipAddress: string;
}

export interface MedicalTimelineEvent {
  id: string;
  patientId: string;
  title: string;
  description: string;
  category: "vitals" | "diagnosis" | "care_activity" | "prescription";
  timestamp: string;
}

export interface VisitTemplate {
  id: string;
  agencyId: string;
  name: string;
  steps: string[];
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  agencyId: string;
  baseSalary: number;
  allowance: number;
  deductions: number;
  netPay: number;
  month: string;
  status: "paid" | "processing";
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  agencyId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "absent" | "late";
}

export interface LeaveRecord {
  id: string;
  staffId: string;
  date: string;
  type: "sick" | "casual" | "annual";
  status: "pending" | "approved" | "rejected";
}

export interface TrainingCertification {
  id: string;
  staffId: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  complainantId: string;
  description: string;
  escalationLevel: 1 | 2 | 3;
  status: "unresolved" | "investigating" | "resolved";
}

export interface APIKey {
  id: string;
  agencyId: string;
  keyName: string;
  maskedKey: string;
  rawKey: string;
  status: "active" | "inactive";
}

export interface WebhookConfig {
  id: string;
  agencyId: string;
  url: string;
  events: string[];
}

export interface SystemSettings {
  autoAssignStaff: boolean;
  commissionRate: number;
  enableSMSNotifications: boolean;
  maintenanceMode: boolean;
}

export interface FeatureFlags {
  enableAiDiagnosis: boolean;
  enableFastPayouts: boolean;
  enableMultiTenantBranding: boolean;
}

// Global state holding reference to persist data in dev mode
const globalAny: any = global;

const DEFAULT_PASSWORD_HASH = "$2a$10$T8VqU8N99T7NqL8u/zG5t.E3MvI92Z6pS9wA6yWz01nC5F1pUeXKy"; // password123

export function getDbState() {
  if (!globalAny.DB_STATE) {
    globalAny.DB_STATE = {
      users: [
        {
          id: "u-1",
          email: "victoriarani.ankala@gmail.com",
          fullName: "Ankala Victoria Rani",
          role: UserRole.PATIENT,
          phone: "+91 9490123456",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
          status: "active",
          passwordHash: DEFAULT_PASSWORD_HASH,
          createdAt: new Date().toISOString()
        },
        {
          id: "u-2",
          email: "hyderabad.care@homecare.in",
          fullName: "Sri Krishna",
          role: UserRole.AGENCY_ADMIN,
          phone: "+91 8008123456",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          status: "active",
          passwordHash: DEFAULT_PASSWORD_HASH,
          createdAt: new Date().toISOString()
        },
        {
          id: "u-3",
          email: "priya.nurse@homecare.in",
          fullName: "Priya Sharma, RN",
          role: UserRole.NURSE,
          phone: "+91 9848012345",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          status: "active",
          passwordHash: DEFAULT_PASSWORD_HASH,
          createdAt: new Date().toISOString()
        },
        {
          id: "u-4",
          email: "ramesh.care@homecare.in",
          fullName: "Ramesh Rao",
          role: UserRole.CAREGIVER,
          phone: "+91 9123456780",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
          status: "active",
          passwordHash: DEFAULT_PASSWORD_HASH,
          createdAt: new Date().toISOString()
        },
        {
          id: "u-5",
          email: "admin@homecare.in",
          fullName: "Admin Master",
          role: UserRole.PLATFORM_ADMIN,
          phone: "+91 9999999999",
          avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
          status: "active",
          passwordHash: DEFAULT_PASSWORD_HASH,
          createdAt: new Date().toISOString()
        }
      ],
      agencies: [
        {
          id: "agency-1",
          name: "Nisarga Home Healthcare Services",
          description: "Premier ICU setup at home, geriatric specialist care, and post-operative nursing based in Hyderabad.",
          registrationNumber: "HYD-MCH-2023-4412",
          gstNumber: "36AAAAN4512Q1ZX",
          panNumber: "AAANP4512Q",
          ownerName: "Sri Krishna",
          phone: "+91 8008123456",
          email: "hyderabad.care@homecare.in",
          city: "Hyderabad",
          state: "Telangana",
          pincode: "500081",
          rating: 4.8,
          reviewCount: 42,
          verified: true,
          status: "approved",
          documents: [
            { id: "doc-1", type: "license", fileUrl: "https://example.com/lic.pdf", status: "approved", uploadedAt: new Date().toISOString() },
            { id: "doc-2", type: "gst", fileUrl: "https://example.com/gst.pdf", status: "approved", uploadedAt: new Date().toISOString() }
          ],
          bankDetails: {
            accountHolder: "Nisarga Home Healthcare",
            accountNumber: "50200045612398",
            ifscCode: "HDFC0000081",
            bankName: "HDFC Bank, Madhapur"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "agency-2",
          name: "AP Amma Care Center",
          description: "Compassionate elder support, dementia companion care, and physiotherapy sessions across Vijayawada.",
          registrationNumber: "VJA-MCH-2022-7718",
          gstNumber: "37BBBBM9981K2ZY",
          panNumber: "BBBBM9981K",
          ownerName: "Venkata Ramana",
          phone: "+91 8661234567",
          email: "vijayawada.care@amma.in",
          city: "Vijayawada",
          state: "Andhra Pradesh",
          pincode: "520002",
          rating: 4.5,
          reviewCount: 19,
          verified: false,
          status: "pending",
          documents: [
            { id: "doc-3", type: "license", fileUrl: "https://example.com/vja_lic.pdf", status: "pending", uploadedAt: new Date().toISOString() }
          ],
          bankDetails: {
            accountHolder: "AP Amma Care LLC",
            accountNumber: "100912445582",
            ifscCode: "SBIN0001202",
            bankName: "State Bank of India, Labbipet"
          },
          createdAt: new Date().toISOString()
        }
      ],
      staff: [
        {
          id: "u-3",
          agencyId: "agency-1",
          fullName: "Priya Sharma, RN",
          role: UserRole.NURSE,
          skills: ["ICU Care", "Tracheostomy", "IV Cannulation", "Wound Dressing", "Catheterization"],
          experienceYears: 6,
          rating: 4.9,
          status: "active",
          latitude: 17.4483,
          longitude: 78.3741,
          selfieUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          livenessVerified: true
        },
        {
          id: "u-4",
          agencyId: "agency-1",
          fullName: "Ramesh Rao",
          role: UserRole.CAREGIVER,
          skills: ["Elderly Assistance", "Dementia Care", "Alzheimer's Companion", "Bedridden Transfers"],
          experienceYears: 4,
          rating: 4.7,
          status: "active",
          latitude: 17.4375,
          longitude: 78.3815,
          selfieUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
          livenessVerified: true
        }
      ],
      bookings: [
        {
          id: "book-1",
          agencyId: "agency-1",
          agencyName: "Nisarga Home Healthcare Services",
          patientId: "u-1",
          patientName: "Ankala Victoria Rani",
          serviceCategory: ServiceCategory.NURSING,
          serviceName: "ICU Nurse (Tracheostomy & Ventilation Care)",
          status: "accepted",
          date: new Date().toISOString().split("T")[0],
          timeSlot: "08:00 AM - 08:00 PM",
          durationHours: 12,
          frequency: "one-time",
          address: {
            id: "addr-1",
            label: "Home",
            addressLine: "Flat 402, Gachibowli Heights, Near DLF Cybercity",
            city: "Hyderabad",
            state: "Telangana",
            pincode: "500032",
            lat: 17.4442,
            lng: 78.3562
          },
          amount: 4500,
          paymentStatus: "paid",
          assignedStaffId: "u-3",
          assignedStaffName: "Priya Sharma, RN",
          assignedStaffPhone: "+91 9848012345",
          assignedStaffAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          liveLocation: { lat: 17.4452, lng: 78.3610, lastUpdated: new Date().toISOString() },
          etaMinutes: 12,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ],
      invoices: [
        {
          id: "INV-1002",
          bookingId: "book-1",
          patientName: "Ankala Victoria Rani",
          agencyName: "Nisarga Home Healthcare Services",
          amount: 4500,
          tax: 810,
          discount: 200,
          total: 5110,
          status: "paid",
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
          createdAt: new Date().toISOString()
        }
      ],
      inventory: [
        { id: "inv-1", agencyId: "agency-1", name: "Disposable Nitrile Gloves", category: "consumable", quantity: 240, minThreshold: 50, unit: "Boxes" },
        { id: "inv-2", agencyId: "agency-1", name: "Sterile Wound Dressing Packs", category: "supply", quantity: 8, minThreshold: 10, unit: "Packs" },
        { id: "inv-3", agencyId: "agency-1", name: "Portable Oxygen Concentrator", category: "equipment", quantity: 2, minThreshold: 1, unit: "Units" }
      ],
      carePlans: [
        {
          id: "cp-1",
          patientId: "u-1",
          patientName: "Ankala Victoria Rani",
          agencyId: "agency-1",
          diagnosis: "Post-Stroke Recovery with Tracheostomy decannulation protocol",
          goals: ["Maintain clear airway & proper suctioning", "Administer subcutaneous blood thinners daily", "Enable 50m assisted walking twice a day"],
          frequency: "Daily Nurse visit (12-hour support)",
          prescriptions: ["Aspirin 75mg post lunch", "Pantoprazole 40mg pre breakfast"],
          riskAssessment: "medium",
          riskDetails: "Slight fall risk during gait assistance. Tracheostomy requires continuous monitoring for mucous plugging.",
          createdBy: "Sri Krishna (Clinical Admin)",
          createdAt: new Date().toISOString()
        }
      ],
      auditLogs: [
        { log_id: 1, actor_id: "u-1", action: "User Login", details: "Logged in via Mobile OTP verification", ip_address: "192.168.1.100", created_at: new Date().toISOString() }
      ],
      snowflakeConfig: {
        isConnected: false,
        account: "xy98124.asia-east1.gcp",
        username: "HEALTHCARE_ADMIN",
        queryLog: []
      },
      // Expanded features lists
      supportTickets: [
        { id: "t-1", userId: "u-1", subject: "Invoice billing discrepancy", message: "My HDFC bank account statement shows duplicate billing on INR 5,110 payment routing.", category: "billing", status: "open", createdAt: new Date().toISOString() }
      ],
      referrals: [
        { id: "ref-1", referrerId: "u-1", referredEmail: "amrita.nair@gmail.com", status: "pending", rewardAmount: 500, createdAt: new Date().toISOString() }
      ],
      subscriptions: [
        { id: "sub-1", agencyId: "agency-1", plan: "enterprise", amount: 12000, status: "active", nextBillingDate: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0] }
      ],
      franchiseNodes: [
        { id: "fn-1", name: "Telangana South Grid", region: "South India", manager: "Venkata Ramanujam", agenciesCount: 4 }
      ],
      corporateAccounts: [
        { id: "corp-1", companyName: "Tech Mahindra Healthcare Benefits", contactEmail: "benefits@techmahindra.com", employeeCount: 1200, subsidyPercentage: 35 }
      ],
      consentForms: [
        { id: "cf-1", bookingId: "book-1", patientId: "u-1", signedBy: "Ankala Victoria Rani", signedAt: new Date().toISOString(), ipAddress: "157.44.112.98" }
      ],
      medicalTimelineEvents: [
        { id: "mte-1", patientId: "u-1", title: "Tracheostomy Tube Check", description: "Vitals stable, tracheal suction performed with zero mucus plugging.", category: "care_activity", timestamp: new Date().toISOString() }
      ],
      visitTemplates: [
        { id: "vt-1", agencyId: "agency-1", name: "Standard 12h Nursing Protocol", steps: ["Double Hand Sanitize", "Measure ECG/Blood Pressure", "Tube cleaning & suction", "Wound dressing replacement", "Medication feed", "Check out signature"] }
      ],
      payrollRecords: [
        { id: "pay-1", staffId: "u-3", agencyId: "agency-1", baseSalary: 38000, allowance: 4200, deductions: 1500, netPay: 40700, month: "July 2026", status: "paid" }
      ],
      attendanceRecords: [
        { id: "att-1", staffId: "u-3", agencyId: "agency-1", date: new Date().toISOString().split("T")[0], checkIn: "07:55 AM", checkOut: "08:12 PM", status: "present" }
      ],
      leaveRecords: [
        { id: "lv-1", staffId: "u-3", date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], type: "annual", status: "approved" }
      ],
      trainingCertifications: [
        { id: "cert-1", staffId: "u-3", title: "Advance Cardiovascular Life Support (ACLS)", issuer: "American Heart Association / Apollo Hospitals", issueDate: "2025-01-10", expiryDate: "2027-01-10" }
      ],
      complaints: [
        { id: "comp-1", bookingId: "book-1", complainantId: "u-1", description: "Caregiver arrived 15 minutes late due to traffic congestion near DLF cybercity", escalationLevel: 1, status: "resolved" }
      ],
      apiKeys: [
        { id: "key-1", agencyId: "agency-1", keyName: "Production Webhooks Client", maskedKey: "hc_prod_live_******a9b8", rawKey: "hc_prod_live_sec_token_98124u_a9b8", status: "active" }
      ],
      webhooks: [
        { id: "web-1", agencyId: "agency-1", url: "https://nisarga.care/api/v2/homecare-callback", events: ["booking.created", "visit.vitals_logged"] }
      ],
      systemSettings: {
        autoAssignStaff: false,
        commissionRate: 0.12,
        enableSMSNotifications: true,
        maintenanceMode: false
      },
      featureFlags: {
        enableAiDiagnosis: true,
        enableFastPayouts: true,
        enableMultiTenantBranding: true
      },
      notifications: [] as any[]
    };
  }
  return globalAny.DB_STATE;
}
