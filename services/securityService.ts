import { UserRepository } from "../repositories/userRepository";
import { UserRole } from "../lib/types";

export const SecurityService = {
  async validateRBAC(user: { role: string; id: string }, requiredRoles: UserRole[], resourceTenantId?: string, resourceOwnerId?: string) {
    // 1. Check Role Permission
    if (!requiredRoles.includes(user.role as UserRole) && user.role !== UserRole.PLATFORM_ADMIN) {
      throw new Error(`Access Denied: Requires role in [${requiredRoles.join(", ")}]`);
    }

    // 2. Check Tenant Isolation
    if (resourceTenantId && user.role === UserRole.AGENCY_ADMIN) {
      // Find agency admin's agency
      const adminUser = await UserRepository.findById(user.id);
      // Simulating tenant link
      if (adminUser && resourceTenantId !== "agency-1") {
        throw new Error("Tenant Access Violated: Isolated multi-tenant sandbox.");
      }
    }

    // 3. Check Ownership
    if (resourceOwnerId && user.role !== UserRole.PLATFORM_ADMIN && user.role !== UserRole.AGENCY_ADMIN) {
      if (user.id !== resourceOwnerId) {
        throw new Error("Ownership Access Denied: User does not own this resource.");
      }
    }

    return true;
  }
};
