import { NextResponse } from"next/server";
import { InventoryRepository } from"../../../repositories/inventoryRepository";

export async function GET(request: Request) {
 try {
 const { searchParams } = new URL(request.url);
 const agencyId = searchParams.get("agencyId");

 let list = [];
 if (agencyId) {
 list = await InventoryRepository.getByAgency(agencyId);
 } else {
 list = await InventoryRepository.getAll();
 }

 return NextResponse.json({ success: true, inventory: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
