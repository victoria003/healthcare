import { AuthRepository } from "../repositories/auth.repository";
import { PasswordLib } from "../lib/auth/password";
import { JWTLib } from "../lib/auth/jwt";
import { CookiesLib } from "../lib/auth/cookies";
import { SessionLib } from "../lib/auth/session";
import { RolesLib } from "../lib/auth/roles";
import { PermissionsLib } from "../lib/auth/permissions";
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, JWTPayload, User } from "../types/auth";
import { isSnowflakeConfigured, executeQuery } from "../lib/database/executeQuery";

export const AuthService = {
  async register(req: RegisterRequest): Promise<RegisterResponse> {
    const { firstName, lastName, email, phone, password, role } = req;

    if (!email || !firstName || !lastName || !phone || !password || !role) {
      return { success: false, error: "All registration fields are required." };
    }

    const mappedRole = role.toUpperCase();
    if (!RolesLib.isValidRole(mappedRole)) {
      return { success: false, error: `Invalid role: ${role}` };
    }

    // Check password strength: min 8 characters, at least 1 letter and 1 number
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { success: false, error: "Password must be at least 8 characters and contain both letters and numbers." };
    }

    // Check email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: "Invalid email address format." };
    }

    // Check phone format
    if (!/^\+?[0-9\s-]{10,20}$/.test(phone)) {
      return { success: false, error: "Invalid phone number format." };
    }

    // Check if user already exists
    const existing = await AuthRepository.findUserByEmail(email);
    if (existing) {
      return { success: false, error: "A user with this email already exists." };
    }

    const userId = `u-${Date.now()}`;
    const passwordHash = PasswordLib.hash(password);

    // Create central user
    const newUser = await AuthRepository.createUser({
      id: userId,
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      role: mappedRole,
      status: "active",
    });

    // Create linked profiles depending on the role
    if (mappedRole === "PATIENT") {
      const insertProfileSql = `
        INSERT INTO CORE.PATIENT_PROFILES (patient_id, created_at, updated_at) 
        VALUES (?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
      `;
      await executeQuery(insertProfileSql, [userId]);
    } else if (mappedRole === "PROFESSIONAL") {
      const insertProfileSql = `
        INSERT INTO CORE.STAFF_PROFILES (staff_id, agency_id, experience_years, rating, status, created_at, updated_at) 
        VALUES (?, 'agency-1', 2, 5.0, 'active', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
      `;
      await executeQuery(insertProfileSql, [userId]);
    } else if (mappedRole === "AGENCY") {
      const agencyId = `agency-${Date.now()}`;
      const regNumber = `REG-${Date.now()}`;
      const insertProfileSql = `
        INSERT INTO CORE.AGENCIES (agency_id, name, registration_number, owner_name, phone, email, city, state, pincode, verified, status, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, 'Hyderabad', 'Telangana', '500081', FALSE, 'pending', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
      `;
      await executeQuery(insertProfileSql, [agencyId, `${firstName} ${lastName} Homecare`, regNumber, `${firstName} ${lastName}`, phone, email]);
    }

    // Sign Access & Refresh Tokens
    const payload: JWTPayload = {
      id: userId,
      email,
      role: mappedRole,
      fullName: `${firstName} ${lastName}`,
    };

    const accessToken = await JWTLib.signAccessToken(payload);
    const refreshToken = await JWTLib.signRefreshToken(payload);

    // Save user session in database / memory
    await SessionLib.createSession(userId, accessToken, refreshToken);

    // Set Cookies
    await CookiesLib.setAuthCookies(accessToken, refreshToken);

    return {
      success: true,
      user: newUser,
      token: accessToken,
      refreshToken,
    };
  },

  async login(req: LoginRequest, ipAddress: string = "127.0.0.1", userAgent: string = "Mozilla/5.0"): Promise<LoginResponse> {
    const { email, password, role } = req;

    if (!email || !password) {
      await AuthRepository.logLoginHistory({
        userId: null,
        ipAddress,
        userAgent,
        status: "failed",
        failureReason: "Missing credentials",
      });
      return { success: false, error: "Email and password are required." };
    }

    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      await AuthRepository.logLoginHistory({
        userId: null,
        ipAddress,
        userAgent,
        status: "failed",
        failureReason: "User not found",
      });
      return { success: false, error: "Invalid email or password." };
    }

    const isMatch = PasswordLib.compare(password, user.passwordHash);
    if (!isMatch) {
      await AuthRepository.logLoginHistory({
        userId: user.id,
        ipAddress,
        userAgent,
        status: "failed",
        failureReason: "Incorrect password",
      });
      return { success: false, error: "Invalid email or password." };
    }

    // Validate request role mapping (if role was passed in request)
    if (role && user.role.toUpperCase() !== role.toUpperCase()) {
      // Map legacy portal role names
      const isPortalRoleMatch =
        (role.toUpperCase() === "PATIENT" && user.role.toUpperCase() === "PATIENT") ||
        (role.toUpperCase() === "AGENCY" && user.role.toUpperCase() === "AGENCY") ||
        (role.toUpperCase() === "PROFESSIONAL" && user.role.toUpperCase() === "PROFESSIONAL") ||
        (role.toUpperCase() === "ADMIN" && (user.role.toUpperCase() === "ADMIN" || user.role.toUpperCase() === "SUPER_ADMIN"));

      if (!isPortalRoleMatch) {
        await AuthRepository.logLoginHistory({
          userId: user.id,
          ipAddress,
          userAgent,
          status: "failed",
          failureReason: `Role mismatch: expected ${role}, user has ${user.role}`,
        });
        return { success: false, error: "Unauthorized role access for this account." };
      }
    }

    // Update last login details and history log
    await AuthRepository.updateLastLogin(user.id);
    await AuthRepository.logLoginHistory({
      userId: user.id,
      ipAddress,
      userAgent,
      status: "success",
    });

    // Sign Tokens
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
    };

    const accessToken = await JWTLib.signAccessToken(payload);
    const refreshToken = await JWTLib.signRefreshToken(payload);

    // Save session details
    await SessionLib.createSession(user.id, accessToken, refreshToken);

    // Set Cookies
    await CookiesLib.setAuthCookies(accessToken, refreshToken);

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: accessToken,
      refreshToken,
    };
  },

  async logout(token: string): Promise<boolean> {
    await SessionLib.revokeSession(token);
    await CookiesLib.clearAuthCookies();
    return true;
  },

  async refresh(refreshToken: string): Promise<{ success: boolean; token?: string; refreshToken?: string; error?: string }> {
    try {
      const decoded = await JWTLib.verifyRefreshToken(refreshToken);
      const user = await AuthRepository.findUserById(decoded.id);

      if (!user) {
        return { success: false, error: "Session user not found." };
      }

      // Revoke the old session matching this refresh token
      await SessionLib.revokeSession(refreshToken);

      // Generate rotated new pair
      const payload: JWTPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: `${user.firstName} ${user.lastName}`,
      };

      const newAccessToken = await JWTLib.signAccessToken(payload);
      const newRefreshToken = await JWTLib.signRefreshToken(payload);

      // Save new rotated session in DB
      await SessionLib.createSession(user.id, newAccessToken, newRefreshToken);

      // Update cookie store
      await CookiesLib.setAuthCookies(newAccessToken, newRefreshToken);

      return {
        success: true,
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      return { success: false, error: "Invalid or expired refresh token." };
    }
  },

  async getCurrentUser(accessToken: string): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const decoded = await JWTLib.verifyAccessToken(accessToken);
      const user = await AuthRepository.findUserById(decoded.id);

      if (!user) {
        return { success: false, error: "User not found." };
      }

      const permissions = PermissionsLib.getPermissionsForRole(user.role);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role,
          phone: user.phone,
          status: user.status,
          permissions,
        },
      };
    } catch {
      return { success: false, error: "Invalid access token." };
    }
  },

  async changePassword(userId: string, oldPassword?: string, newPassword?: string): Promise<{ success: boolean; error?: string }> {
    if (!oldPassword || !newPassword) {
      return { success: false, error: "Old password and new password are required." };
    }

    const user = await AuthRepository.findUserById(userId);
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const isMatch = PasswordLib.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Incorrect old password." };
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return { success: false, error: "New password must be at least 8 characters and contain both letters and numbers." };
    }

    const newHash = PasswordLib.hash(newPassword);
    await AuthRepository.updatePassword(userId, newHash);

    return { success: true };
  },

  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email) {
      return { success: false, error: "Email is required." };
    }

    const user = await AuthRepository.findUserByEmail(email);
    if (!user) {
      return { success: false, error: "A user with this email address was not found." };
    }

    // Generate token
    const token = `reset-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1 hour expiry

    await AuthRepository.saveResetToken(user.id, token, expiresAt);

    // In a production app, we would send an email here.
    return { success: true };
  },

  async resetPassword(token: string, newPassword?: string): Promise<{ success: boolean; error?: string }> {
    if (!newPassword) {
      return { success: false, error: "New password is required." };
    }

    const reset = await AuthRepository.findResetToken(token);
    if (!reset) {
      return { success: false, error: "Invalid or already used reset token." };
    }

    // Check expiry
    if (new Date(reset.expiresAt).getTime() < Date.now()) {
      return { success: false, error: "Reset token has expired." };
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return { success: false, error: "Password must be at least 8 characters and contain both letters and numbers." };
    }

    const newHash = PasswordLib.hash(newPassword);
    await AuthRepository.updatePassword(reset.userId, newHash);

    // Revoke token
    const updateTokenSql = `UPDATE CORE.PASSWORD_RESET SET used = TRUE WHERE token = ?;`;
    await executeQuery(updateTokenSql, [token]);

    return { success: true };
  },

  async validatePermission(role: string, permission: string): Promise<boolean> {
    return PermissionsLib.hasPermission(role, permission);
  },

  async validateRole(userRole: string, requiredRole: string): Promise<boolean> {
    return RolesLib.hasRole(userRole, requiredRole);
  },
};
