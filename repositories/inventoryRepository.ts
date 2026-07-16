import { executeQuery } from "../lib/database/executeQuery";

export const InventoryRepository = {
  async getByAgency(agencyId: string) {
    const sql = `SELECT * FROM CORE.INVENTORY WHERE agency_id = ?;`;
    const rows = await executeQuery<any>(sql, [agencyId]);
    return rows.map((row: any) => ({
      id: row.ITEM_ID || row.item_id,
      agencyId: row.AGENCY_ID || row.agency_id,
      name: row.NAME || row.name,
      category: row.CATEGORY || row.category,
      quantity: Number(row.QUANTITY || row.quantity || 0),
      minThreshold: Number(row.MIN_THRESHOLD || row.min_threshold || 5),
      unit: row.UNIT || row.unit,
    }));
  },

  async getAll() {
    const sql = `SELECT * FROM CORE.INVENTORY;`;
    const rows = await executeQuery<any>(sql);
    return rows.map((row: any) => ({
      id: row.ITEM_ID || row.item_id,
      agencyId: row.AGENCY_ID || row.agency_id,
      name: row.NAME || row.name,
      category: row.CATEGORY || row.category,
      quantity: Number(row.QUANTITY || row.quantity || 0),
      minThreshold: Number(row.MIN_THRESHOLD || row.min_threshold || 5),
      unit: row.UNIT || row.unit,
    }));
  }
};
