export const dynamic = 'force-dynamic';

import { NextResponse } from"next/server";
import { ProfessionalRepository } from"../../../../lib/repositories";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
 try {
 const id = (await params).id;
 const body = await request.json();
 const updated = await ProfessionalRepository.update(id, body);
 if (!updated) {
 return NextResponse.json({ success: false, error:"Professional not found" }, { status: 404 });
 }
 return NextResponse.json({ success: true, staff: updated });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
 try {
 const id = (await params).id;
 await ProfessionalRepository.delete(id);
 return NextResponse.json({ success: true });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
