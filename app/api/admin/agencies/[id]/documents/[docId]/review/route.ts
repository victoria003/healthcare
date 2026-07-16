import { NextResponse } from"next/server";
import { AgencyRepository, AuditRepository } from"../../../../../../../../lib/repositories";

export async function POST(
 request: Request,
 { params }: { params: Promise<{ id: string; docId: string }> }
) {
 try {
 const { id, docId } = await params;
 const body = await request.json();
 const { status, rejectionReason } = body; // approved, rejected

 if (!status) {
 return NextResponse.json({ success: false, error:"Review status is required" }, { status: 400 });
 }

 const agency = await AgencyRepository.findById(id);
 if (!agency) {
 return NextResponse.json({ success: false, error:"Agency not found" }, { status: 404 });
 }

 const documents = agency.documents || [];
 const docIdx = documents.findIndex((d) => d.id === docId);

 if (docIdx === -1) {
 return NextResponse.json({ success: false, error:"Document not found" }, { status: 404 });
 }

 documents[docIdx] = {
 ...documents[docIdx],
 status: status,
 reviewNotes: rejectionReason || undefined
 };

 const updated = await AgencyRepository.update(id, { documents });

 await AuditRepository.createLog(
"Platform Admin",
"Document Reviewed",
`Reviewed document ${docId} (Type: ${documents[docIdx].type.toUpperCase()}) for agency"${agency.name}". Decision: ${status.toUpperCase()}`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 return NextResponse.json({ success: true, document: documents[docIdx] });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
