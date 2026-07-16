export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  revoked: boolean;
  createdAt: string;
}

export interface Role {
  id: string;
  name: "PATIENT" | "PROFESSIONAL" | "AGENCY" | "ADMIN" | "SUPER_ADMIN";
  description: string;
}

export interface Permission {
  id: string;
  name:
    | "Dashboard"
    | "Bookings"
    | "Patients"
    | "Professionals"
    | "Agencies"
    | "Reports"
    | "Settings"
    | "Documents"
    | "Notifications"
    | "Payments"
    | "Profile"
    | "Users";
  description: string;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  role?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: "patient" | "professional" | "agency" | "admin" | "super_admin";
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}
