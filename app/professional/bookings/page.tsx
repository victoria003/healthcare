"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import { CalendarDays, Clock, CheckCircle2, AlertCircle, ExternalLink, Search } from"lucide-react";
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
const BOOKING_TYPES = ["Home Visit","Follow-up","Consultation","Home Visit","Follow-up","Consultation"];

function derivedService(id: string) { return SERVICES[parseInt(id.replace(/\D/g,"0").slice(-2),10)%SERVICES.length]; }
function derivedLocation(id: string) { return LOCATIONS[parseInt(id.replace(/\D/g,"0").slice(-1),10)%LOCATIONS.length]; }
function derivedType(id: string) { return BOOKING_TYPES[parseInt(id.replace(/\D/g,"0").slice(-1),10)%BOOKING_TYPES.length]; }
function bookingRef(id: string) { return`BK-${id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`; }

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

function FilterSelect({ options, value, onChange }: { options:{label:string;value:string}[]; value:string; onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void }) {
 return (
 <select value={value} onChange={onChange} className="px-3 py-2.5 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none cursor-pointer text-text-secondary font-semibold transition-all">
 {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
 </select>
 );
}

export default function ProfessionalBookingsPage() {
 const router = useRouter();
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [serviceFilter, setServiceFilter] = useState("");
 const [typeFilter, setTypeFilter] = useState("");

 useEffect(() => {
 Promise.all([bookingService.getBookings(), providerService.getProviders()])
 .then(([bks]) => setBookings(bks || []))
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 const assigned = bookings.length;
 const todayCount = bookings.filter((b) => b.status !== BookingStatus.Cancelled).length;
 const completed = bookings.filter((b) => b.status === BookingStatus.Completed).length;
 const pending = bookings.filter((b) => b.status === BookingStatus.Pending).length;

 const filtered = useMemo(() => {
 return bookings.filter((b) => {
 const q = search.toLowerCase();
 const ref = bookingRef(b.id).toLowerCase();
 const svc = (b.serviceName || derivedService(b.id)).toLowerCase();
 const name = (PATIENT_NAMES[b.patientId] || b.patientName ||"").toLowerCase();
 const matchSearch = !q || ref.includes(q) || name.includes(q) || svc.includes(q);
 const matchStatus = !statusFilter || String(b.status).toLowerCase() === statusFilter.toLowerCase();
 const matchService = !serviceFilter || (b.serviceName || derivedService(b.id)) === serviceFilter;
 const matchType = !typeFilter || derivedType(b.id) === typeFilter;
 return matchSearch && matchStatus && matchService && matchType;
 });
 }, [bookings, search, statusFilter, serviceFilter, typeFilter]);

 const hasFilters = !!(search || statusFilter || serviceFilter || typeFilter);
 const clearFilters = () => { setSearch(""); setStatusFilter(""); setServiceFilter(""); setTypeFilter(""); };

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
 title="Assigned Bookings"
 description="Review all clinical consultations and scheduling appointments allocated to your profile."
 />

 {/* 2. Metrics Rows */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {[
 { label:"Assigned Bookings", val: assigned },
 { label:"Active Visits", val: todayCount },
 { label:"Completed", val: completed },
 { label:"Pending Requests", val: pending }
 ].map((card, idx) => (
 <CleanCard key={idx} className="!p-8 flex flex-col justify-between">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block mb-2">{card.label}</span>
 <span className="text-2xl font-bold text-primary leading-none">{card.val}</span>
 </CleanCard>
 ))}
 </div>

 {/* 3. Search and Filters Selection */}
 <div className="space-y-4">
 <div className="flex flex-col sm:flex-row gap-6">
 <div className="relative flex-1 max-w-sm">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
 <input
 type="text"
 placeholder="Search reference, patient or service..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none focus:border-border :border-border-light text-primary transition-all"
 />
 </div>

 <div className="flex flex-wrap gap-6 items-center">
 <FilterSelect options={STATUS_OPTIONS} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
 <FilterSelect options={SERVICE_OPTIONS} value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} />
 {hasFilters && (
 <button
 onClick={clearFilters}
 className="text-sm font-bold text-slate-555 hover:text-primary :text-white px-3 py-2.5 transition-colors"
 >
 Clear all
 </button>
 )}
 </div>
 </div>
 </div>

 {/* 4. Table list */}
 <section className="space-y-4">
 <SaaSDataTable
 headers={["Reference","Patient Name","Service Rendered","Scheduled Date","Time Slot","Status","Actions"]}
 data={filtered}
 renderRow={(b) => (
 <tr key={b.id} className="hover:bg-bg-alt/40 :bg-primary/10 transition-colors">
 <td className="px-6 py-4.5 font-mono text-text-tertiary font-semibold">{bookingRef(b.id)}</td>
 <td className="px-6 py-4.5 font-bold text-primary">
 {b.patientName || PATIENT_NAMES[b.patientId] || b.patientId}
 </td>
 <td className="px-6 py-4.5 font-semibold text-primary">
 {b.serviceName || derivedService(b.id)}
 </td>
 <td className="px-6 py-4.5 font-medium text-text-tertiary">{b.date}</td>
 <td className="px-6 py-4.5 font-bold text-primary">{b.timeSlot || b.time}</td>
 <td className="px-6 py-4.5">
 <StatusBadge status={b.status} type={getBadgeType(b.status)} />
 </td>
 <td className="px-6 py-4.5">
 <button
 onClick={() => router.push(`/professional/bookings/${b.id}`)}
 className="p-1 border border-border/60 hover:bg-bg-alt :bg-primary rounded text-text-secondary transition-colors"
 title="View Details"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </button>
 </td>
 </tr>
 )}
 emptyState={
 <EmptyState
 title="No matching bookings"
 description="No assigned visits align with the active filter parameters."
 action={{ label:"Reset Filters", onClick: clearFilters }}
 />
 }
 />
 </section>
 </div>
 );
}
