import { SchedulingRepository } from "../repositories/schedulingRepository";
import { BookingRepository } from "../repositories/bookingRepository";

export const AvailabilityEngine = {
  async checkConflict(staffId: string, date: string, timeSlot: string): Promise<{ conflict: boolean; reason?: string }> {
    // Check Leave Calendar in Snowflake
    const leaveRecords = await SchedulingRepository.getLeaveRecordsByStaff(staffId);
    const isOnLeave = leaveRecords.some((l: any) => l.date === date && l.status === "approved");
    if (isOnLeave) {
      return { conflict: true, reason: "Staff is on approved leave." };
    }

    // Check existing booking overlap in Snowflake
    const bookings = await BookingRepository.findByStaff(staffId);
    const activeBooking = bookings.find((b: any) => b.date === date && b.timeSlot === timeSlot && b.status !== "rejected");
    if (activeBooking) {
      return { conflict: true, reason: `Staff has conflicting booking: ${activeBooking.id}` };
    }

    return { conflict: false };
  },

  calculateTravelTime(startLat: number, startLng: number, endLat: number, endLng: number): number {
    // Approximate distance in km using Manhattan distance
    const dist = Math.abs(startLat - endLat) + Math.abs(startLng - endLng) * 111;
    // Assume average speed 30km/h
    return Math.round((dist / 30) * 60); // in minutes
  },

  async getShiftCalendar(staffId: string) {
    return await SchedulingRepository.getAttendanceByStaff(staffId);
  }
};
