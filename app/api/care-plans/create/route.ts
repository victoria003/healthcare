import { NextResponse } from"next/server";
import { ClinicalRepository } from"../../../../repositories/clinicalRepository";
import { AuditRepository } from"../../../../repositories/auditRepository";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { patientId, patientName, agencyId, diagnosis, goals, frequency, prescriptions, riskAssessment, riskDetails, createdBy } = body;

 if (!patientId || !diagnosis) {
 return NextResponse.json({ success: false, error:"Patient ID and Clinical Diagnosis are required" }, { status: 400 });
 }

 const carePlan = await ClinicalRepository.createCarePlan({
 patientId,
 patientName: patientName ||"Valued Patient",
 agencyId: agencyId ||"agency-1",
 diagnosis,
 goals: goals || [],
 frequency: frequency ||"Daily",
 prescriptions: prescriptions || [],
 riskAssessment: riskAssessment ||"low",
 riskDetails: riskDetails ||"No immediate safety hazards detected.",
 createdBy: createdBy ||"Clinical Administrator",
 });

 await AuditRepository.createLog(
 createdBy ||"Clinical Staff",
"Care Plan Created",
`Clinical recovery plan registered for ${patientName}. Diagnosis: ${diagnosis}`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 return NextResponse.json({ success: true, carePlan });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
