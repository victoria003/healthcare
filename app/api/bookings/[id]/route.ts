import { NextResponse } from"next/server";
import { BookingRepository } from"../../../../repositories/bookingRepository";
import { AuditRepository } from"../../../../repositories/auditRepository";
import { ClinicalRepository } from"../../../../repositories/clinicalRepository";
import { NotificationService } from"../../../../lib/services";

export async function PATCH(
 request: Request,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
 const { id } = await params;
 const body = await request.json();
 const {
 status,
 assignedStaffId,
 assignedStaffName,
 assignedStaffPhone,
 assignedStaffAvatar,
 etaMinutes,
 liveLocation,
 vitals,
 careNotes,
 signatureUrl,
 paymentStatus,
 reviewText,
 rating,
 actorId
 } = body;

 const booking = await BookingRepository.findById(id);
 if (!booking) {
 return NextResponse.json({ success: false, error:"Booking not found" }, { status: 404 });
 }

 const updates: any = {};
 if (status) updates.status = status;
 if (assignedStaffId) {
 updates.assignedStaffId = assignedStaffId;
 updates.assignedStaffName = assignedStaffName ||"Care Professional";
 updates.assignedStaffPhone = assignedStaffPhone ||"+91 9000012345";
 updates.assignedStaffAvatar = assignedStaffAvatar ||"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150";
 }
 if (etaMinutes !== undefined) updates.etaMinutes = etaMinutes;
 if (liveLocation) updates.liveLocation = liveLocation;
 if (vitals) updates.vitals = vitals;
 if (careNotes) updates.careNotes = careNotes;
 if (signatureUrl) updates.signatureUrl = signatureUrl;
 if (paymentStatus) updates.paymentStatus = paymentStatus;
 if (reviewText) updates.reviewText = reviewText;
 if (rating !== undefined) updates.rating = rating;

 const updated = await BookingRepository.update(id, updates);

 // Audit logs for specific state steps
 const currentActor = actorId || booking.patientId;
 let logMessage =`Booking ${id} updated state.`;
 if (status) {
 logMessage =`Booking transitioned to state: ${status.toUpperCase()}`;
 }

 await AuditRepository.createLog(
 currentActor,
 status ||"Booking Updated",
 logMessage + (careNotes ?`Care notes:"${careNotes}"`:"") + (vitals ?`Vitals: BP=${vitals.bloodPressure}, Pulse=${vitals.pulseRate}`:""),
 request.headers.get("x-forwarded-for") ||"127.0.0.1"
 );

 // If vitals or checks happened, we push to medical timeline events in Snowflake
 if (vitals || careNotes) {
 await ClinicalRepository.addTimelineEvent({
 patientId: booking.patientId,
 title: status ==="vitals" ?"Vitals Captured" :"Clinical Care Activities Logged",
 category: status ==="vitals" ?"vitals" :"care_activity",
 description: careNotes ||`Recorded Blood Pressure: ${vitals?.bloodPressure} mmHg, Pulse: ${vitals?.pulseRate} bpm, SpO2: ${vitals?.spo2}%`
 });
 }

 // Dynamic Notifications based on state transitions
 if (status) {
 const isPatientNotif = ["payment_pending","assign_staff","travel_started","arrived","invoice","completed"].includes(status);
 const targetUser = isPatientNotif ? booking.patientId : booking.assignedStaffId || booking.patientId;
 await NotificationService.sendNotification({
 userId: targetUser,
 title:`Booking Update: ${status.replace("_","").toUpperCase()}`,
 template:`Your appointment with ID ${booking.id} is now in state: {{status}}. Thank you for using HomeCare Grid.`,
 variables: { status: status.replace("_","") }
 });
 }

 return NextResponse.json({ success: true, booking: updated });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
