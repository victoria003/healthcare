"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import {
 Users, ShieldCheck, CalendarCheck, CalendarX2,
 ExternalLink, Edit2, UserX, ChevronRight,
} from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SearchInput from"@/components/dashboard/SearchInput";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import EmptyState from"@/components/dashboard/EmptyState";
import { SelectInputProps } from"@/types/form";
import { providerService, MockProfessional } from"@/lib/services/provider.service";

// ── Deterministic helpers to synthesise fields not in the mock model ──────────
function derivedPhone(id: string) {
 const n = id.replace(/\D/g,"") ||"0";
 const seed = parseInt(n.slice(-4) ||"1234", 10);
 return`+91 ${String(90000 + (seed % 9999)).slice(0, 5)} ${String(10000 + ((seed * 7) % 89999)).slice(0, 5)}`;
}

function derivedEmail(name: string, id: string) {
 const slug = name.toLowerCase().replace(/\s+/g,".");
 return`${slug}.${id.slice(-3)}@healthpro.in`;
}

const STATUSES: ("Active" |"Inactive" |"On Leave")[] = ["Active","Active","Active","Inactive","On Leave"];
function derivedStatus(id: string):"Active" |"Inactive" |"On Leave" {
 const n = id.replace(/\D/g,"") ||"1";
 return STATUSES[parseInt(n.slice(-1), 10) % STATUSES.length];
}

// ── Filter option sets ────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
 { label:"All Categories", value:"" },
 { label:"Doctor", value:"Doctor" },
 { label:"Nurse", value:"Nurse" },
 { label:"Caregiver", value:"Caregiver" },
 { label:"Physiotherapist", value:"Physiotherapist" },
 { label:"Patient Attender", value:"Patient Attender" },
];

const STATUS_OPTIONS = [
 { label:"All Statuses", value:"" },
 { label:"Active", value:"Active" },
 { label:"Inactive", value:"Inactive" },
 { label:"On Leave", value:"On Leave" },
];

const AVAILABILITY_OPTIONS = [
 { label:"All Availability", value:"" },
 { label:"Available", value:"Available" },
 { label:"Busy", value:"Busy" },
 { label:"Unavailable", value:"Unavailable" },
];

const VERIFICATION_OPTIONS = [
 { label:"All Verification", value:"" },
 { label:"Verified", value:"true" },
 { label:"Pending", value:"false" },
];

