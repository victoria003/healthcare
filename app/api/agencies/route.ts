export const dynamic = 'force-dynamic';

import { NextResponse } from"next/server";
import { AgencyRepository } from"../../../lib/repositories";

export async function GET(request: Request) {
 try {
 const list = await AgencyRepository.getAll();
 return NextResponse.json({ success: true, agencies: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const created = await AgencyRepository.create(body);
 return NextResponse.json({ success: true, agency: created });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
