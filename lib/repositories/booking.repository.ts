import { Booking, BookingStatus } from "@/types/booking";

export class BookingRepository {
  private mockBookings: Booking[] = [
    {
      id: "b-1",
      patientId: "patient-1",
      providerId: "p1",
      date: "2026-07-15",
      time: "10:00 AM",
      status: BookingStatus.Confirmed,
    },
    {
      id: "b-2",
      patientId: "patient-1",
      providerId: "p2",
      date: "2026-07-16",
      time: "02:00 PM",
      status: BookingStatus.Pending,
    },
  ];

  async getBookings(): Promise<Booking[]> {
    return this.mockBookings;
  }
}

export const bookingRepository = new BookingRepository();
