import { NextResponse } from"next/server";
import { AgencyRepository, AuditRepository } from"../../../../../lib/repositories";

export async function POST(
 request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
 const body = await request.json();
 const { accountHolder, accountNumber, ifscCode, bankName } = body;

 if (!accountHolder || !accountNumber || !ifscCode) {
 return NextResponse.json({ success: false, error:"Missing required banking credentials" }, { status: 400 });
 }

 const agency = await AgencyRepository.findById(id);
 if (!agency) {
 return NextResponse.json({ success: false, error:"Agency not found" }, { status: 404 });
 }

 const updated = await AgencyRepository.update(id, {
 bankDetails: { accountHolder, accountNumber, ifscCode, bankName: bankName ||"Partner bank" }
 });

 await AuditRepository.createLog(
 agency.ownerName,
"Bank Details Updated",
`Agency updated billing bank information to ${accountNumber.slice(-4)}`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 return NextResponse.json({ success: true, agency: updated });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
