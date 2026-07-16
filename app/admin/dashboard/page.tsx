"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import {
 Users, UserSquare2, Building2, CalendarDays,
 Clock, ShieldAlert, CheckCircle2,
 HardDrive, Database, Network, Bell, Cpu,
 ArrowRight,
} from"lucide-react";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import { patientService } from"@/lib/services/patient.service";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";
import { bookingService } from"@/lib/services/booking.service";
import { Booking, BookingStatus } from"@/types/booking";

interface ActivityItem {
 id: string;
 time: string;
 activity: string;
 type: string;
 status: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
 { id:"act-1", time:"10:30 AM", activity:"New professional registration pending review: Dr. Anjali", type:"Registration", status:"Pending" },
 { id:"act-2", time:"09:45 AM", activity:"Booking reference BK-0002 confirmed by CareFirst Agency", type:"Booking Update", status:"Success" },
 { id:"act-3", time:"09:00 AM", activity:"Verification document uploaded by Prime Care Clinic", type:"Document Upload", status:"Pending" },
 { id:"act-4", time:"Yesterday", activity:"Platform security audit completed successfully", type:"System Audit", status:"Verified" },
 { id:"act-5", time:"Yesterday", activity:"Database backup archive created: db-backup-20260713", type:"Database", status:"Healthy" },
 { id:"act-6", time:"Yesterday", activity:"New patient signup: priya.sharma@gmail.com", type:"User Signup", status:"Success" },
 { id:"act-7", time:"2 days ago", activity:"Service categories list configuration updated", type:"Configuration", status:"Verified" },
];

