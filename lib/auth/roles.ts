export const RolesLib = {
  isValidRole(role: string): boolean {
    const validRoles = ["PATIENT", "PROFESSIONAL", "AGENCY", "ADMIN", "SUPER_ADMIN"];
    return validRoles.includes(role.toUpperCase());
  },

  hasRole(userRole: string, requiredRole: string): boolean {
    if (userRole.toUpperCase() === requiredRole.toUpperCase()) {
      return true;
    }
    // SUPER_ADMIN and ADMIN have global permissions
    if (userRole.toUpperCase() === "SUPER_ADMIN") return true;
    if (userRole.toUpperCase() === "ADMIN" && requiredRole.toUpperCase() !== "SUPER_ADMIN") return true;
    return false;
  }
};
