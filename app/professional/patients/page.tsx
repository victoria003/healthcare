"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import { Users, Calendar, ShieldCheck, Search, Filter, Phone, User, Check, Eye } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SearchInput from"@/components/dashboard/SearchInput";
import EmptyState from"@/components/dashboard/EmptyState";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { patientService } from"@/lib/services/patient.service";
import { Booking, BookingStatus } from"@/types/booking";

// Helper static data mapping patient ID to additional details
const PATIENT_DETAILS: Record<string, {
 name: string;
 phone: string;
 email: string;
 gender: string;
 age: number;
 bloodGroup: string;
 allergies: string;
 conditions: string;
}> = {
"patient-1": {
 name:"Arjun Mehta",
 phone:"+91 98765 43210",
 email:"arjun.mehta@gmail.com",
 gender:"Male",
 age: 45,
 bloodGroup:"O+",
 allergies:"Penicillin",
 conditions:"Hypertension",
 },
"patient-2": {
 name:"Priya Sharma",
 phone:"+91 91234 56789",
 email:"priya.sharma@gmail.com",
 gender:"Female",
 age: 32,
 bloodGroup:"A+",
 allergies:"None",
 conditions:"Diabetes Type 2",
 },
"patient-3": {
 name:"Ravi Nair",
 phone:"+91 87654 32109",
 email:"ravi.nair@gmail.com",
 gender:"Male",
 age: 68,
 bloodGroup:"B+",
 allergies:"Sulfa drugs",
 conditions:"Arthritis, Mild Asthma",
 },
"patient-4": {
 name:"Sunita Das",
 phone:"+91 76543 21098",
 email:"sunita.das@gmail.com",
 gender:"Female",
 age: 57,
 bloodGroup:"O-",
 allergies:"Dust, Shellfish",
 conditions:"Post-surgery recovery",
 },
};

const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];

function getPatientInfo(id: string) {
 return PATIENT_DETAILS[id] ?? {
 name:`Patient ${id.substring(id.length - 4)}`,
 phone:"+91 99999 88888",
 email:"patient@homecare.in",
 gender:"Other",
 age: 40,
 bloodGroup:"AB+",
 allergies:"None",
 conditions:"None",
 };
}

interface EnrichedPatientRow {
 id: string;
 name: string;
 phone: string;
 bookingRef: string;
 service: string;
 date: string;
 time: string;
 status: string;
 gender: string;
}

