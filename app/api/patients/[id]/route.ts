import { NextResponse } from"next/server";
import { PatientRepository } from"../../../../lib/repositories";

export async function GET(request: Request, { params }: any) {
 try {
 const id = params.id;
 const profile = await PatientRepository.getProfile(id);
 if (!profile) {
 return NextResponse.json({ success: false, error:"Patient profile not found" }, { status: 404 });
 }
 return NextResponse.json({ success: true, profile });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
