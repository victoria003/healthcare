"use client";

import React, { useState, useEffect, useMemo } from"react";
import {
 CalendarDays, Users, UserCheck, UserX,
 ChevronLeft, ChevronRight, Clock,
 CheckCircle2, CircleCheck, XCircle,
} from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import EmptyState from"@/components/dashboard/EmptyState";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { bookingService } from"@/lib/services/booking.service";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta",
"patient-2":"Priya Sharma",
"patient-3":"Ravi Nair",
"patient-4":"Sunita Das",
};
const SERVICES = [
"Home Nursing","Physiotherapy","Doctor Visit",
"Caregiver Support","Elder Care","Post-Surgery",
];
function derivedService(id: string): string {
 const n = parseInt(id.replace(/\D/g,"0").slice(-2), 10);
 return SERVICES[n % SERVICES.length];
}

const STATUS_META: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
 [BookingStatus.Pending]: {
 label:"Pending",
 bg:"bg-bg text-accent-light",
 icon: <Clock className="w-3 h-3" />,
 },
 [BookingStatus.Confirmed]: {
 label:"Confirmed",
 bg:"bg-bg text-secondary",
 icon: <CheckCircle2 className="w-3 h-3" />,
 },
 [BookingStatus.Completed]: {
 label:"Completed",
 bg:"bg-accent-light text-accent",
 icon: <CircleCheck className="w-3 h-3" />,
 },
 [BookingStatus.Cancelled]: {
 label:"Cancelled",
 bg:"bg-rose-50 text-rose-700",
 icon: <XCircle className="w-3 h-3" />,
 },
};

const MONTH_NAMES = [
"January","February","March","April","May","June",
"July","August","September","October","November","December",
];

function getDaysInMonth(year: number, month: number): number {
 return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number): number {
 return new Date(year, month, 1).getDay();
}

