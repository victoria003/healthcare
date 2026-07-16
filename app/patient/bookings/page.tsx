"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import { CalendarDays, MapPin, Clock, Calendar, Inbox } from"lucide-react";
import { PageHeader, CleanCard, SaaSDataTable, StatusBadge, EmptyState } from"@/components/DesignSystem";
import { bookingService } from"@/lib/services/booking.service";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

export default function PatientBookingsPage() {
 const router = useRouter();
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [providers, setProviders] = useState<MockProfessional[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 setLoading(true);
 Promise.all([bookingService.getBookings(), providerService.getProviders()])
 .then(([bookingsData, providersData]) => {
 setBookings(bookingsData || []);
 setProviders(providersData || []);
 })
 .catch((err) => console.error("Error loading bookings data:", err))
 .finally(() => setLoading(false));
 }, []);

 const getProviderInfo = (providerId: string) => {
 return providers.find((p) => p.id === providerId);
 };

 const formatDate = (val: string | number) => {
 if (typeof val ==="string" && !isNaN(Number(val))) {
 const date = new Date(Number(val) * 1000);
 return date.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
 }
 return String(val);
 };

 const getBadgeType = (status: BookingStatus) => {
 if (status === BookingStatus.Confirmed || status === BookingStatus.Completed) return"success";
 if (status === BookingStatus.Pending) return"warning";
 if (status === BookingStatus.Cancelled) return"error";
 return"neutral";
 };

 // Separate upcoming vs previous
 const upcomingBookings = bookings.filter(
 (b) => b.status === BookingStatus.Confirmed || b.status === BookingStatus.Pending
 );
 
 const previousBookings = bookings.filter(
 (b) => b.status === BookingStatus.Completed || b.status === BookingStatus.Cancelled
 );

 const upcomingCount = upcomingBookings.length;
 const completedCount = previousBookings.filter(b => b.status === BookingStatus.Completed).length;
 const cancelledCount = previousBookings.filter(b => b.status === BookingStatus.Cancelled).length;
 const totalCount = bookings.length;

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" />
 </div>
 );
 }

 return (
 <div className="w-full space-y-8">
 {/* 1. Page Header */}
 <PageHeader
 title="Bookings"
 description="Manage your upcoming appointments and history of home care consulting visits."
 action={
 <button
 onClick={() => router.push("/patient/explore")}
 className="px-5 py-2 bg-primary text-white hover:bg-slate-850 :bg-bg-alt rounded-lg text-sm font-semibold shadow-sm transition-all shrink-0"
 >
 Book Appointment
 </button>
 }
 />

 {/* Stats Overview */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {[
 { label:"Upcoming", val: upcomingCount },
 { label:"Completed", val: completedCount },
 { label:"Cancelled", val: cancelledCount },
 { label:"Total Bookings", val: totalCount }
 ].map((card, idx) => (
 <CleanCard key={idx} className="!p-8 flex flex-col justify-between">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block mb-2">{card.label}</span>
 <span className="text-2xl font-bold text-primary leading-none">{card.val}</span>
 </CleanCard>
 ))}
 </div>

 {/* 2. Upcoming Appointment Section */}
 <section className="space-y-4">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Upcoming Visits</span>
 {upcomingBookings.length > 0 ? (
 <div className="space-y-4">
 {upcomingBookings.map((b) => (
 <CleanCard key={b.id} className="hover:border-slate-350 :border-border-light transition-colors">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="space-y-4 flex-1">
 <div className="flex items-center gap-6">
 <StatusBadge status={b.status} type={getBadgeType(b.status)} />
 <span className="text-sm text-text-tertiary font-medium">#{b.id}</span>
 </div>

 <div className="space-y-1">
 <h3 className="font-bold text-base text-primary">
 {b.serviceName ||"Nursing Care Support"}
 </h3>
 <p className="text-base text-slate-455 font-medium">
 Service Category: {b.serviceCategory ||"Nursing"}
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-555 font-semibold">
 <span className="flex items-center gap-1.5">
 <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
 {b.date ? formatDate(b.date) :"Today"}
 </span>
 <span className="flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-text-tertiary" />
 {b.timeSlot || b.time}
 </span>
 {b.address && (
 <span className="flex items-center gap-1.5">
 <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
 {b.address.addressLine}, {b.address.city}
 </span>
 )}
 </div>
 </div>

 <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border-light shrink-0">
 <div className="flex items-center gap-6 text-left">
 <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border-light flex items-center justify-center font-bold text-sm uppercase text-text-secondary">
 {b.assignedStaffId ? getProviderInfo(b.assignedStaffId)?.fullName.charAt(0) :"P"}
 </div>
 <div>
 <span className="text-sm font-bold text-slate-850 block">
 {b.assignedStaffId ? getProviderInfo(b.assignedStaffId)?.fullName :"Priya Sharma, RN"}
 </span>
 <span className="text-base text-slate-450 block">Care Provider</span>
 </div>
 </div>

 <div className="flex gap-6">
 <button
 onClick={() => router.push(`/patient/dashboard?view=support`)}
 className="px-3 py-2.5 border border-border/60 hover:bg-bg-alt :bg-primary rounded-lg text-sm font-semibold text-text-secondary transition-colors"
 >
 Help Support
 </button>
 </div>
 </div>
 </div>
 </CleanCard>
 ))}
 </div>
 ) : (
 <EmptyState
 title="No upcoming visits scheduled"
 description="All active caregiver visits will appear here once booked."
 icon={<CalendarDays className="w-5 h-5" />}
 action={{ label:"Find Care", onClick: () => router.push("/patient/explore") }}
 />
 )}
 </section>

 {/* 3. Previous Bookings Section */}
 <section className="space-y-4">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Previous History</span>
 <SaaSDataTable
 headers={["Booking ID","Service Description","Scheduled Date","Amount Due","Status"]}
 data={previousBookings}
 renderRow={(item: Booking) => (
 <tr key={item.id} className="hover:bg-bg-alt/40 :bg-primary/10 transition-colors">
 <td className="px-6 py-4.5 font-mono text-text-tertiary font-semibold">#{item.id}</td>
 <td className="px-6 py-4.5 font-bold text-primary">{item.serviceName ||"Nursing Care Support"}</td>
 <td className="px-6 py-4.5 font-medium text-text-tertiary">{item.date ? formatDate(item.date) :"Completed"}</td>
 <td className="px-6 py-4.5 font-bold text-primary">₹{item.amount || 4500}</td>
 <td className="px-6 py-4.5">
 <StatusBadge status={item.status} type={getBadgeType(item.status)} />
 </td>
 </tr>
 )}
 emptyState={
 <div className="text-center py-6 text-sm text-text-tertiary font-semibold">
 No historical visits detected.
 </div>
 }
 />
 </section>
 </div>
 );
}
