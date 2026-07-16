import { executeQuery } from "../lib/database/executeQuery";

export const CMSRepository = {
  async getFranchiseNodes() {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.FRANCHISE_NODES (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150),
        region VARCHAR(100),
        manager VARCHAR(150),
        agencies_count INT,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.FRANCHISE_NODES;`;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      name: row.NAME || row.name,
      region: row.REGION || row.region,
      manager: row.MANAGER || row.manager,
      agenciesCount: Number(row.AGENCIES_COUNT || row.agencies_count || 0),
    }));
  },

  async getCorporateAccounts() {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.CORPORATE_ACCOUNTS (
        id VARCHAR(50) PRIMARY KEY,
        company_name VARCHAR(150),
        contact_email VARCHAR(100),
        employee_count INT,
        subsidy_percentage DECIMAL(5,2),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.CORPORATE_ACCOUNTS;`;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      companyName: row.COMPANY_NAME || row.company_name,
      contactEmail: row.CONTACT_EMAIL || row.contact_email,
      employeeCount: Number(row.EMPLOYEE_COUNT || row.employee_count || 0),
      subsidyPercentage: Number(row.SUBSIDY_PERCENTAGE || row.subsidy_percentage || 0),
    }));
  },

  async getApiKeys(agencyId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.API_KEYS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        key_name VARCHAR(100),
        masked_key VARCHAR(100),
        raw_key VARCHAR(100),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.API_KEYS WHERE agency_id = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map((row: any) => ({
      id: row.ID || row.id,
      agencyId: row.AGENCY_ID || row.agency_id,
      keyName: row.KEY_NAME || row.key_name,
      maskedKey: row.MASKED_KEY || row.masked_key,
      rawKey: row.RAW_KEY || row.raw_key,
      status: (row.STATUS || row.status) as any,
    }));
  },

  async createApiKey(agencyId: string, keyName: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.API_KEYS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        key_name VARCHAR(100),
        masked_key VARCHAR(100),
        raw_key VARCHAR(100),
        status VARCHAR(20),
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const rawKey = `hc_live_sec_${Math.random().toString(36).substring(2, 10)}`;
    const maskedKey = `hc_live_sec_******${rawKey.substring(rawKey.length - 4)}`;
    const id = `key-${Date.now()}`;

    const sql = `
      INSERT INTO CORE.API_KEYS (id, agency_id, key_name, masked_key, raw_key, status)
      VALUES (?, ?, ?, ?, ?, 'active');
    `;
    await executeQuery(sql, [id, agencyId, keyName, maskedKey, rawKey]);

    return {
      id,
      agencyId,
      keyName,
      maskedKey,
      rawKey,
      status: "active" as const
    };
  },

  async getWebhooks(agencyId: string) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.WEBHOOKS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        url VARCHAR(255),
        events ARRAY,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const sql = `SELECT * FROM CORE.WEBHOOKS WHERE agency_id = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map((row: any) => {
      let events: string[] = [];
      try {
        if (row.EVENTS) {
          events = typeof row.EVENTS === "string" ? JSON.parse(row.EVENTS) : (Array.isArray(row.EVENTS) ? row.EVENTS : []);
        }
      } catch {
        events = [];
      }
      return {
        id: row.ID || row.id,
        agencyId: row.AGENCY_ID || row.agency_id,
        url: row.URL || row.url,
        events,
      };
    });
  },

  async createWebhook(webhook: { agencyId: string; url: string; events: string[] }) {
    const initSql = `
      CREATE TABLE IF NOT EXISTS CORE.WEBHOOKS (
        id VARCHAR(50) PRIMARY KEY,
        agency_id VARCHAR(50),
        url VARCHAR(255),
        events ARRAY,
        created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
      );
    `;
    await executeQuery(initSql);

    const id = `web-${Date.now()}`;
    const eventsJson = JSON.stringify(webhook.events || []);

    const sql = `
      INSERT INTO CORE.WEBHOOKS (id, agency_id, url, events)
      VALUES (?, ?, ?, PARSE_JSON(?));
    `;
    await executeQuery(sql, [id, webhook.agencyId, webhook.url, eventsJson]);

    return {
      id,
      ...webhook
    };
  }
};
