"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import {
 ClipboardList, CheckCircle2, CircleCheck, XCircle,
 ExternalLink, UserPlus, Ban, Clock,
} from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SearchInput from"@/components/dashboard/SearchInput";
import EmptyState from"@/components/dashboard/EmptyState";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { bookingService } from"@/lib/services/booking.service";
import { Booking, BookingStatus } from"@/types/booking";

// ── Deterministic helpers to enrich the minimal Booking model ────────────────

const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta",
"patient-2":"Priya Sharma",
"patient-3":"Ravi Nair",
"patient-4":"Sunita Das",
};
function patientName(id: string): string {
 return PATIENT_NAMES[id] ??`Patient ${id.slice(-3).toUpperCase()}`;
}

const SERVICES = [
"Home Nursing Care",
"Physiotherapy",
"Doctor Visit",
"Caregiver Support",
"Elder Care",
"Post-Surgery Recovery",
];
function derivedService(id: string): string {
 const n = parseInt(id.replace(/\D/g,"0").slice(-2), 10);
 return SERVICES[n % SERVICES.length];
}

const PROFESSIONAL_NAMES = [
"Dr. Anita Rao",
"Nurse Kavya",
"Mr. Ravi Physio",
"Caregiver Sunita",
"Unassigned",
];
function derivedProfessional(providerId: string): string {
 const n = parseInt(providerId.replace(/\D/g,"1").slice(-1), 10);
 return PROFESSIONAL_NAMES[n % PROFESSIONAL_NAMES.length];
}

function bookingRef(id: string): string {
 return`BK-${id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`;
}

// ── Filter option sets ────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
 { label:"All Statuses", value:"" },
 { label:"Pending", value: BookingStatus.Pending },
 { label:"Confirmed", value: BookingStatus.Confirmed },
 { label:"Completed", value: BookingStatus.Completed },
 { label:"Cancelled", value: BookingStatus.Cancelled },
];

const SERVICE_OPTIONS = [
 { label:"All Services", value:"" },
 ...SERVICES.map((s) => ({ label: s, value: s })),
];

const DATE_OPTIONS = [
 { label:"All Dates", value:"" },
 { label:"Today", value:"today" },
 { label:"This Week", value:"week" },
 { label:"This Month", value:"month" },
];

const PROVIDER_OPTIONS = [
 { label:"All Providers", value:"" },
 ...PROFESSIONAL_NAMES.map((n) => ({ label: n, value: n })),
];

// ── Status badge styles & icons ───────────────────────────────────────────────

const STATUS_META: Record<
 string,
 { label: string; bg: string; icon: React.ReactNode }
> = {
 [BookingStatus.Pending]: {
 label:"Pending",
 bg:"bg-bg text-accent-light border-amber-100",
 icon: <Clock className="w-3 h-3" />,
 },
 [BookingStatus.Confirmed]: {
 label:"Confirmed",
 bg:"bg-bg text-secondary border-blue-100",
 icon: <CheckCircle2 className="w-3 h-3" />,
 },
 [BookingStatus.Completed]: {
 label:"Completed",
 bg:"bg-accent-light text-accent border-emerald-100",
 icon: <CircleCheck className="w-3 h-3" />,
 },
 [BookingStatus.Cancelled]: {
 label:"Cancelled",
 bg:"bg-rose-50 text-rose-700 border-rose-100",
 icon: <XCircle className="w-3 h-3" />,
 },
};

// ── Inline filter select ──────────────────────────────────────────────────────

