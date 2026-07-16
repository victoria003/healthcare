import { Booking, BookingStatus } from "@/types/booking";

export class BookingService {
  async getBookings(): Promise<Booking[]> {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to fetch bookings");
    return (data.bookings || []).map(this.mapToBooking);
  }

  private mapToBooking(b: any): Booking {
    let status = BookingStatus.Pending;
    const dbStatus = String(b.status || "").toLowerCase();
    if (dbStatus === "confirmed" || dbStatus === "accepted" || dbStatus === "assign_staff" || dbStatus === "travel_started" || dbStatus === "arrived") {
      status = BookingStatus.Confirmed;
    } else if (dbStatus === "completed") {
      status = BookingStatus.Completed;
    } else if (dbStatus === "cancelled" || dbStatus === "canceled") {
      status = BookingStatus.Cancelled;
    }

    return {
      id: b.id || b.booking_id || "",
      patientId: b.patientId || b.patient_id || "",
      providerId: b.assignedStaffId || b.assigned_staff_id || b.providerId || "p1",
      date: b.date || b.booking_date || "",
      time: b.timeSlot || b.time || b.time_slot || "",
      status,
      
      serviceName: b.serviceName || b.service_name || "",
      serviceCategory: b.serviceCategory || b.service_category || "",
      amount: Number(b.amount || 0),
      timeSlot: b.timeSlot || b.time_slot || "",
      patientName: b.patientName || b.patient_name || "",
      assignedStaffId: b.assignedStaffId || b.assigned_staff_id || "",
      address: b.address ? {
        id: b.address.id,
        label: b.address.label,
        addressLine: b.address.addressLine || b.address.address_line || "",
        city: b.address.city || "",
        state: b.address.state || "",
        pincode: b.address.pincode || "",
      } : undefined,
    };
  }
}

export const bookingService = new BookingService();
