let systemSettings = {
  maintenanceMode: false,
  autoAssignStaff: true,
  enableSmsNotifications: true,
};

let featureFlags = {
  enableAiMatching: true,
  enableSosAlerts: true,
  enablePayrollDashboard: true,
};

export const SettingsService = {
  getSystemSettings() {
    return systemSettings;
  },

  getFeatureFlags() {
    return featureFlags;
  },

  toggleMaintenanceMode(enabled: boolean) {
    systemSettings.maintenanceMode = enabled;
    return systemSettings;
  }
};
