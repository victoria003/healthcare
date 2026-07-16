import { NextResponse } from"next/server";
import { BookingRepository, AuditRepository } from"../../../lib/repositories";

export async function GET(request: Request) {
 try {
 const { searchParams } = new URL(request.url);
 const patientId = searchParams.get("patientId");
 const agencyId = searchParams.get("agencyId");
 const staffId = searchParams.get("staffId");

 let list = await BookingRepository.getAll();

 if (patientId) list = list.filter((b) => b.patientId === patientId);
 if (agencyId) list = list.filter((b) => b.agencyId === agencyId);
 if (staffId) list = list.filter((b) => b.assignedStaffId === staffId);

 return NextResponse.json({ success: true, bookings: list });
 } catch (error: any) {
 return NextResponse.json({ success: false, error: error.message }, { status: 500 });
 }
}
