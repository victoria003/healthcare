"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import {
 CalendarDays, Star, ShieldCheck, Bell,
 Clock, MapPin, ChevronRight, Stethoscope, ArrowRight,
} from"lucide-react";
import { PageHeader, CleanCard, StatusBadge, EmptyState } from"@/components/DesignSystem";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import { bookingService } from"@/lib/services/booking.service";
import { Booking, BookingStatus } from"@/types/booking";

export default function ProfessionalDashboardPage() {
 const router = useRouter();
 const [professional, setProfessional] = useState<MockProfessional | undefined>(undefined);
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 Promise.all([providerService.getProviders(), bookingService.getBookings()])
 .then(([providers, bks]) => {
 setProfessional(providers.find(p => p.id ==="u-3") || providers[0]);
 setBookings(bks || []);
 })
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 const today = bookings.filter((b) => b.status !== BookingStatus.Cancelled);
 const upcoming = bookings.filter((b) => b.status === BookingStatus.Confirmed || b.status === BookingStatus.Pending);
 const completed = bookings.filter((b) => b.status === BookingStatus.Completed);
 const rating = professional?.rating ?? 4.9;

 const recentPatients = [
 { id:"u-1", name:"Ankala Victoria Rani", lastVisit:"2026-07-15", service:"ICU Nurse Care Support" }
 ];

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900" />
 </div>
 );
 }

 const getBadgeType = (status: BookingStatus) => {
 if (status === BookingStatus.Confirmed || status === BookingStatus.Completed) return"success";
 if (status === BookingStatus.Pending) return"warning";
 if (status === BookingStatus.Cancelled) return"error";
 return"neutral";
 };

 return (
 <div className="w-full space-y-8">
 {/* 1. Page Header */}
 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
 <div className="space-y-1">
 <div className="flex items-center gap-6">
 <h1 className="text-2xl font-bold tracking-tight text-primary">
 Welcome, {professional?.fullName ||"Priya Sharma, RN"}
 </h1>
 {professional?.verified && (
 <span className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-full bg-bg-alt border border-border/50 text-base font-bold text-text-secondary uppercase tracking-wider">
 Verified Provider
 </span>
 )}
 </div>
 <p className="text-sm text-slate-555 font-medium">
 Category: {professional?.category} &middot; Organization: {professional?.organization}
 </p>
 </div>

 <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent-light text-accent border border-emerald-100/50 rounded-full text-sm font-semibold">
 <span className="w-1.5 h-1.5 rounded-full bg-accent" />
 Active Status
 </span>
 </div>

 {/* 2. Key Metrics Stats Cards */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {[
 { label:"Today's Visits", val: today.length },
 { label:"Upcoming Appointments", val: upcoming.length },
 { label:"Completed Visits", val: completed.length },
 { label:"Average Rating", val:`${rating.toFixed(1)} / 5.0`},
 ].map((card, idx) => (
 <CleanCard key={idx} className="!p-8 flex flex-col justify-between">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block mb-2">{card.label}</span>
 <span className="text-2xl font-bold text-primary leading-none">{card.val}</span>
 </CleanCard>
 ))}
 </div>

 {/* 3. Schedule & Activity Columns */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* Today's Schedule (Left column) */}
 <section className="lg:col-span-7 space-y-4">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Today&apos;s Appointments</span>
 {today.length > 0 ? (
 <div className="space-y-3">
 {today.map((b) => (
 <CleanCard key={b.id} className="hover:border-slate-350 :border-border-light transition-colors">
 <div className="flex items-center justify-between gap-6">
 <div className="space-y-2">
 <div className="flex items-center gap-6">
 <StatusBadge status={b.status} type={getBadgeType(b.status)} />
 <span className="text-base font-bold text-slate-455">#{b.id}</span>
 </div>
 <h4 className="text-sm font-bold text-primary">{b.serviceName ||"Nursing Care Support"}</h4>
 <p className="text-base text-text-tertiary font-medium">
 Patient: {b.patientName ||"Ankala Victoria Rani"} &middot; {b.timeSlot || b.time}
 </p>
 </div>

 <button
 onClick={() => router.push(`/professional/bookings`)}
 className="px-3 py-2.5 border border-border/60 hover:bg-bg-alt :bg-primary rounded-lg text-sm font-semibold text-text-secondary transition-colors shrink-0"
 >
 Details
 </button>
 </div>
 </CleanCard>
 ))}
 </div>
 ) : (
 <CleanCard>
 <EmptyState
 title="No appointments scheduled for today"
 description="You are currently free. Check back later for update notifications."
 icon={<CalendarDays className="w-5 h-5" />}
 />
 </CleanCard>
 )}
 </section>

 {/* Recent Patients (Right column) */}
 <section className="lg:col-span-5 space-y-4">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Active Patients</span>
 <CleanCard className="space-y-4">
 <div className="divide-y divide-slate-100">
 {recentPatients.map((p) => (
 <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
 <div className="space-y-1">
 <span className="text-sm font-bold text-slate-850 block">{p.name}</span>
 <span className="text-base text-slate-450 block">
 Last visit: {p.lastVisit} &middot; {p.service}
 </span>
 </div>
 <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
 </div>
 ))}
 </div>
 </CleanCard>
 </section>
 </div>
 </div>
 );
}
