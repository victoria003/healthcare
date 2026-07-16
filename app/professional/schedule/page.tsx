"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import {
 CalendarDays, Clock, CheckCircle2, LayoutGrid,
 ChevronLeft, ChevronRight, MapPin, Inbox
} from"lucide-react";
import { PageHeader, CleanCard, SaaSDataTable, StatusBadge, EmptyState } from"@/components/DesignSystem";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

// ── Helpers ───────────────────────────────────────────────────────────────────
const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta",
"patient-2":"Priya Sharma",
"patient-3":"Ravi Nair",
"patient-4":"Sunita Das",
"u-1":"Ankala Victoria Rani",
};
const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];
const LOCATIONS = ["Jubilee Hills, Hyd","Gachibowli, Hyd","Madhapur, Hyd","Banjara Hills, Hyd"];
function derivedService(id: string) { return SERVICES[parseInt(id.replace(/\D/g,"0").slice(-2),10)%SERVICES.length]; }
function derivedLocation(id: string) { return LOCATIONS[parseInt(id.replace(/\D/g,"0").slice(-1),10)%LOCATIONS.length]; }

const FILTER_OPTIONS = ["All","Today","This Week","Completed"] as const;
type FilterOption = typeof FILTER_OPTIONS[number];

export default function ProfessionalSchedulePage() {
 const router = useRouter();
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
 const [weekOffset, setWeekOffset] = useState(0);

 // Week navigation (UI state only)
 const today = new Date();
 const weekStart = new Date(today);
 weekStart.setDate(today.getDate() + weekOffset * 7 - today.getDay());
 const weekEnd = new Date(weekStart);
 weekEnd.setDate(weekStart.getDate() + 6);
 const weekLabel =`${weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${weekEnd.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;

 useEffect(() => {
 Promise.all([bookingService.getBookings(), providerService.getProviders()])
 .then(([bks]) => setBookings(bks || []))
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 const todayCount = bookings.filter((b) => b.status !== BookingStatus.Cancelled).length;
 const weekCount = bookings.length;
 const completedToday= bookings.filter((b) => b.status === BookingStatus.Completed).length;
 const available = Math.max(0, 8 - todayCount);

 const filtered = useMemo(() => {
 return bookings.filter((b) => {
 if (activeFilter ==="Completed") return b.status === BookingStatus.Completed;
 return true;
 });
 }, [bookings, activeFilter]);

 const getBadgeType = (status: BookingStatus) => {
 if (status === BookingStatus.Confirmed || status === BookingStatus.Completed) return"success";
 if (status === BookingStatus.Pending) return"warning";
 if (status === BookingStatus.Cancelled) return"error";
 return"neutral";
 };

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
 title="My Schedule"
 description="Plan your availability, monitor consulting blocks, and manage daily care visits."
 />

 {/* 2. Metrics Grid */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {[
 { label:"Today's Visits", val: todayCount },
 { label:"This Week", val: weekCount },
 { label:"Completed Visits", val: completedToday },
 { label:"Available Slots", val: available }
 ].map((card, idx) => (
 <CleanCard key={idx} className="!p-8 flex flex-col justify-between">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block mb-2">{card.label}</span>
 <span className="text-2xl font-bold text-primary leading-none">{card.val}</span>
 </CleanCard>
 ))}
 </div>

 {/* 3. Week Picker Toolbar */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border border-border/50 rounded-xl bg-white [#12121a]">
 <div className="flex items-center gap-6">
 <button
 onClick={() => setWeekOffset(weekOffset - 1)}
 className="p-1.5 border border-border/60 rounded hover:bg-bg-alt :bg-primary text-text-secondary transition-colors"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <span className="text-sm font-bold text-primary px-3">{weekLabel}</span>
 <button
 onClick={() => setWeekOffset(weekOffset + 1)}
 className="p-1.5 border border-border/60 rounded hover:bg-bg-alt :bg-primary text-text-secondary transition-colors"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 {weekOffset !== 0 && (
 <button
 onClick={() => setWeekOffset(0)}
 className="text-base font-bold text-slate-455 hover:text-slate-750 :text-white px-3.5 py-2 border border-border/40 rounded"
 >
 Today
 </button>
 )}
 </div>

 {/* View selection chips */}
 <div className="flex gap-1.5 select-none">
 {FILTER_OPTIONS.map((f) => {
 const isActive = activeFilter === f;
 return (
 <button
 key={f}
 onClick={() => setActiveFilter(f)}
 className={`px-3 py-2.5 rounded-lg border text-base font-semibold transition-all ${
 isActive
 ?"bg-primary border-slate-900 text-white shadow-sm"
 :"bg-white border-border/60 [#12121a] text-text-tertiary hover:text-slate-850 :text-white"
 }`}
 >
 {f}
 </button>
 );
 })}
 </div>
 </div>

 {/* 4. Timeline list */}
 <section className="space-y-4">
 <SaaSDataTable
 headers={["Scheduled Time","Patient Name","Home Service","Location","Status"]}
 data={filtered}
 renderRow={(b) => (
 <tr key={b.id} className="hover:bg-bg-alt/40 :bg-primary/10 transition-colors">
 <td className="px-6 py-4.5 font-bold text-primary">{b.timeSlot || b.time}</td>
 <td className="px-6 py-4.5 font-bold text-primary">
 {b.patientName || PATIENT_NAMES[b.patientId] || b.patientId}
 </td>
 <td className="px-6 py-4.5 font-semibold text-primary">
 {b.serviceName || derivedService(b.id)}
 </td>
 <td className="px-6 py-4.5 font-medium text-text-tertiary flex items-center gap-1">
 <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
 <span>{b.address ? b.address.city : derivedLocation(b.id)}</span>
 </td>
 <td className="px-6 py-4.5">
 <StatusBadge status={b.status} type={getBadgeType(b.status)} />
 </td>
 </tr>
 )}
 emptyState={
 <EmptyState
 title="No visits scheduled"
 description="No care assignments mapped to this select schedule block."
 icon={<Inbox className="w-5 h-5" />}
 />
 }
 />
 </section>
 </div>
 );
}
