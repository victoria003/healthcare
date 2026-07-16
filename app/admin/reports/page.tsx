"use client";

import React, { useState, useEffect } from"react";
import { Users, UserCheck, Building2, CalendarDays, Activity, BarChart3, Database, ShieldAlert, Cpu } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import EmptyState from"@/components/dashboard/EmptyState";
import { patientService } from"@/lib/services/patient.service";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";
import { bookingService } from"@/lib/services/booking.service";
import { Booking, BookingStatus } from"@/types/booking";

interface AnalyticsState {
 patientsCount: number;
 professionalsCount: number;
 agenciesCount: number;
 bookingsCount: number;

 // Booking details
 pendingB: number;
 confirmedB: number;
 inProgressB: number;
 completedB: number;
 cancelledB: number;

 // Patient detail
 newP: number;
 activeP: number;
 returningP: number;
 inactiveP: number;

 // Pro analytics
 doctorsCount: number;
 nursesCount: number;
 caregiversCount: number;
 physiosCount: number;
 attendersCount: number;
 availPros: number;
 unavailPros: number;
 avgProRating: number;

 // Agency details
 verifiedA: number;
 pendingA: number;
 suspendedA: number;
 avgAgencyRating: number;
 avgProPerAgency: number;

 // Service details
 nursingB: number;
 physioB: number;
 doctorB: number;
 caregiverB: number;
 elderB: number;
}

