import { NextResponse } from"next/server";
import { ClinicalRepository } from"../../../repositories/clinicalRepository";

export async function GET(request: Request) {
 try {
 const { searchParams } = new URL(request.url);
 const patientId = searchParams.get("patientId");

 let list = [];
 if (patientId) {
 list = await ClinicalRepository.getCarePlansByPatient(patientId);
 }

 return NextResponse.json({ success: true, carePlans: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