function FilterSelect({
 options,
 value,
 onChange,
}: {
 options: { label: string; value: string }[];
 value: string;
 onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
 return (
 <select
 value={value}
 onChange={onChange}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none transition-all focus:border-accent-light focus:ring-2 focus:ring-accent/20 text-text-secondary font-semibold"
 >
 {options.map((o) => (
 <option key={o.value} value={o.value}>
 {o.label}
 </option>
 ))}
 </select>
 );
}

// ── Extended type ─────────────────────────────────────────────────────────────

interface EnrichedBooking extends Booking {
 reference: string;
 patientName: string;
 service: string;
 professional: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgencyBookingRequestsPage() {
 const router = useRouter();
 const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [serviceFilter, setServiceFilter] = useState("");
 const [dateFilter, setDateFilter] = useState("");
 const [providerFilter, setProviderFilter] = useState("");

 useEffect(() => {
 setLoading(true);
 bookingService
 .getBookings()
 .then((data) => {
 const enriched: EnrichedBooking[] = data.map((b) => ({
 ...b,
 reference: bookingRef(b.id),
 patientName: patientName(b.patientId),
 service: derivedService(b.id),
 professional: derivedProfessional(b.providerId),
 }));
 setBookings(enriched);
 })
 .catch((err) => console.error("Error loading bookings:", err))
 .finally(() => setLoading(false));
 }, []);

 // ── Summary counts ────────────────────────────────────────────────────────
 const pending = bookings.filter((b) => b.status === BookingStatus.Pending).length;
 const confirmed = bookings.filter((b) => b.status === BookingStatus.Confirmed).length;
 const completed = bookings.filter((b) => b.status === BookingStatus.Completed).length;
 const cancelled = bookings.filter((b) => b.status === BookingStatus.Cancelled).length;

 const summaryCards = [
 { label:"Pending Requests", value: pending, icon: <Clock className="w-5 h-5" />, color:"text-accent-light bg-bg" },
 { label:"Confirmed", value: confirmed, icon: <CheckCircle2 className="w-5 h-5" />, color:"text-secondary bg-bg" },
 { label:"Completed", value: completed, icon: <CircleCheck className="w-5 h-5" />, color:"text-accent bg-accent-light" },
 { label:"Cancelled", value: cancelled, icon: <XCircle className="w-5 h-5" />, color:"text-rose-600 bg-rose-50" },
 ];

 // ── Filtered list ─────────────────────────────────────────────────────────
 const filtered = useMemo(() => {
 return bookings.filter((b) => {
 const q = search.toLowerCase();
 const matchSearch =
 !q ||
 b.reference.toLowerCase().includes(q) ||
 b.patientName.toLowerCase().includes(q) ||
 b.service.toLowerCase().includes(q);
 const matchStatus = !statusFilter || b.status === statusFilter;
 const matchService = !serviceFilter || b.service === serviceFilter;
 const matchProvider = !providerFilter || b.professional === providerFilter;
 // Date filter is UI-only (no date range filtering on mock data)
 return matchSearch && matchStatus && matchService && matchProvider;
 });
 }, [bookings, search, statusFilter, serviceFilter, providerFilter]);

 const hasActiveFilters = !!(search || statusFilter || serviceFilter || dateFilter || providerFilter);

 const clearFilters = () => {
 setSearch("");
 setStatusFilter("");
 setServiceFilter("");
 setDateFilter("");
 setProviderFilter("");
 };

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
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/agency/dashboard" },
 { label:"Booking Requests" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Booking Requests"
 description="Review and manage incoming booking requests."
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

 <DashboardCard className="p-8 space-y-4">
 {/* 4. Search Bar */}
 <SearchInput
 placeholder="Search by booking reference, patient or service"
 className="max-w-sm"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />

 {/* 5. Filter Row */}
 <div className="flex flex-wrap gap-6 items-center">
 <span className="text-base font-extrabold text-text-tertiary uppercase tracking-wider mr-1">
 Filter:
 </span>
 <FilterSelect
 options={STATUS_OPTIONS}
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 />
 <FilterSelect
 options={SERVICE_OPTIONS}
 value={serviceFilter}
 onChange={(e) => setServiceFilter(e.target.value)}
 />
 <FilterSelect
 options={DATE_OPTIONS}
 value={dateFilter}
 onChange={(e) => setDateFilter(e.target.value)}
 />
 <FilterSelect
 options={PROVIDER_OPTIONS}
 value={providerFilter}
 onChange={(e) => setProviderFilter(e.target.value)}
 />
 {hasActiveFilters && (
 <button
 onClick={clearFilters}
 className="text-base font-extrabold text-accent-light hover:text-accent-light px-3 py-2 rounded-lg hover:bg-bg :bg-orange-950/20 transition-colors"
 >
 Clear all
 </button>
 )}
 </div>

 {/* 6. Table / 7. Empty State */}
 {filtered.length === 0 ? (
 <EmptyState
 icon={<ClipboardList className="w-5 h-5" />}
 title="No booking requests"
 description="Booking requests will appear here when patients submit bookings."
 buttonLabel="Back to Dashboard"
 buttonLink="/agency/dashboard"
 />
 ) : (
 <>
 {/* ── Desktop / Tablet: scrollable table ── */}
 <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {[
"Reference",
"Patient",
"Service",
"Date",
"Time",
"Assigned Professional",
"Status",
"Actions",
 ].map((h) => (
 <th
 key={h}
 className="px-5 py-4 text-sm uppercase tracking-wider font-extrabold text-text-tertiary whitespace-nowrap"
 >
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {filtered.map((b) => {
 const meta = STATUS_META[b.status];
 return (
 <tr
 key={b.id}
 className="hover:bg-bg-alt/50 :bg-primary/40 transition-colors group"
 >
 {/* Reference */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="font-extrabold text-accent-light text-base font-mono">
 {b.reference}
 </span>
 </td>
 {/* Patient */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="font-bold text-primary text-base">
 {b.patientName}
 </span>
 <p className="text-sm text-text-tertiary font-medium mt-0.5">
 ID: {b.patientId}
 </p>
 </td>
 {/* Service */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="px-3 py-2 rounded-lg bg-bg-alt text-text-secondary font-bold text-sm uppercase tracking-wide">
 {b.service}
 </span>
 </td>
 {/* Date */}
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">
 {b.date}
 </td>
 {/* Time */}
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">
 {b.time}
 </td>
 {/* Professional */}
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold text-base">
 {b.professional}
 </td>
 {/* Status */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span
 className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-extrabold uppercase tracking-wide ${meta?.bg}`}
 >
 {meta?.icon}
 {meta?.label}
 </span>
 </td>
 {/* Actions */}
 <td className="px-5 py-4 whitespace-nowrap">
 <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() =>
 router.push(`/agency/booking-requests/${b.id}`)
 }
 title="View Details"
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg text-accent-light hover:bg-bg :bg-orange-950/40 transition-colors border border-orange-100"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </button>
 <button
 title="Assign Professional"
 disabled
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-alt text-text-tertiary transition-colors border border-border opacity-60 cursor-not-allowed"
 >
 <UserPlus className="w-3.5 h-3.5" />
 </button>
 <button
 title="Cancel Booking"
 disabled
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-400 transition-colors border border-rose-100 opacity-60 cursor-not-allowed"
 >
 <Ban className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>

 {/* ── Mobile: card layout ── */}
 <div className="sm:hidden space-y-3">
 {filtered.map((b) => {
 const meta = STATUS_META[b.status];
 return (
 <div
 key={b.id}
 className="bg-white border border-border rounded-[20px] p-6 space-y-3"
 >
 {/* Header row */}
 <div className="flex items-start justify-between gap-6">
 <div>
 <p className="font-extrabold text-accent-light text-base font-mono">
 {b.reference}
 </p>
 <p className="font-bold text-base text-primary mt-0.5">
 {b.patientName}
 </p>
 </div>
 <span
 className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-extrabold uppercase shrink-0 ${meta?.bg}`}
 >
 {meta?.icon}
 {meta?.label}
 </span>
 </div>

 {/* Detail grid */}
 <div className="grid grid-cols-2 gap-6 text-base">
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Service</p>
 <p className="text-text-secondary font-semibold mt-0.5">{b.service}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Date</p>
 <p className="text-text-secondary font-semibold mt-0.5">{b.date}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Time</p>
 <p className="text-text-secondary font-semibold mt-0.5">{b.time}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Professional</p>
 <p className="text-text-secondary font-semibold mt-0.5">{b.professional}</p>
 </div>
 </div>

 {/* Actions */}
 <div className="flex gap-6 pt-1 border-t border-border-light">
 <button
 onClick={() =>
 router.push(`/agency/booking-requests/${b.id}`)
 }
 className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-base font-extrabold text-accent-light bg-bg border border-orange-100 hover:bg-bg transition-colors"
 >
 <ExternalLink className="w-3 h-3" />
 View Details
 </button>
 <SecondaryButton
 type="button"
 disabled
 className="flex-1 text-base py-2 opacity-50 cursor-not-allowed flex items-center justify-center gap-1"
 >
 <UserPlus className="w-3 h-3" /> Assign
 </SecondaryButton>
 </div>
 </div>
 );
 })}
 </div>

 {/* Row count */}
 <p className="text-base text-text-tertiary font-bold">
 Showing {filtered.length} of {bookings.length} booking request
 {bookings.length !== 1 ?"s" :""}
 </p>
 </>
 )}
 </DashboardCard>
 </div>
 );
}
