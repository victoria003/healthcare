import { NextResponse } from"next/server";
import { PatientRepository } from"../../../lib/repositories";

export async function GET(request: Request) {
 try {
 const list = await PatientRepository.getAll();
 return NextResponse.json({ success: true, patients: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