export default function AdminReportsPage() {
 const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState<AnalyticsState | null>(null);

 useEffect(() => {
 Promise.all([
 patientService.getPatient(),
 providerService.getProviders(),
 organizationService.getOrganizations(),
 bookingService.getBookings(),
 ])
 .then(([patient, providers, organizations, bookings]) => {
 // Aggregate statistics from active service mock layers
 const bkTotal = bookings.length;
 const pending = bookings.filter(b => b.status === BookingStatus.Pending).length;
 const confirmed = bookings.filter(b => b.status === BookingStatus.Confirmed).length;
 const completed = bookings.filter(b => b.status === BookingStatus.Completed).length;
 const cancelled = bookings.filter(b => b.status === BookingStatus.Cancelled).length;

 // Categories
 const doctors = providers.filter(p => p.category ==="Doctors").length;
 const nurses = providers.filter(p => p.category ==="Nurses").length;
 const caregivers = providers.filter(p => p.category ==="Caregivers").length;
 const physios = providers.filter(p => p.category ==="Physiotherapists").length;
 const attenders = providers.filter(p => p.category ==="Patient Attenders" || p.category ==="Attenders").length;
 
 const verifiedOrgs = organizations.filter(o => o.verified).length;

 // Service booking count mock breakdown
 const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];
 let nursingCount = 0, physioCount = 0, doctorCount = 0, caregiverCount = 0, elderCount = 0;
 bookings.forEach((b) => {
 const serviceName = SERVICES[parseInt(b.id.replace(/\D/g,"0").slice(-2), 10) % SERVICES.length];
 if (serviceName.includes("Nursing")) nursingCount++;
 else if (serviceName.includes("Physio")) physioCount++;
 else if (serviceName.includes("Doctor")) doctorCount++;
 else if (serviceName.includes("Caregiver")) caregiverCount++;
 else elderCount++;
 });

 const stateValues: AnalyticsState = {
 patientsCount: 4,
 professionalsCount: providers.length,
 agenciesCount: organizations.length,
 bookingsCount: bkTotal,
 pendingB: pending,
 confirmedB: confirmed,
 inProgressB: confirmed, // Mock in progress matches confirmed
 completedB: completed,
 cancelledB: cancelled,
 newP: 2,
 activeP: 3,
 returningP: 1,
 inactiveP: 0,
 doctorsCount: doctors,
 nursesCount: nurses,
 caregiversCount: caregivers,
 physiosCount: physios,
 attendersCount: providers.length - (doctors + nurses + caregivers + physios),
 availPros: providers.filter(p => p.availability?.toLowerCase().includes("today")).length,
 unavailPros: providers.filter(p => !p.availability?.toLowerCase().includes("today")).length,
 avgProRating: providers.reduce((acc, p) => acc + p.rating, 0) / (providers.length || 1),
 verifiedA: verifiedOrgs,
 pendingA: organizations.length - verifiedOrgs,
 suspendedA: 0,
 avgAgencyRating: organizations.reduce((acc, o) => acc + o.rating, 0) / (organizations.length || 1),
 avgProPerAgency: Math.round(providers.length / (organizations.length || 1)),
 nursingB: nursingCount,
 physioB: physioCount,
 doctorB: doctorCount,
 caregiverB: caregiverCount,
 elderB: elderCount,
 };

 setStats(stateValues);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error generating admin reports:", err);
 setLoading(false);
 });
 }, []);

 const pct = (val: number, total: number) => {
 return total > 0 ? Math.round((val / total) * 100) : 0;
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 if (!stats) {
 return (
 <EmptyState
 icon={<BarChart3 className="w-5 h-5" />}
 title="No report data available"
 description="Analytics will appear once platform data is available."
 buttonLabel="Back to Dashboard"
 buttonLink="/admin/dashboard"
 />
 );
 }

 // Monthly activity mapping (12 rows, July highlighted)
 const currentMonthIdx = 6; // July
 const months = [
 { name:"January", patients: 1, pros: 1, bookings: 2, completed: 2, cancelled: 0 },
 { name:"February", patients: 1, pros: 0, bookings: 1, completed: 1, cancelled: 0 },
 { name:"March", patients: 2, pros: 2, bookings: 3, completed: 2, cancelled: 1 },
 { name:"April", patients: 0, pros: 1, bookings: 2, completed: 1, cancelled: 1 },
 { name:"May", patients: 3, pros: 2, bookings: 5, completed: 4, cancelled: 1 },
 { name:"June", patients: 2, pros: 1, bookings: 4, completed: 3, cancelled: 1 },
 { name:"July", patients: stats.patientsCount, pros: stats.professionalsCount, bookings: stats.bookingsCount, completed: stats.completedB, cancelled: stats.cancelledB },
 { name:"August", patients: 0, pros: 0, bookings: 0, completed: 0, cancelled: 0 },
 { name:"September", patients: 0, pros: 0, bookings: 0, completed: 0, cancelled: 0 },
 { name:"October", patients: 0, pros: 0, bookings: 0, completed: 0, cancelled: 0 },
 { name:"November", patients: 0, pros: 0, bookings: 0, completed: 0, cancelled: 0 },
 { name:"December", patients: 0, pros: 0, bookings: 0, completed: 0, cancelled: 0 },
 ];

 return (
 <div className="space-y-6 max-w-7xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Reports" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Reports & Analytics"
 description="Monitor platform performance and operational statistics."
 />

 {/* 3. KPI Summary Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label:"Total Patients", value: stats.patientsCount, icon: <Users className="w-5 h-5 text-secondary bg-bg" /> },
 { label:"Total Professionals", value: stats.professionalsCount, icon: <UserCheck className="w-5 h-5 text-secondary bg-purple-50" /> },
 { label:"Total Agencies", value: stats.agenciesCount, icon: <Building2 className="w-5 h-5 text-accent bg-accent-light" /> },
 { label:"Total Bookings", value: stats.bookingsCount, icon: <CalendarDays className="w-5 h-5 text-accent-light bg-bg" /> },
 ].map((c, i) => (
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

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 
 {/* 4. Booking Analytics */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Activity className="w-4 h-4 text-accent-light" />
 Booking Analytics
 </h3>
 <div className="space-y-3.5 text-sm font-bold">
 {[
 { label:"Pending Bookings", val: stats.pendingB, color:"bg-accent-light" },
 { label:"Confirmed Bookings", val: stats.confirmedB, color:"bg-primary" },
 { label:"In Progress", val: stats.inProgressB, color:"bg-purple-500" },
 { label:"Completed", val: stats.completedB, color:"bg-accent" },
 { label:"Cancelled", val: stats.cancelledB, color:"bg-rose-500" },
 ].map((item, idx) => {
 const percentage = pct(item.val, stats.bookingsCount);
 return (
 <div key={idx} className="space-y-1">
 <div className="flex justify-between">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-slate-905">{item.val} ({percentage}%)</span>
 </div>
 <div className="h-2 bg-bg-alt rounded-full overflow-hidden">
 <div className={`h-full rounded-full ${item.color}`} style={{ width:`${percentage}%`}} />
 </div>
 </div>
 );
 })}
 </div>
 </DashboardCard>

 {/* 8. Service Analytics */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <BarChart3 className="w-4 h-4 text-accent-light" />
 Service Analytics
 </h3>
 <div className="space-y-3.5 text-sm font-bold">
 {[
 { label:"Doctor Consultation", val: stats.doctorB, color:"bg-primary" },
 { label:"Nursing Care", val: stats.nursingB, color:"bg-accent-light" },
 { label:"Caregiver Service", val: stats.caregiverB, color:"bg-purple-500" },
 { label:"Physiotherapy", val: stats.physioB, color:"bg-accent" },
 { label:"Patient Attender", val: stats.elderB, color:"bg-primary" },
 ].map((item, idx) => {
 const percentage = pct(item.val, stats.bookingsCount);
 return (
 <div key={idx} className="space-y-1">
 <div className="flex justify-between">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-slate-905">{item.val} ({percentage}%)</span>
 </div>
 <div className="h-2 bg-bg-alt rounded-full overflow-hidden">
 <div className={`h-full rounded-full ${item.color}`} style={{ width:`${percentage}%`}} />
 </div>
 </div>
 );
 })}
 </div>
 </DashboardCard>

 {/* 9. Monthly Activity */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Monthly Activity</h3>
 {/* Desktop Table View */}
 <div className="hidden sm:block overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {["Month","New Patients","New Professionals","Bookings","Completed","Cancelled"].map((h) => (
 <th key={h} className="px-5 py-4 text-sm uppercase tracking-wider font-extrabold text-text-tertiary whitespace-nowrap">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {months.map((m, idx) => {
 const isCurrent = idx === currentMonthIdx;
 return (
 <tr key={m.name} className={`hover:bg-bg-alt/50 :bg-primary/40 transition-colors ${isCurrent ?"bg-bg/10 text-orange-655 font-extrabold" :""}`}>
 <td className="px-5 py-4 whitespace-nowrap font-bold">{m.name}</td>
 <td className="px-5 py-4 whitespace-nowrap">{m.patients}</td>
 <td className="px-5 py-4 whitespace-nowrap">{m.pros}</td>
 <td className="px-5 py-4 whitespace-nowrap">{m.bookings}</td>
 <td className="px-5 py-4 whitespace-nowrap text-accent">{m.completed}</td>
 <td className="px-5 py-4 whitespace-nowrap text-rose-500">{m.cancelled}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>

 {/* Mobile Stacked Cards View */}
 <div className="sm:hidden space-y-2">
 {months.map((m, idx) => {
 const isCurrent = idx === currentMonthIdx;
 return (
 <div key={m.name} className={`p-3 border rounded-xl space-y-1.5 ${isCurrent ?"border-accent-light/30 bg-bg/10" :"border-border-light"}`}>
 <div className="flex justify-between">
 <span className="text-sm font-black">{m.name} {isCurrent &&"(Current Month)"}</span>
 <span className="text-sm font-bold text-accent-light">{m.bookings} Bookings</span>
 </div>
 <div className="grid grid-cols-2 gap-6 text-base text-text-tertiary">
 <div>Patients: {m.patients}</div>
 <div>Pros: {m.pros}</div>
 <div className="text-accent">Completed: {m.completed}</div>
 <div className="text-rose-500">Cancelled: {m.cancelled}</div>
 </div>
 </div>
 );
 })}
 </div>
 </DashboardCard>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 5. Patient Analytics */}
 <DashboardCard className="p-8 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Patient Analytics</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"New Patients", value: stats.newP },
 { label:"Active Patients", value: stats.activeP },
 { label:"Returning Patients", value: stats.returningP },
 { label:"Inactive Patients", value: stats.inactiveP },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-slate-105 last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 6. Professional Analytics */}
 <DashboardCard className="p-8 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Professional Analytics</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Doctors", value: stats.doctorsCount },
 { label:"Nurses", value: stats.nursesCount },
 { label:"Caregivers", value: stats.caregiversCount },
 { label:"Physiotherapists", value: stats.physiosCount },
 { label:"Patient Attenders", value: stats.attendersCount },
 { label:"Available Professionals", value: stats.availPros },
 { label:"Unavailable Professionals", value: stats.unavailPros },
 { label:"Average Rating", value:`★ ${stats.avgProRating.toFixed(1)}`},
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-slate-105 last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 7. Agency Analytics */}
 <DashboardCard className="p-8 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Agency Analytics</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Verified Agencies", value: stats.verifiedA },
 { label:"Pending Agencies", value: stats.pendingA },
 { label:"Suspended Agencies", value: stats.suspendedA },
 { label:"Average Rating", value:`★ ${stats.avgAgencyRating.toFixed(1)}`},
 { label:"Avg Pros per Agency", value: stats.avgProPerAgency },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-slate-105 last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 10. System Statistics */}
 <DashboardCard className="p-8 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Cpu className="w-4 h-4 text-accent-light" />
 System Statistics
 </h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Application Version", value:"1.0.0" },
 { label:"Database", value:"Mock Repository" },
 { label:"API Status", value:"Offline", icon: <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> },
 { label:"Total Users", value: stats.patientsCount + stats.professionalsCount + stats.agenciesCount },
 { label:"Storage Usage", value:"Local Mock Data" },
 { label:"Platform Status", value:"Healthy", icon: <span className="w-2.5 h-2.5 rounded-full bg-accent" /> },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2 border-b border-slate-105 last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="flex items-center gap-1.5 text-primary">
 {item.icon}
 {item.value}
 </span>
 </div>
 ))}
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