// ── Enriched booking ──────────────────────────────────────────────────────────
interface CalendarBooking extends Booking {
 patientName: string;
 service: string;
 professionalName: string;
 day: number; // parsed day from date string
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AgencyCalendarPage() {
 const today = new Date();
 const [year, setYear] = useState(today.getFullYear());
 const [month, setMonth] = useState(today.getMonth());
 const [view, setView] = useState<"Month" |"Week" |"Day">("Month");
 const [bookings, setBookings] = useState<CalendarBooking[]>([]);
 const [providers, setProviders] = useState<MockProfessional[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 setLoading(true);
 Promise.all([bookingService.getBookings(), providerService.getProviders()])
 .then(([bks, provs]) => {
 setProviders(provs);
 const enriched: CalendarBooking[] = bks.map((b) => {
 const pro = provs.find((p) => p.id === b.providerId);
 const parts = b.date.split("-");
 const day = parts.length === 3 ? parseInt(parts[2], 10) : today.getDate();
 return {
 ...b,
 patientName: PATIENT_NAMES[b.patientId] ??`Patient ${b.patientId}`,
 service: derivedService(b.id),
 professionalName: pro?.fullName ??"Unassigned",
 day,
 };
 });
 setBookings(enriched);
 })
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 // ── Summary counts ────────────────────────────────────────────────────────
 const todayBookings = bookings.filter((b) => b.day === today.getDate()).length;
 const weekBookings = bookings.length; // all are"this week" in mock
 const available = providers.filter((p) => p.availability?.toLowerCase().includes("available")).length;
 const busy = providers.length - available;

 const summaryCards = [
 { label:"Today's Bookings", value: todayBookings, icon: <CalendarDays className="w-5 h-5" />, color:"text-accent-light bg-bg" },
 { label:"This Week", value: weekBookings, icon: <CalendarDays className="w-5 h-5" />, color:"text-secondary bg-bg" },
 { label:"Available Professionals",value: available, icon: <UserCheck className="w-5 h-5" />, color:"text-accent bg-accent-light" },
 { label:"Busy Professionals", value: busy, icon: <UserX className="w-5 h-5" />, color:"text-rose-600 bg-rose-50" },
 ];

 // ── Calendar grid ─────────────────────────────────────────────────────────
 const daysInMonth = getDaysInMonth(year, month);
 const firstDayOfMonth = getFirstDayOfMonth(year, month);
 const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

 const bookingsByDay = useMemo(() => {
 const map: Record<number, CalendarBooking[]> = {};
 bookings.forEach((b) => {
 if (!map[b.day]) map[b.day] = [];
 map[b.day].push(b);
 });
 return map;
 }, [bookings]);

 const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
 const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 return (
 <div className="space-y-6 max-w-7xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb items={[{ label:"Dashboard", href:"/agency/dashboard" }, { label:"Calendar" }]} />

 {/* 2. Page Header */}
 <SectionHeader
 title="Calendar"
 description="View upcoming bookings and professional schedules."
 />

 {/* 3. Summary Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {summaryCards.map((card) => (
 <DashboardCard key={card.label} className="p-8 flex items-center gap-6">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
 {card.icon}
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{card.value}</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">{card.label}</p>
 </div>
 </DashboardCard>
 ))}
 </div>

 {/* 4. Calendar Controls */}
 <DashboardCard className="p-6 flex flex-wrap items-center justify-between gap-6">
 <div className="flex items-center gap-6">
 <button
 onClick={prevMonth}
 className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-secondary hover:bg-bg-alt :bg-primary transition-colors"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <h3 className="text-base font-extrabold text-primary min-w-[140px] text-center">
 {MONTH_NAMES[month]} {year}
 </h3>
 <button
 onClick={nextMonth}
 className="w-8 h-8 flex items-center justify-center rounded-xl border border-border text-text-secondary hover:bg-bg-alt :bg-primary transition-colors"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 <div className="flex items-center gap-1 bg-bg-alt rounded-xl p-1">
 {(["Month","Week","Day"] as const).map((v) => (
 <button
 key={v}
 onClick={() => setView(v)}
 className={`px-3 py-2.5 rounded-lg text-base font-extrabold transition-all ${
 view === v
 ?"bg-white text-accent-light shadow-sm"
 :"text-text-tertiary hover:text-text-secondary :text-white"
 }`}
 >
 {v}
 </button>
 ))}
 </div>
 </DashboardCard>

 {/* 5. Calendar View */}
 {bookings.length === 0 ? (
 <EmptyState
 icon={<CalendarDays className="w-5 h-5" />}
 title="No scheduled bookings"
 description="Upcoming bookings will appear here."
 buttonLabel="Booking Requests"
 buttonLink="/agency/booking-requests"
 />
 ) : (
 <>
 {/* ── Desktop/Tablet: Month grid ── */}
 <DashboardCard className="p-6 hidden sm:block">
 {/* Day headers */}
 <div className="grid grid-cols-7 mb-2">
 {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
 <div key={d} className="text-center text-sm font-extrabold uppercase tracking-wider text-text-tertiary py-2">
 {d}
 </div>
 ))}
 </div>
 {/* Day cells */}
 <div className="grid grid-cols-7 gap-px bg-bg-alt rounded-xl overflow-hidden border border-border-light">
 {Array.from({ length: totalCells }).map((_, idx) => {
 const dayNum = idx - firstDayOfMonth + 1;
 const isValidDay = dayNum >= 1 && dayNum <= daysInMonth;
 const isToday = isValidDay && dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
 const dayBookings = isValidDay ? (bookingsByDay[dayNum] ?? []) : [];

 return (
 <div
 key={idx}
 className={`min-h-[80px] p-1.5 bg-white ${!isValidDay ?"opacity-30" :""}`}
 >
 <div className={`text-base font-extrabold w-6 h-6 flex items-center justify-center rounded-lg mb-1 ${
 isToday
 ?"bg-accent-light text-white"
 :"text-text-secondary"
 }`}>
 {isValidDay ? dayNum :""}
 </div>
 <div className="space-y-0.5">
 {dayBookings.slice(0, 2).map((b) => {
 const m = STATUS_META[b.status];
 return (
 <div
 key={b.id}
 className={`text-[8px] font-bold px-1.5 py-2.5 rounded-md truncate ${m?.bg}`}
 >
 {b.time} · {b.patientName}
 </div>
 );
 })}
 {dayBookings.length > 2 && (
 <div className="text-[8px] font-extrabold text-text-tertiary px-1">
 +{dayBookings.length - 2} more
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </DashboardCard>

 {/* ── Mobile: Agenda list ── */}
 <div className="sm:hidden space-y-3">
 {bookings.map((b) => {
 const m = STATUS_META[b.status];
 return (
 <DashboardCard key={b.id} className="p-6 space-y-2">
 <div className="flex items-start justify-between gap-6">
 <div>
 <p className="font-extrabold text-base text-primary">{b.patientName}</p>
 <p className="text-base text-text-tertiary font-bold">{b.service}</p>
 </div>
 <span className={`inline-flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm font-extrabold shrink-0 ${m?.bg}`}>
 {m?.icon} {m?.label}
 </span>
 </div>
 <div className="flex flex-wrap gap-6 text-base text-text-tertiary font-semibold">
 <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{b.date}</span>
 <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.time}</span>
 <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.professionalName}</span>
 </div>
 </DashboardCard>
 );
 })}
 </div>

 {/* 6. Upcoming Schedule */}
 <DashboardCard className="p-8 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Upcoming Schedule</h3>
 <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {["Time","Patient","Professional","Service","Status"].map((h) => (
 <th key={h} className="px-5 py-4 text-sm uppercase tracking-wider font-extrabold text-text-tertiary whitespace-nowrap">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {bookings.map((b) => {
 const m = STATUS_META[b.status];
 return (
 <tr key={b.id} className="hover:bg-bg-alt/50 :bg-primary/40 transition-colors">
 <td className="px-5 py-4 whitespace-nowrap font-semibold text-text-secondary">{b.time}</td>
 <td className="px-5 py-4 whitespace-nowrap font-bold text-primary">{b.patientName}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{b.professionalName}</td>
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="px-3 py-2 rounded-lg bg-bg-alt text-text-secondary font-bold text-sm uppercase">{b.service}</span>
 </td>
 <td className="px-5 py-4 whitespace-nowrap">
 <span className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-extrabold ${m?.bg}`}>
 {m?.icon}{m?.label}
 </span>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>

 {/* Mobile upcoming list */}
 <div className="sm:hidden space-y-2">
 {bookings.map((b) => {
 const m = STATUS_META[b.status];
 return (
 <div key={b.id} className="flex items-center gap-6 py-2 border-b border-border-light last:border-0">
 <div className="text-base font-bold text-text-tertiary w-16 shrink-0">{b.time}</div>
 <div className="flex-1 min-w-0">
 <p className="font-bold text-sm text-primary truncate">{b.patientName}</p>
 <p className="text-sm text-text-tertiary">{b.professionalName} · {b.service}</p>
 </div>
 <span className={`inline-flex items-center gap-0.5 px-3 py-2.5 rounded-lg text-[8px] font-extrabold shrink-0 ${m?.bg}`}>
 {m?.icon}{m?.label}
 </span>
 </div>
 );
 })}
 </div>
 </DashboardCard>

 <div className="flex justify-end">
 <SecondaryButton type="button" onClick={() => window.history.back()} className="text-base">
 Back to Dashboard
 </SecondaryButton>
 </div>
 </>
 )}
 </div>
 );
}