// ── Inline filter select (avoids SelectInputProps label issue) ────────────────
function FilterSelect({
 options,
 value,
 onChange,
}: Pick<SelectInputProps,"options" |"value" |"onChange">) {
 return (
 <select
 value={value as string}
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

// ── Status / Verification badges ──────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
 Active:"bg-accent-light text-emerald-655 border-emerald-100",
 Inactive:"bg-bg-alt text-text-secondary border-border",
"On Leave":"bg-bg text-amber-655 border-amber-100",
};

const AVAIL_STYLES: Record<string, string> = {
 Available:"bg-accent-light text-emerald-655",
 Busy:"bg-bg text-amber-655",
 Unavailable:"bg-rose-50 text-rose-655",
};

// ── Extended professional type ────────────────────────────────────────────────
interface Professional extends MockProfessional {
 phone: string;
 email: string;
 currentStatus:"Active" |"Inactive" |"On Leave";
}

export default function AgencyProfessionalsPage() {
 const router = useRouter();
 const [professionals, setProfessionals] = useState<Professional[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [categoryFilter, setCategoryFilter] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [availabilityFilter, setAvailabilityFilter] = useState("");
 const [verificationFilter, setVerificationFilter] = useState("");

 useEffect(() => {
 setLoading(true);
 providerService
 .getProviders()
 .then((data) => {
 const enriched: Professional[] = data.map((p) => ({
 ...p,
 phone: derivedPhone(p.id),
 email: derivedEmail(p.fullName, p.id),
 currentStatus: derivedStatus(p.id),
 }));
 setProfessionals(enriched);
 })
 .catch((err) => console.error("Error loading professionals:", err))
 .finally(() => setLoading(false));
 }, []);

 // ── Derived summary counts ──────────────────────────────────────────────────
 const total = professionals.length;
 const verified = professionals.filter((p) => p.verified).length;
 const availableToday = professionals.filter((p) =>
 p.availability?.toLowerCase().includes("available") || p.availability?.toLowerCase().includes("today")
 ).length;
 const unavailable = professionals.filter((p) =>
 !p.availability?.toLowerCase().includes("available")
 ).length;

 // ── Filtered list ───────────────────────────────────────────────────────────
 const filtered = useMemo(() => {
 return professionals.filter((p) => {
 const matchSearch =
 !search ||
 p.fullName.toLowerCase().includes(search.toLowerCase()) ||
 p.category.toLowerCase().includes(search.toLowerCase());
 const matchCategory = !categoryFilter || p.category === categoryFilter;
 const matchStatus = !statusFilter || p.currentStatus === statusFilter;
 const matchAvailability = !availabilityFilter || p.availability === availabilityFilter;
 const matchVerification =
 !verificationFilter || String(p.verified) === verificationFilter;
 return matchSearch && matchCategory && matchStatus && matchAvailability && matchVerification;
 });
 }, [professionals, search, categoryFilter, statusFilter, availabilityFilter, verificationFilter]);

 // ── Summary card data ───────────────────────────────────────────────────────
 const summaryCards = [
 { label:"Total Professionals", value: total, icon: <Users className="w-5 h-5" />, color:"text-accent-light bg-bg" },
 { label:"Verified Professionals", value: verified, icon: <ShieldCheck className="w-5 h-5" />, color:"text-accent bg-accent-light" },
 { label:"Available Today", value: availableToday, icon: <CalendarCheck className="w-5 h-5" />, color:"text-secondary bg-bg" },
 { label:"Unavailable", value: unavailable, icon: <CalendarX2 className="w-5 h-5" />, color:"text-rose-600 bg-rose-50" },
 ];

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
 { label:"Manage Professionals" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Professional Management"
 description="Manage professionals associated with your organization."
 actionButton={
 <PrimaryButton
 type="button"
 className="flex items-center gap-1.5 text-base py-2 px-5 opacity-50 cursor-not-allowed"
 disabled
 >
 <Users className="w-3.5 h-3.5" />
 Add Professional
 </PrimaryButton>
 }
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
 placeholder="Search professionals by name or category"
 className="max-w-sm"
 value={search}
 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
 />

 {/* 5. Filter Row */}
 <div className="flex flex-wrap gap-6 items-center">
 <span className="text-base font-extrabold text-text-tertiary uppercase tracking-wider mr-1">Filter:</span>
 <FilterSelect
 options={CATEGORY_OPTIONS}
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 />
 <FilterSelect
 options={STATUS_OPTIONS}
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 />
 <FilterSelect
 options={AVAILABILITY_OPTIONS}
 value={availabilityFilter}
 onChange={(e) => setAvailabilityFilter(e.target.value)}
 />
 <FilterSelect
 options={VERIFICATION_OPTIONS}
 value={verificationFilter}
 onChange={(e) => setVerificationFilter(e.target.value)}
 />
 {(categoryFilter || statusFilter || availabilityFilter || verificationFilter || search) && (
 <button
 onClick={() => {
 setCategoryFilter("");
 setStatusFilter("");
 setAvailabilityFilter("");
 setVerificationFilter("");
 setSearch("");
 }}
 className="text-base font-extrabold text-accent-light hover:text-accent-light px-3 py-2 rounded-lg hover:bg-bg :bg-orange-950/20 transition-colors"
 >
 Clear all
 </button>
 )}
 </div>

 {/* 6. Professionals Table / 7. Empty State */}
 {filtered.length === 0 ? (
 <EmptyState
 icon={<Users className="w-5 h-5" />}
 title="No professionals found"
 description="Professionals will appear here once they are added."
 buttonLabel="Add Professional"
 buttonLink="#"
 />
 ) : (
 <>
 {/* ── Desktop / Tablet: scrollable table ── */}
 <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {["Professional","Category","Experience","Contact","Availability","Verification","Status","Actions"].map((h) => (
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
 {filtered.map((pro) => (
 <tr
 key={pro.id}
 className="hover:bg-bg-alt/50 :bg-primary/40 transition-colors group"
 >
 {/* Profile Photo + Name */}
 <td className="px-5 py-4 whitespace-nowrap">
 <div className="flex items-center gap-6">
 <div className="w-8 h-8 rounded-xl bg-bg text-accent-light flex items-center justify-center font-black text-base shrink-0 uppercase overflow-hidden border border-orange-100">
 {pro.photo ? (
 <img
 src={pro.photo}
 alt={pro.fullName}
 className="w-full h-full object-cover"
 onError={(e) => {
 (e.target as HTMLImageElement).style.display ="none";
 }}
 />
 ) : (
 pro.fullName.substring(0, 2)
 )}
 </div>
 <span className="font-extrabold text-primary text-base">
 {pro.fullName}
 </span>
 </div>
 </td>
 {/* Category */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="px-3 py-2 rounded-lg bg-bg-alt text-text-secondary font-bold text-sm uppercase tracking-wide">
 {pro.category}
 </span>
 </td>
 {/* Experience */}
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">
 {pro.experience}
 </td>
 {/* Contact */}
 <td className="px-5 py-4">
 <div className="flex flex-col gap-0.5">
 <span className="text-text-secondary font-semibold text-base">{pro.phone}</span>
 <span className="text-text-tertiary text-sm">{pro.email}</span>
 </div>
 </td>
 {/* Availability */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span className={`px-3 py-2 rounded-lg text-sm font-extrabold uppercase tracking-wide ${AVAIL_STYLES[pro.availability] ??"bg-bg-alt text-text-tertiary"}`}>
 {pro.availability}
 </span>
 </td>
 {/* Verification */}
 <td className="px-5 py-4 whitespace-nowrap">
 {pro.verified ? (
 <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-accent-light text-emerald-655 border border-emerald-100 text-sm font-extrabold uppercase">
 <ShieldCheck className="w-3 h-3" />
 Verified
 </span>
 ) : (
 <span className="px-3 py-2 rounded-lg bg-bg text-amber-655 border border-amber-100 text-sm font-extrabold uppercase">
 Pending
 </span>
 )}
 </td>
 {/* Current Status */}
 <td className="px-5 py-4 whitespace-nowrap">
 <span className={`px-3 py-2 rounded-lg border text-sm font-extrabold uppercase tracking-wide ${STATUS_STYLES[pro.currentStatus]}`}>
 {pro.currentStatus}
 </span>
 </td>
 {/* Actions */}
 <td className="px-5 py-4 whitespace-nowrap">
 <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={() => router.push(`/agency/professionals/${pro.id}`)}
 title="View Profile"
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg text-accent-light hover:bg-bg :bg-orange-950/40 transition-colors border border-orange-100"
 >
 <ExternalLink className="w-3.5 h-3.5" />
 </button>
 <button
 title="Edit"
 disabled
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-alt text-text-tertiary hover:bg-bg-alt :bg-primary-hover transition-colors border border-border opacity-60 cursor-not-allowed"
 >
 <Edit2 className="w-3.5 h-3.5" />
 </button>
 <button
 title="Deactivate"
 disabled
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 :bg-rose-950/40 transition-colors border border-rose-100 opacity-60 cursor-not-allowed"
 >
 <UserX className="w-3.5 h-3.5" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* ── Mobile: card layout ── */}
 <div className="sm:hidden space-y-3">
 {filtered.map((pro) => (
 <div
 key={pro.id}
 className="bg-white border border-border rounded-[20px] p-6 space-y-3"
 >
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl bg-bg text-accent-light flex items-center justify-center font-black text-base shrink-0 uppercase overflow-hidden border border-orange-100">
 {pro.photo ? (
 <img src={pro.photo} alt={pro.fullName} className="w-full h-full object-cover" />
 ) : (
 pro.fullName.substring(0, 2)
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className="font-extrabold text-base text-primary truncate">{pro.fullName}</p>
 <p className="text-base text-text-tertiary font-bold uppercase tracking-wide">{pro.category}</p>
 </div>
 {pro.verified && <ShieldCheck className="w-4 h-4 text-accent shrink-0" />}
 </div>

 <div className="grid grid-cols-2 gap-6 text-base">
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Experience</p>
 <p className="text-text-secondary font-semibold mt-0.5">{pro.experience}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Status</p>
 <span className={`inline-block mt-0.5 px-3 py-2.5 rounded-lg border text-sm font-extrabold uppercase ${STATUS_STYLES[pro.currentStatus]}`}>
 {pro.currentStatus}
 </span>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Phone</p>
 <p className="text-text-secondary font-semibold mt-0.5">{pro.phone}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Availability</p>
 <span className={`inline-block mt-0.5 px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase ${AVAIL_STYLES[pro.availability] ??""}`}>
 {pro.availability}
 </span>
 </div>
 </div>

 <div className="flex gap-6 pt-1 border-t border-border-light">
 <button
 onClick={() => router.push(`/agency/professionals/${pro.id}`)}
 className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-base font-extrabold text-accent-light bg-bg border border-orange-100 hover:bg-bg :bg-orange-950/40 transition-colors"
 >
 <ExternalLink className="w-3 h-3" />
 View Profile
 </button>
 <SecondaryButton type="button" disabled className="flex-1 text-base py-2 opacity-50 cursor-not-allowed flex items-center justify-center gap-1">
 <Edit2 className="w-3 h-3" /> Edit
 </SecondaryButton>
 </div>
 </div>
 ))}
 </div>

 {/* Row count */}
 <p className="text-base text-text-tertiary font-bold">
 Showing {filtered.length} of {total} professional{total !== 1 ?"s" :""}
 </p>
 </>
 )}
 </DashboardCard>
 </div>
 );
}