export default function AdminDashboardPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);

 // Platform counts
 const [patientsCount, setPatientsCount] = useState(0);
 const [professionalsCount, setProfessionalsCount] = useState(0);
 const [agenciesCount, setAgenciesCount] = useState(0);
 const [bookingsCount, setBookingsCount] = useState(0);

 // Platform details
 const [activePros, setActivePros] = useState(0);
 const [availablePros, setAvailablePros] = useState(0);
 const [pendingBookings, setPendingBookings] = useState(0);
 const [completedBookings, setCompletedBookings] = useState(0);
 const [cancelledBookings, setCancelledBookings] = useState(0);
 const [verifiedAgencies, setVerifiedAgencies] = useState(0);
 const [pendingAgencies, setPendingAgencies] = useState(0);

 // Latest bookings
 const [latestBookings, setLatestBookings] = useState<any[]>([]);

 // Time & Greeting
 const [time, setTime] = useState("");
 const [date, setDate] = useState("");
 const [greeting, setGreeting] = useState("");

 useEffect(() => {
 // Clock update
 const updateTime = () => {
 const now = new Date();
 setTime(now.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", second:"2-digit" }));
 setDate(now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" }));
 
 const hr = now.getHours();
 if (hr < 12) setGreeting("Good Morning");
 else if (hr < 17) setGreeting("Good Afternoon");
 else setGreeting("Good Evening");
 };

 updateTime();
 const interval = setInterval(updateTime, 1000);

 // Fetch data using services only
 Promise.all([
 patientService.getPatient(),
 providerService.getProviders(),
 organizationService.getOrganizations(),
 bookingService.getBookings(),
 ])
 .then(([patient, providers, organizations, bookings]) => {
 // Since getPatient returns a single patient, simulate count
 setPatientsCount(4); // Mock count matching patients dataset
 setProfessionalsCount(providers.length);
 setAgenciesCount(organizations.length);
 setBookingsCount(bookings.length);

 // Platform overview math
 setActivePros(providers.filter(p => p.verified).length);
 setAvailablePros(providers.filter(p => p.availability?.toLowerCase().includes("today")).length);
 
 setPendingBookings(bookings.filter(b => b.status === BookingStatus.Pending).length);
 setCompletedBookings(bookings.filter(b => b.status === BookingStatus.Completed).length);
 setCancelledBookings(bookings.filter(b => b.status === BookingStatus.Cancelled).length);

 setVerifiedAgencies(organizations.filter(o => o.verified).length);
 setPendingAgencies(organizations.filter(o => !o.verified).length);

 // Map and enrich latest bookings (max 10)
 const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];
 const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta","patient-2":"Priya Sharma","patient-3":"Ravi Nair","patient-4":"Sunita Das"
 };
 const mapped = bookings.slice(0, 10).map((b) => {
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
 status: b.status,
 };
 });
 setLatestBookings(mapped);

 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading Admin Dashboard data:", err);
 setLoading(false);
 });

 return () => clearInterval(interval);
 }, []);

 const statusBadgeColor = (status: string) => {
 if (status === BookingStatus.Pending) return"bg-bg text-accent-light";
 if (status === BookingStatus.Confirmed) return"bg-bg text-secondary";
 if (status === BookingStatus.Completed) return"bg-accent-light text-accent";
 if (status === BookingStatus.Cancelled) return"bg-rose-50 text-rose-600";
 return"bg-bg-alt text-text-secondary";
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 return (
 <div className="space-y-12">

 {/* ─── Section 1: Welcome ─── */}
 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
 <div>
 <p className="text-base text-text-tertiary">{greeting}</p>
 <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-1 tracking-tight">
 Admin Dashboard
 </h1>
 <p className="text-base text-text-tertiary mt-2">
 {date}
 </p>
 </div>
 <div className="flex items-center gap-6 text-base font-mono text-accent-light">
 <Clock className="w-4 h-4" />
 {time}
 </div>
 </div>

 {/* ─── Section 2: KPI Stats ─── */}
 <section>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
 {[
 { label:"Total Patients", value: patientsCount, icon: <Users className="w-4 h-4" />, color:"text-secondary bg-bg" },
 { label:"Total Professionals", value: professionalsCount, icon: <UserSquare2 className="w-4 h-4" />, color:"text-secondary bg-purple-50" },
 { label:"Total Agencies", value: agenciesCount, icon: <Building2 className="w-4 h-4" />, color:"text-accent bg-accent-light" },
 { label:"Total Bookings", value: bookingsCount, icon: <CalendarDays className="w-4 h-4" />, color:"text-accent-light bg-bg" },
 ].map((stat) => (
 <DashboardCard key={stat.label} className="!p-8">
 <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
 {stat.icon}
 </div>
 <p className="text-2xl font-bold text-primary">{stat.value}</p>
 <p className="text-sm text-text-tertiary mt-1">{stat.label}</p>
 </DashboardCard>
 ))}
 </div>
 </section>

 {/* ─── Section 3: Platform Overview Stats ─── */}
 <section>
 <SectionHeader title="Platform Overview" />
 <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
 {[
 { label:"Active Professionals", value: activePros },
 { label:"Available Today", value: availablePros },
 { label:"Pending Bookings", value: pendingBookings },
 { label:"Completed", value: completedBookings },
 { label:"Cancelled", value: cancelledBookings },
 { label:"Verified Agencies", value: verifiedAgencies },
 { label:"Pending Agencies", value: pendingAgencies },
 ].map((stat) => (
 <div key={stat.label} className="bg-white [#12121a] border border-border/60 rounded-xl p-6">
 <p className="text-2xl font-bold text-primary">{stat.value}</p>
 <p className="text-[12px] text-text-tertiary mt-1 leading-tight">{stat.label}</p>
 </div>
 ))}
 </div>
 </section>

 {/* ─── Section 4: Main Content Grid ─── */}
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
 {/* Left: Bookings Table */}
 <div className="lg:col-span-3 space-y-12">

 {/* Latest Bookings */}
 <section>
 <SectionHeader
 title="Latest Bookings"
 actionButton={
 <button
 onClick={() => router.push("/admin/bookings")}
 className="text-sm text-accent-light hover:text-accent-light font-medium transition-colors"
 >
 View all
 </button>
 }
 />
 <DashboardCard className="!p-0 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-border-light">
 {["Ref","Patient","Professional","Service","Date","Status"].map((h) => (
 <th key={h} className="px-5 py-4 text-[12px] font-medium text-text-tertiary whitespace-nowrap">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {latestBookings.map((b) => (
 <tr key={b.id} className="hover:bg-bg-alt/50 :bg-primary/20 transition-colors">
 <td className="px-5 py-4.5 text-sm font-mono font-medium text-accent-light whitespace-nowrap">{b.ref}</td>
 <td className="px-5 py-4.5 text-sm font-medium text-primary whitespace-nowrap">{b.patientName}</td>
 <td className="px-5 py-4.5 text-sm text-text-secondary whitespace-nowrap">{b.professionalName}</td>
 <td className="px-5 py-4.5 text-sm text-text-tertiary whitespace-nowrap">{b.service}</td>
 <td className="px-5 py-4.5 text-sm text-text-tertiary whitespace-nowrap">{b.date}</td>
 <td className="px-5 py-4.5 whitespace-nowrap">
 <span className={`text-base font-medium px-3.5 py-2 rounded-full ${statusBadgeColor(b.status)}`}>{b.status}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </DashboardCard>
 </section>

 {/* Recent Activity Timeline */}
 <section>
 <SectionHeader title="Recent Activity" />
 <DashboardCard>
 <div className="space-y-0">
 {MOCK_ACTIVITIES.map((act, idx) => (
 <div key={act.id} className={`flex gap-6 py-4 ${idx < MOCK_ACTIVITIES.length - 1 ?"border-b border-border-light" :""}`}>
 <div className="flex flex-col items-center shrink-0">
 <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
 {idx < MOCK_ACTIVITIES.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-6">
 <span className="text-[12px] font-medium text-text-tertiary">{act.type}</span>
 <span className="text-[12px] text-text-tertiary shrink-0">{act.time}</span>
 </div>
 <p className="text-sm text-text-secondary mt-1 leading-relaxed">{act.activity}</p>
 </div>
 </div>
 ))}
 </div>
 </DashboardCard>
 </section>
 </div>

 {/* Right: Quick Actions + Verification + System */}
 <div className="lg:col-span-2 space-y-8">

 {/* Quick Actions */}
 <section>
 <SectionHeader title="Quick Actions" />
 <div className="space-y-2">
 {[
 { label:"Manage Users", href:"/admin/users" },
 { label:"Manage Agencies", href:"/admin/agencies" },
 { label:"Manage Professionals", href:"/admin/professionals" },
 { label:"Manage Bookings", href:"/admin/bookings" },
 { label:"View Reports", href:"/admin/reports" },
 { label:"Platform Settings", href:"/admin/settings" },
 ].map((action) => (
 <button
 key={action.label}
 onClick={() => router.push(action.href)}
 className="w-full group flex items-center justify-between px-5 py-4 rounded-xl bg-white [#12121a] border border-border/60 hover:border-accent-light :border-orange-900/40 transition-all text-base font-medium text-text-secondary hover:text-accent-light :text-orange-400"
 >
 {action.label}
 <ArrowRight className="w-4 h-4 text-white group-hover:text-accent-light group-hover:translate-x-0.5 transition-all" />
 </button>
 ))}
 </div>
 </section>

 {/* Verification Queue */}
 <section>
 <SectionHeader title="Verification Queue" />
 <DashboardCard>
 <div className="space-y-3">
 {[
 { label:"Pending Professionals", value: 1 },
 { label:"Pending Agencies", value: 1 },
 { label:"Pending Documents", value: 1 },
 ].map((item) => (
 <div key={item.label} className="flex items-center justify-between py-2">
 <span className="text-sm text-text-secondary">{item.label}</span>
 <span className="text-base font-semibold text-accent-light bg-bg px-3.5 py-2.5 rounded-full">
 {item.value}
 </span>
 </div>
 ))}
 </div>
 </DashboardCard>
 </section>

 {/* System Status */}
 <section>
 <SectionHeader title="System Status" />
 <DashboardCard>
 <div className="space-y-3">
 {[
 { label:"Application", value:"Healthy", icon: <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> },
 { label:"Database", value:"Online", icon: <Database className="w-3.5 h-3.5 text-accent" /> },
 { label:"API", value:"Connected", icon: <Network className="w-3.5 h-3.5 text-accent" /> },
 { label:"Notifications", value:"Operational", icon: <Bell className="w-3.5 h-3.5 text-accent" /> },
 { label:"Version", value:"1.0.0", icon: <HardDrive className="w-3.5 h-3.5 text-text-tertiary" /> },
 ].map((item, idx) => (
 <div key={item.label} className={`flex items-center justify-between py-2 ${idx < 4 ?"border-b border-border-light" :""}`}>
 <span className="text-sm text-text-tertiary">{item.label}</span>
 <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
 {item.icon}
 {item.value}
 </span>
 </div>
 ))}
 </div>
 </DashboardCard>
 </section>
 </div>
 </div>
 </div>
 );
}
