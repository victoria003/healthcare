import { NextResponse } from"next/server";
import { BookingRepository, AuditRepository } from"../../../../lib/repositories";
import { NotificationService } from"../../../../lib/services";

export async function POST(request: Request) {
 try {
 const body = await request.json();
 const { agencyId, agencyName, patientId, patientName, serviceCategory, serviceName, amount, date, timeSlot, address, durationHours, frequency } = body;

 if (!agencyId || !patientId || !amount || !address) {
 return NextResponse.json({ success: false, error:"Missing required booking details" }, { status: 400 });
 }

 const booking = await BookingRepository.create({
 agencyId,
 agencyName: agencyName ||"Associated Care Provider",
 patientId,
 patientName: patientName ||"Valued Patient",
 serviceCategory,
 serviceName,
 amount,
 date,
 timeSlot,
 address,
 durationHours: durationHours || 12,
 frequency: frequency ||"one-time",
 status:"booking_created" as any, // Initialize at step 1
 } as any);

 await AuditRepository.createLog(
 patientId,
"Booking Created",
`Booked ${serviceName} with ${agencyName}. Value: INR ${amount}`,
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 // Send dispatch notification
 await NotificationService.sendNotification({
 userId: patientId,
 title:"Booking Requested",
 template:"Your care booking with {{agencyName}} has been successfully generated. Invoice pending.",
 variables: { agencyName }
 });

 return NextResponse.json({ success: true, booking });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
