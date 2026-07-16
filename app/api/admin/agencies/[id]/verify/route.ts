import { NextResponse } from"next/server";
import { AgencyRepository, AuditRepository } from"../../../../../../lib/repositories";
import { NotificationService } from"../../../../../../lib/services";

export async function POST(
 request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
 const body = await request.json();
 const { status, remarks } = body; // approved, rejected, more_info

 if (!status) {
 return NextResponse.json({ success: false, error:"Verification status is required" }, { status: 400 });
 }

 const agency = await AgencyRepository.findById(id);
 if (!agency) {
 return NextResponse.json({ success: false, error:"Agency not found" }, { status: 404 });
 }

 const updated = await AgencyRepository.update(id, {
 status: status,
 verified: status ==="approved"
 });

 await AuditRepository.createLog(
"Platform Admin",
"Agency Verification Complete",
`Agency"${agency.name}" verification decision set to ${status.toUpperCase()}. Comments: ${remarks ||"None"}`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 // Send notifications to the agency owner
 const title = status ==="approved" ?"Congratulations! Your Agency is Live" :"Action Required: Verification status update";
 await NotificationService.sendNotification({
 userId: agency.email,
 title,
 template:`Your Home Healthcare Agency profile has been marked as {{status}}. Details: {{remarks}}`,
 variables: { status, remarks: remarks ||"Welcome to the HomeCare Marketplace!" }
 });

 return NextResponse.json({ success: true, agency: updated });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
