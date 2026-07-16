import { executeQuery } from "../lib/database/executeQuery";

export const TenantRepository = {
  async getBranding(agencyId: string) {
    const sql = `SELECT * FROM CORE.AGENCIES WHERE AGENCY_ID = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        primaryColor: "#14b8a6",
        name: row.NAME || row.name,
        logoUrl: null,
        customDomain: `${agencyId}.homecare.in`
      };
    }
    return {
      primaryColor: "#4f46e5",
      name: "HomeCare Grid",
      logoUrl: null,
      customDomain: "app.homecare.in"
    };
  },

  async getSettings(agencyId: string) {
    return {
      agencyId,
      autoAssignStaff: true,
      allowFamilyLogins: true,
      billingCycle: "monthly"
    };
  }
};
