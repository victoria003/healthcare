import { NextResponse } from"next/server";
import { AgencyRepository } from"../../../../lib/repositories";

export async function GET(request: Request) {
 try {
 const list = await AgencyRepository.getAll();
 const queue = list.filter((agency) => agency.status ==="pending" || agency.documents?.some((doc) => doc.status ==="pending"));
 return NextResponse.json({ success: true, queue });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
