import { NextResponse } from"next/server";
import { AuditRepository } from"../../../../lib/repositories";
import { NotificationService } from"../../../../lib/services";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { bookingId, patientId, patientName, coordinates, message } = body;

 const ip = request.headers.get("x-forwarded-for") ||"127.0.0.1";
 
 // Log emergency audit
 await AuditRepository.createLog(
 patientId ||"u-1",
"SOS EMERGENCY TRIGGERED",
`CRITICAL SOS TRIGGERED by ${patientName ||"Patient"}. Booking ID: ${bookingId ||"N/A"}. Coordinates: [${coordinates?.lat ||"N/A"}, ${coordinates?.lng ||"N/A"}]. Note: ${message ||"Immediate ambulance/clinical triage required."}`,
 ip
 );

 // Notify clinical admins
 await NotificationService.sendNotification({
 userId:"u-2", // Agency Admin Sri Krishna
 title:"🚨 CRITICAL SOS ESCALATION 🚨",
 template:"Emergency trigger received from {{patientName}}. Immediate dispatch recommended.",
 variables: { patientName: patientName ||"Ankala Victoria Rani" }
 });

 return NextResponse.json({
 success: true,
 message:"Emergency medical response team and clinical supervisors have been notified. Keep your device active.",
 dispatched: true,
 timestamp: new Date().toISOString()
 });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
