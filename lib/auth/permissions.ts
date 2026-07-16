export const rolePermissions: Record<string, string[]> = {
  PATIENT: ["Dashboard", "Bookings", "Profile", "Notifications", "Documents", "Payments"],
  PROFESSIONAL: ["Dashboard", "Bookings", "Profile", "Notifications", "Documents", "Settings"],
  AGENCY: ["Dashboard", "Bookings", "Patients", "Professionals", "Profile", "Notifications", "Documents", "Reports", "Payments", "Settings"],
  ADMIN: ["Dashboard", "Bookings", "Patients", "Professionals", "Agencies", "Reports", "Settings", "Documents", "Notifications", "Payments", "Profile", "Users"],
  SUPER_ADMIN: ["Dashboard", "Bookings", "Patients", "Professionals", "Agencies", "Reports", "Settings", "Documents", "Notifications", "Payments", "Profile", "Users"]
};

export const PermissionsLib = {
  hasPermission(role: string, permission: string): boolean {
    const permissions = rolePermissions[role.toUpperCase()] || [];
    return permissions.includes(permission);
  },

  getPermissionsForRole(role: string): string[] {
    return rolePermissions[role.toUpperCase()] || [];
  }
};
