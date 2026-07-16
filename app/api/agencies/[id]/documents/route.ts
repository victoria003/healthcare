import { NextResponse } from"next/server";
import { AgencyRepository, AuditRepository } from"../../../../../lib/repositories";

export async function POST(
 request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
 const body = await request.json();
 const { documentType, fileUrl, fileName } = body;

 if (!documentType || !fileUrl) {
 return NextResponse.json({ success: false, error:"Document Type and File Url are required" }, { status: 400 });
 }

 const agency = await AgencyRepository.findById(id);
 if (!agency) {
 return NextResponse.json({ success: false, error:"Agency profile not found" }, { status: 404 });
 }

 const newDoc = await AgencyRepository.saveDocument(id, {
 type: documentType,
 fileUrl: fileUrl,
 fileName: fileName ||`${documentType}.pdf`
 });

 await AuditRepository.createLog(
 agency.ownerName,
"Document Uploaded",
`Agency uploaded sensitive ${documentType.toUpperCase()} document. Verification pending.`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 return NextResponse.json({ success: true, document: newDoc });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
