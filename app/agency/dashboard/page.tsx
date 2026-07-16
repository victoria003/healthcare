"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import { ShieldCheck, Users, Calendar, Star, ArrowRight, Activity, ShieldAlert, Bell, Clock, TrendingUp, CheckCircle2, AlertCircle } from"lucide-react";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { organizationService, MockOrganization } from"@/lib/services/organization.service";

export default function AgencyDashboardPage() {
 const router = useRouter();
 const [organization, setOrganization] = useState<MockOrganization | undefined>(undefined);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 setLoading(true);
 // Fetch default organization
 organizationService.getOrganizations()
 .then((data) => {
 if (data && data.length > 0) {
 setOrganization(data[0]); // Select first agency (o1)
 }
 })
 .catch((err) => console.error("Error loading agency details:", err))
 .finally(() => setLoading(false));
 }, []);

 const mockRequests = [
 { id:"HC-B-991", name:"Anita Sharma", service:"Doctor Visit", date:"2026-07-16", status:"Pending" },
 { id:"HC-B-992", name:"Rajesh Kumar", service:"Physiotherapy", date:"2026-07-17", status:"Confirmed" },
 { id:"HC-B-993", name:"Vikas Patel", service:"Wound Nursing", date:"2026-07-18", status:"Completed" },
 ];

 const mockStaff = [
 { name:"Dr. Suresh Kumar", category:"Doctor", availability:"Available", rating: 4.9 },
 { name:"Priyanjali Sen", category:"Nurse", availability:"On Shift", rating: 4.8 },
 { name:"Mahesh Babu", category:"Caregiver", availability:"Available", rating: 4.7 },
 ];

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 const agencyName = organization ? organization.name :"CareFirst Agency";
 const verified = organization ? organization.verified : true;

 const statusColor = (status: string) => {
 if (status ==="Pending") return"bg-bg text-accent-light";
 if (status ==="Confirmed") return"bg-bg text-secondary";
 return"bg-accent-light text-accent";
 };

 return (
 <div className="space-y-12">

 {/* ─── Section 1: Welcome ─── */}
 <div>
 <div className="flex flex-wrap items-center gap-6">
 <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
 {agencyName}
 </h1>
 {verified && (
 <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-accent-light text-accent text-sm font-medium">
 <ShieldCheck className="w-3.5 h-3.5" />
 Verified
 </span>
 )}
 </div>
 <p className="text-base text-text-tertiary mt-2">
 Agency Dashboard &middot; Premium Enterprise Partner
 </p>
 </div>

 {/* ─── Section 2: KPI Stats ─── */}
 <section>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
 {[
 { label:"Active Professionals", value:"14", icon: <Users className="w-4 h-4" />, color:"text-secondary bg-bg" },
 { label:"Pending Requests", value:"3", icon: <Clock className="w-4 h-4" />, color:"text-accent-light bg-bg" },
 { label:"Completed Bookings", value:"128", icon: <CheckCircle2 className="w-4 h-4" />, color:"text-accent bg-accent-light" },
 { label:"Avg. Rating", value:"4.8", icon: <Star className="w-4 h-4" />, color:"text-accent-light bg-bg" },
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

 {/* ─── Section 3: Main Content ─── */}
 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
 {/* Left: Requests + Staff */}
 <div className="lg:col-span-3 space-y-12">
 {/* Booking Requests */}
 <section>
 <SectionHeader
 title="Recent Booking Requests"
 actionButton={
 <button
 onClick={() => router.push("/agency/booking-requests")}
 className="text-sm text-accent-light hover:text-accent-light font-medium transition-colors"
 >
 View all
 </button>
 }
 />
 <div className="space-y-3">
 {mockRequests.map((req) => (
 <DashboardCard key={req.id} className="!p-6 flex items-center justify-between gap-6">
 <div className="min-w-0">
 <div className="flex items-center gap-6 mb-1">
 <h4 className="text-base font-semibold text-primary truncate">{req.name}</h4>
 <span className={`text-base font-medium px-3 py-2.5 rounded-full shrink-0 ${statusColor(req.status)}`}>
 {req.status}
 </span>
 </div>
 <div className="flex items-center gap-6 text-sm text-text-tertiary">
 <span>{req.service}</span>
 <span className="text-white">&middot;</span>
 <span>{req.date}</span>
 <span className="text-white">&middot;</span>
 <span className="text-text-tertiary">{req.id}</span>
 </div>
 </div>
 <button
 onClick={() => router.push(`/agency/booking-requests/${req.id}`)}
 className="text-sm text-text-tertiary hover:text-accent-light font-medium transition-colors shrink-0"
 >
 View
 </button>
 </DashboardCard>
 ))}
 </div>
 </section>

 {/* Assigned Professionals */}
 <section>
 <SectionHeader
 title="Team Members"
 actionButton={
 <button
 onClick={() => router.push("/agency/professionals")}
 className="text-sm text-accent-light hover:text-accent-light font-medium transition-colors"
 >
 Manage team
 </button>
 }
 />
 <div className="space-y-3">
 {mockStaff.map((staff) => (
 <DashboardCard key={staff.name} className="!p-6 flex items-center justify-between gap-6">
 <div className="flex items-center gap-6 min-w-0">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-semibold text-base shrink-0">
 {staff.name.charAt(0)}
 </div>
 <div className="min-w-0">
 <h4 className="text-base font-semibold text-primary truncate">{staff.name}</h4>
 <p className="text-sm text-text-tertiary">{staff.category}</p>
 </div>
 </div>
 <div className="flex items-center gap-6 shrink-0">
 <span className={`text-[12px] font-medium px-3 py-2.5 rounded-full ${
 staff.availability ==="Available"
 ?"bg-accent-light text-accent"
 :"bg-bg text-secondary"
 }`}>
 {staff.availability}
 </span>
 <span className="flex items-center gap-1 text-base font-medium text-text-secondary">
 <Star className="w-3.5 h-3.5 text-accent-light fill-amber-500" />
 {staff.rating}
 </span>
 </div>
 </DashboardCard>
 ))}
 </div>
 </section>
 </div>

 {/* Right: Quick Actions + Performance + Alerts */}
 <div className="lg:col-span-2 space-y-8">
 {/* Quick Actions */}
 <section>
 <SectionHeader title="Quick Actions" />
 <div className="space-y-2">
 {[
 { label:"Manage Professionals", href:"/agency/professionals" },
 { label:"Booking Requests", href:"/agency/booking-requests" },
 { label:"Organization Profile", href:"/agency/profile" },
 { label:"Reports", href:"/agency/reports" },
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

 {/* Performance Summary */}
 <section>
 <SectionHeader title="Performance" />
 <DashboardCard>
 <div className="space-y-3">
 {[
 { label:"Total Bookings", value:"145", color:"text-primary" },
 { label:"Completed", value:"128", color:"text-accent" },
 { label:"Pending", value:"12", color:"text-accent-light" },
 { label:"Cancelled", value:"5", color:"text-rose-500" },
 ].map((row, idx) => (
 <div key={row.label} className={`flex justify-between items-center py-2 ${idx < 3 ?"border-b border-border-light" :""}`}>
 <span className="text-sm text-text-tertiary">{row.label}</span>
 <span className={`text-base font-semibold ${row.color}`}>{row.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>
 </section>

 {/* Alerts */}
 <section>
 <SectionHeader title="Alerts" />
 <div className="space-y-3">
 {[
 { icon: <ShieldAlert className="w-4 h-4" />, title:"Verification Alert", desc:"Verify pending provider credential uploads.", color:"text-rose-500 bg-rose-50" },
 { icon: <Bell className="w-4 h-4" />, title:"Organization Alert", desc:"Plan renewal due in next 45 days.", color:"text-accent-light bg-bg" },
 { icon: <Activity className="w-4 h-4" />, title:"System Alert", desc:"Scheduled database sync on Sunday.", color:"text-secondary bg-bg" },
 ].map((alert) => (
 <div key={alert.title} className="flex items-start gap-6 p-6 bg-white [#12121a] border border-border/60 rounded-xl">
 <div className={`w-8 h-8 rounded-lg ${alert.color} flex items-center justify-center shrink-0`}>
 {alert.icon}
 </div>
 <div>
 <p className="text-base font-medium text-primary">{alert.title}</p>
 <p className="text-sm text-text-tertiary mt-0.5 leading-relaxed">{alert.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </section>
 </div>
 </div>
 </div>
 );
}