export default function ProfessionalPatientsPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [patientRows, setPatientRows] = useState<EnrichedPatientRow[]>([]);

 // Search & Filters State
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [serviceFilter, setServiceFilter] = useState("");
 const [dateFilter, setDateFilter] = useState("");
 const [genderFilter, setGenderFilter] = useState("");

 useEffect(() => {
 Promise.all([
 bookingService.getBookings(),
 providerService.getProviders(),
 patientService.getPatient(),
 ])
 .then(([bookings, providers, patients]) => {
 // Build list of patients from bookings
 const patientsList = Array.isArray(patients) ? patients : [patients];
 const rows: EnrichedPatientRow[] = bookings.map((b) => {
 const matchedPatient = patientsList.find(p => p.id === b.patientId);
 const name = matchedPatient ? (matchedPatient.fullName ||`${matchedPatient.firstName} ${matchedPatient.lastName}`) : getPatientInfo(b.patientId).name;
 const phone = matchedPatient ? matchedPatient.phone : getPatientInfo(b.patientId).phone;
 const gender = matchedPatient ?"Male" : getPatientInfo(b.patientId).gender;

 const serviceName = SERVICES[parseInt(b.id.replace(/\D/g,"0").slice(-2), 10) % SERVICES.length];
 const ref =`BK-${b.id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`;

 return {
 id: b.patientId,
 name,
 phone,
 bookingRef: ref,
 service: serviceName,
 date: b.date,
 time: b.time,
 status: b.status === BookingStatus.Confirmed ?"In Progress" : b.status,
 gender,
 };
 });
 setPatientRows(rows);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading patients page data:", err);
 setLoading(false);
 });
 }, []);

 const totalPatients = useMemo(() => {
 const uniqueIds = new Set(patientRows.map(r => r.id));
 return uniqueIds.size;
 }, [patientRows]);

 const todayPatients = useMemo(() => {
 const todayStr = new Date().toISOString().split("T")[0];
 const todayRows = patientRows.filter(r => r.date === todayStr);
 return new Set(todayRows.map(r => r.id)).size;
 }, [patientRows]);

 const activePatients = useMemo(() => {
 const activeRows = patientRows.filter(r => r.status ==="In Progress" || r.status ==="Pending");
 return new Set(activeRows.map(r => r.id)).size;
 }, [patientRows]);

 const completedVisits = useMemo(() => {
 return patientRows.filter(r => r.status ==="Completed").length;
 }, [patientRows]);

 const summaryCards = [
 { label:"Total Patients", value: totalPatients, icon: <Users className="w-5 h-5 text-accent-light bg-bg" /> },
 { label:"Today's Patients", value: todayPatients, icon: <Calendar className="w-5 h-5 text-secondary bg-bg" /> },
 { label:"Active Patients", value: activePatients, icon: <ShieldCheck className="w-5 h-5 text-accent bg-accent-light" /> },
 { label:"Completed Visits", value: completedVisits, icon: <Check className="w-5 h-5 text-secondary bg-purple-50" /> },
 ];

 // Local filtering & search logic
 const filteredRows = useMemo(() => {
 return patientRows.filter((row) => {
 const q = search.toLowerCase();
 const matchSearch =
 !q ||
 row.name.toLowerCase().includes(q) ||
 row.bookingRef.toLowerCase().includes(q) ||
 row.phone.toLowerCase().includes(q);

 const matchStatus = !statusFilter || row.status === statusFilter;
 const matchService = !serviceFilter || row.service === serviceFilter;
 const matchGender = !genderFilter || row.gender === genderFilter;

 // Date filtering UI mock (Today, This Week, This Month)
 let matchDate = true;
 if (dateFilter ==="today") {
 const todayStr = new Date().toISOString().split("T")[0];
 matchDate = row.date === todayStr;
 }

 return matchSearch && matchStatus && matchService && matchGender && matchDate;
 });
 }, [patientRows, search, statusFilter, serviceFilter, dateFilter, genderFilter]);

 const hasFilters = !!(search || statusFilter || serviceFilter || dateFilter || genderFilter);
 const clearFilters = () => {
 setSearch("");
 setStatusFilter("");
 setServiceFilter("");
 setDateFilter("");
 setGenderFilter("");
 };

 const getStatusBadge = (status: string) => {
 let classes ="bg-bg-alt text-text-secondary";
 if (status ==="Upcoming" || status ==="Pending") {
 classes ="bg-bg text-accent-light border border-amber-100";
 } else if (status ==="In Progress" || status ==="Confirmed") {
 classes ="bg-bg text-secondary border border-blue-100";
 } else if (status ==="Completed") {
 classes ="bg-accent-light text-accent border border-emerald-100";
 } else if (status ==="Cancelled") {
 classes ="bg-rose-50 text-rose-700 border border-rose-100";
 }
 return <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-wide ${classes}`}>{status}</span>;
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
 { label:"Dashboard", href:"/professional/dashboard" },
 { label:"Patients" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Patients"
 description="View patients assigned to your care."
 />

 {/* 3. Patient Summary Cards */}
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
 placeholder="Search by patient name, booking reference or phone number"
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
 <option value="">All Visit Statuses</option>
 <option value="Upcoming">Upcoming</option>
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
 <option value="">All Dates</option>
 <option value="today">Today</option>
 <option value="week">This Week</option>
 <option value="month">This Month</option>
 </select>

 <select
 value={genderFilter}
 onChange={(e) => setGenderFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Genders</option>
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 <option value="Other">Other</option>
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

 {/* 6. Patients Table / 7. Empty State */}
 {filteredRows.length === 0 ? (
 <EmptyState
 icon={<User className="w-5 h-5" />}
 title="No patients assigned"
 description="Patients assigned to your bookings will appear here."
 buttonLabel="Go to Dashboard"
 buttonLink="/professional/dashboard"
 />
 ) : (
 <>
 {/* Desktop Table View */}
 <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {["Patient","Booking Ref","Service","Phone Number","Visit Date","Visit Time","Visit Status","Action"].map((h) => (
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
 {filteredRows.map((row, idx) => (
 <tr
 key={idx}
 className="hover:bg-bg-alt/50 :bg-primary/40 transition-colors group"
 >
 <td className="px-5 py-4 whitespace-nowrap">
 <div className="flex items-center gap-6">
 <div className="w-8 h-8 rounded-lg bg-bg text-accent-light flex items-center justify-center font-black text-sm uppercase border border-orange-100 overflow-hidden">
 {row.name.substring(0, 2)}
 </div>
 <span className="font-bold text-primary text-base">{row.name}</span>
 </div>
 </td>
 <td className="px-5 py-4 whitespace-nowrap font-mono font-extrabold text-accent-light text-base">{row.bookingRef}</td>
 <td className="px-5 py-4 whitespace-nowrap">
 <span className="px-3 py-2 rounded-lg bg-bg-alt text-text-secondary font-bold text-sm uppercase tracking-wide">
 {row.service}
 </span>
 </td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{row.phone}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{row.date}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{row.time}</td>
 <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(row.status)}</td>
 <td className="px-5 py-4 whitespace-nowrap">
 <button
 onClick={() => router.push(`/professional/patients/${row.id}`)}
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

 {/* Mobile Card Layout */}
 <div className="sm:hidden space-y-3">
 {filteredRows.map((row, idx) => (
 <div
 key={idx}
 className="bg-white border border-border rounded-[20px] p-6 space-y-3"
 >
 <div className="flex items-start justify-between gap-6">
 <div className="flex items-center gap-6">
 <div className="w-8 h-8 rounded-lg bg-bg text-accent-light flex items-center justify-center font-black text-sm uppercase border border-orange-100 overflow-hidden">
 {row.name.substring(0, 2)}
 </div>
 <div>
 <p className="font-bold text-base text-primary">{row.name}</p>
 <p className="font-mono text-base text-accent-light font-extrabold">{row.bookingRef}</p>
 </div>
 </div>
 {getStatusBadge(row.status)}
 </div>

 <div className="grid grid-cols-2 gap-6 text-base">
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Service</p>
 <p className="text-text-secondary font-semibold mt-0.5">{row.service}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Phone</p>
 <p className="text-text-secondary font-semibold mt-0.5">{row.phone}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Date</p>
 <p className="text-text-secondary font-semibold mt-0.5">{row.date}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Time</p>
 <p className="text-text-secondary font-semibold mt-0.5">{row.time}</p>
 </div>
 </div>

 <button
 onClick={() => router.push(`/professional/patients/${row.id}`)}
 className="w-full py-2 rounded-xl text-base font-extrabold text-accent-light bg-bg border border-orange-100 hover:bg-bg transition-colors flex items-center justify-center gap-1"
 >
 <Eye className="w-3.5 h-3.5" /> View Patient
 </button>
 </div>
 ))}
 </div>

 <p className="text-base text-text-tertiary font-bold">
 Showing {filteredRows.length} of {patientRows.length} patient record{patientRows.length !== 1 ?"s" :""}
 </p>
 </>
 )}
 </DashboardCard>
 </div>
 );
}
