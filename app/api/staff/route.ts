export const dynamic = 'force-dynamic';

import { NextResponse } from"next/server";
import { ProfessionalRepository } from"../../../lib/repositories";

export async function GET(request: Request) {
 try {
 const { searchParams } = new URL(request.url);
 const agencyId = searchParams.get("agencyId");
 const role = searchParams.get("role");

 let list = await ProfessionalRepository.getAll();

 if (agencyId) list = list.filter((s) => s.agencyId === agencyId);
 if (role) list = list.filter((s) => s.role.toLowerCase() === role.toLowerCase());

 return NextResponse.json({ success: true, staff: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const created = await ProfessionalRepository.create(body);
 return NextResponse.json({ success: true, staff: created });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
