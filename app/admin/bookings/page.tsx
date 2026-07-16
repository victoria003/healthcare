"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import { CalendarDays, Clock, CheckCircle2, AlertCircle, Eye, Building2 } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SearchInput from"@/components/dashboard/SearchInput";
import EmptyState from"@/components/dashboard/EmptyState";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta",
"patient-2":"Priya Sharma",
"patient-3":"Ravi Nair",
"patient-4":"Sunita Das",
};

const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];

export default function AdminBookingsPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [bookingsList, setBookingsList] = useState<any[]>([]);

 // Search & Filters state
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [serviceFilter, setServiceFilter] = useState("");
 const [dateFilter, setDateFilter] = useState("");
 const [agencyFilter, setAgencyFilter] = useState("");

 useEffect(() => {
 Promise.all([
 bookingService.getBookings(),
 providerService.getProviders(),
 ])
 .then(([bookings, providers]) => {
 const enriched = bookings.map((b) => {
 const pro = providers.find((p) => p.id === b.providerId);
 const serviceName = SERVICES[parseInt(b.id.replace(/\D/g,"0").slice(-2), 10) % SERVICES.length];
 const ref =`BK-${b.id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`;
 return {
 id: b.id,
 ref,
 patientName: PATIENT_NAMES[b.patientId] ??`Patient ${b.patientId}`,
 professionalName: pro?.fullName ??"Unassigned",
 agencyName: pro?.organization ??"Nisarga Health Agency",
 service: serviceName,
 date: b.date,
 time: b.time,
 status: b.status,
 };
 });
 setBookingsList(enriched);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading admin bookings:", err);
 setLoading(false);
 });
 }, []);

 // Summary counts
 const totalCount = bookingsList.length;
 const pendingCount = bookingsList.filter((b) => b.status === BookingStatus.Pending).length;
 const completedCount = bookingsList.filter((b) => b.status === BookingStatus.Completed).length;
 const cancelledCount = bookingsList.filter((b) => b.status === BookingStatus.Cancelled).length;

 const summaryCards = [
 { label:"Total Bookings", value: totalCount, icon: <CalendarDays className="w-5 h-5 text-secondary bg-bg" /> },
 { label:"Pending Bookings", value: pendingCount, icon: <Clock className="w-5 h-5 text-accent-light bg-bg" /> },
 { label:"Completed Bookings", value: completedCount, icon: <CheckCircle2 className="w-5 h-5 text-accent bg-accent-light" /> },
 { label:"Cancelled Bookings", value: cancelledCount, icon: <AlertCircle className="w-5 h-5 text-rose-600 bg-rose-50" /> },
 ];

 // Local filtering & searching
 const filteredBookings = useMemo(() => {
 return bookingsList.filter((b) => {
 const q = search.toLowerCase();
 const matchSearch =
 !q ||
 b.ref.toLowerCase().includes(q) ||
 b.patientName.toLowerCase().includes(q) ||
 b.professionalName.toLowerCase().includes(q);

 const matchStatus = !statusFilter || b.status === statusFilter;
 const matchService = !serviceFilter || b.service === serviceFilter;
 const matchAgency = !agencyFilter || b.agencyName === agencyFilter;

 let matchDate = true;
 if (dateFilter ==="today") {
 matchDate = b.date ==="2026-07-14";
 }

 return matchSearch && matchStatus && matchService && matchAgency && matchDate;
 });
 }, [bookingsList, search, statusFilter, serviceFilter, agencyFilter, dateFilter]);

 const hasFilters = !!(search || statusFilter || serviceFilter || dateFilter || agencyFilter);
 const clearFilters = () => {
 setSearch("");
 setStatusFilter("");
 setServiceFilter("");
 setDateFilter("");
 setAgencyFilter("");
 };

 const getStatusBadge = (status: string) => {
 let classes ="bg-slate-105 text-text-secondary";
 if (status === BookingStatus.Pending) {
 classes ="bg-amber-55 text-amber-705 border border-amber-105";
 } else if (status === BookingStatus.Confirmed) {
 classes ="bg-blue-55 text-blue-705 border border-blue-105";
 } else if (status === BookingStatus.Completed) {
 classes ="bg-emerald-55 text-emerald-705 border border-emerald-105";
 } else if (status === BookingStatus.Cancelled) {
 classes ="bg-rose-55 text-rose-705 border border-rose-105";
 }
 return <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-wide ${classes}`}>{status}</span>;
 };

 // Get unique agencies for filter
 const uniqueAgencies = useMemo(() => {
 return Array.from(new Set(bookingsList.map((b) => b.agencyName)));
 }, [bookingsList]);

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
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Bookings" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Bookings"
 description="View and monitor all platform bookings."
 />

 {/* 3. Booking Summary Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {summaryCards.map((c, i) => (
 <DashboardCard key={i} className="p-8 flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
 {c.icon}
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{c.value}</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">{c.label}</p>
 </div>
 </DashboardCard>
 ))}
 </div>

 <DashboardCard className="p-8 space-y-4">
 {/* 4. Search Bar */}
 <SearchInput
 placeholder="Search by booking reference, patient name or professional name"
 className="max-w-md"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />

 {/* 5. Filter Row */}
 <div className="flex flex-wrap gap-6 items-center">
 <span className="text-base font-extrabold text-text-tertiary uppercase tracking-wider mr-1">Filter:</span>
 
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Statuses</option>
 <option value="Pending">Pending</option>
 <option value="Confirmed">Confirmed</option>
 <option value="In Progress">In Progress</option>
 <option value="Completed">Completed</option>
 <option value="Cancelled">Cancelled</option>
 </select>

 <select
 value={serviceFilter}
 onChange={(e) => setServiceFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Services</option>
 {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
 </select>

 <select
 value={dateFilter}
 onChange={(e) => setDateFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Booking Dates</option>
 <option value="today">Today</option>
 <option value="week">This Week</option>
 <option value="month">This Month</option>
 </select>

 <select
 value={agencyFilter}
 onChange={(e) => setAgencyFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Agencies</option>
 {uniqueAgencies.map(a => <option key={a} value={a}>{a}</option>)}
 </select>

 {hasFilters && (
 <button
 onClick={clearFilters}
 className="text-base font-extrabold text-accent-light hover:text-accent-light px-3 py-2 rounded-lg hover:bg-bg :bg-orange-950/20 transition-colors"
 >
 Clear all
 </button>
 )}
 </div>

 {/* 6. Bookings Table / 7. Empty State */}
 {filteredBookings.length === 0 ? (
 <EmptyState
 icon={<CalendarDays className="w-5 h-5" />}
 title="No bookings found"
 description="No bookings match the selected filters."
 buttonLabel="Back to Dashboard"
 buttonLink="/admin/dashboard"
 />
 ) : (
 <>
 {/* Desktop Table View */}
 <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {["Booking Reference","Patient","Professional","Agency","Service","Booking Date","Booking Time","Status","Action"].map((h) => (
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
 {filteredBookings.map((b) => (
 <tr key={b.id} className="hover:bg-bg-alt/50 :bg-primary/40 transition-colors group">
 <td className="px-5 py-4 whitespace-nowrap font-mono font-extrabold text-accent-light text-base">{b.ref}</td>
 <td className="px-5 py-4 whitespace-nowrap font-bold text-primary">{b.patientName}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{b.professionalName}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-tertiary font-medium">{b.agencyName}</td>
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="px-3 py-2 rounded-lg bg-bg-alt text-text-secondary font-bold text-sm uppercase tracking-wide">
 {b.service}
 </span>
 </td>
 <td className="px-5 py-4 whitespace-nowrap text-slate-550 font-semibold">{b.date}</td>
 <td className="px-5 py-4 whitespace-nowrap text-slate-550 font-semibold">{b.time}</td>
 <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(b.status)}</td>
 <td className="px-5 py-4 whitespace-nowrap">
 <button
 onClick={() => router.push(`/admin/bookings/${b.id}`)}
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg text-accent-light hover:bg-bg border border-orange-100 opacity-0 group-hover:opacity-100 transition-opacity"
 >
 <Eye className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Mobile Cards View */}
 <div className="sm:hidden space-y-3">
 {filteredBookings.map((b) => (
 <div key={b.id} className="bg-white border border-border rounded-[20px] p-6 space-y-3">
 <div className="flex items-start justify-between gap-6">
 <div>
 <p className="font-mono font-extrabold text-base text-accent-light">{b.ref}</p>
 <p className="font-bold text-base text-primary mt-0.5">{b.patientName}</p>
 </div>
 {getStatusBadge(b.status)}
 </div>

 <div className="grid grid-cols-2 gap-6 text-base">
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Professional</p>
 <p className="text-text-secondary font-semibold mt-0.5">{b.professionalName}</p>
 </div>
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
 <p className="text-slate-750 font-semibold mt-0.5">{b.time}</p>
 </div>
 </div>

 <button
 onClick={() => router.push(`/admin/bookings/${b.id}`)}
 className="w-full py-2 rounded-xl text-base font-extrabold text-accent-light bg-bg border border-orange-100 hover:bg-bg transition-colors flex items-center justify-center gap-1"
 >
 <Eye className="w-3.5 h-3.5" /> View Details
 </button>
 </div>
 ))}
 </div>

 <p className="text-base text-text-tertiary font-bold">
 Showing {filteredBookings.length} of {bookingsList.length} booking record{bookingsList.length !== 1 ?"s" :""}
 </p>
 </>
 )}
 </DashboardCard>
 </div>
 );
}
