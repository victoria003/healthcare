"use client";

import React, { useState, useEffect } from"react";
import { ClipboardList, Users, TrendingUp, DollarSign } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import EmptyState from"@/components/dashboard/EmptyState";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";
import { BookingStatus } from"@/types/booking";

// ── Helpers ───────────────────────────────────────────────────────────────────

const SERVICES = [
"Home Nursing Care","Physiotherapy","Doctor Visit",
"Caregiver Support","Elder Care","Post-Surgery Recovery",
];
function derivedService(id: string): string {
 const n = parseInt(id.replace(/\D/g,"0").slice(-2), 10);
 return SERVICES[n % SERVICES.length];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function StatRow({ label, value, total }: { label: string; value: number; total: number }) {
 const pct = total > 0 ? Math.round((value / total) * 100) : 0;
 return (
 <div className="space-y-1.5">
 <div className="flex items-center justify-between text-sm">
 <span className="font-bold text-text-secondary">{label}</span>
 <span className="font-extrabold text-primary">{value}</span>
 </div>
 <div className="h-1.5 bg-bg-alt rounded-full overflow-hidden">
 <div
 className="h-full bg-accent-light rounded-full transition-all duration-500"
 style={{ width:`${pct}%`}}
 />
 </div>
 </div>
 );
}

export default function AgencyReportsPage() {
 const [loading, setLoading] = useState(true);
 const [hasData, setHasData] = useState(false);

 // Raw stats
 const [totalBookings, setTotalBookings] = useState(0);
 const [completedCount, setCompletedCount] = useState(0);
 const [cancelledCount, setCancelledCount] = useState(0);
 const [pendingCount, setPendingCount] = useState(0);
 const [confirmedCount, setConfirmedCount] = useState(0);

 // Professional breakdown
 const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});
 const [totalPros, setTotalPros] = useState(0);

 // Service breakdown
 const [serviceMap, setServiceMap] = useState<Record<string, number>>({});
 const [avgRating, setAvgRating] = useState(0);

 // Org name
 const [orgName, setOrgName] = useState("Your Organization");

 useEffect(() => {
 setLoading(true);
 Promise.all([
 bookingService.getBookings(),
 providerService.getProviders(),
 organizationService.getOrganizations(),
 ])
 .then(([bookings, providers, orgs]) => {
 setHasData(bookings.length > 0 || providers.length > 0);

 // Bookings
 setTotalBookings(bookings.length);
 setCompletedCount(bookings.filter((b) => b.status === BookingStatus.Completed).length);
 setCancelledCount(bookings.filter((b) => b.status === BookingStatus.Cancelled).length);
 setPendingCount(bookings.filter((b) => b.status === BookingStatus.Pending).length);
 setConfirmedCount(bookings.filter((b) => b.status === BookingStatus.Confirmed).length);

 // Service map from bookings
 const svcMap: Record<string, number> = {};
 bookings.forEach((b) => {
 const svc = derivedService(b.id);
 svcMap[svc] = (svcMap[svc] ?? 0) + 1;
 });
 setServiceMap(svcMap);

 // Professionals
 setTotalPros(providers.length);
 const catMap: Record<string, number> = {};
 providers.forEach((p) => { catMap[p.category] = (catMap[p.category] ?? 0) + 1; });
 setCategoryMap(catMap);

 // Avg rating
 if (providers.length > 0) {
 const avg = providers.reduce((sum, p) => sum + p.rating, 0) / providers.length;
 setAvgRating(avg);
 }

 // Org name
 if (orgs.length > 0) setOrgName(orgs[0].name);
 })
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 // Derived service insights
 const serviceEntries = Object.entries(serviceMap);
 const mostRequested = serviceEntries.sort((a, b) => b[1] - a[1])[0]?.[0] ??"N/A";
 const leastRequested = serviceEntries.sort((a, b) => a[1] - b[1])[0]?.[0] ??"N/A";

 // Mock monthly activity (derived from bookings distributed across months)
 const currentYear = new Date().getFullYear();
 const monthlyActivity = MONTHS.map((m, i) => ({
 month:`${m} ${currentYear}`,
 bookings: i === new Date().getMonth() ? totalBookings : Math.max(0, totalBookings - (i % 3)),
 completed: i === new Date().getMonth() ? completedCount : Math.max(0, completedCount - (i % 2)),
 cancelled: i === new Date().getMonth() ? cancelledCount : 0,
 avgRating: avgRating > 0 ? (avgRating - (i % 5) * 0.05).toFixed(1) :"—",
 }));

 const KPI_CARDS = [
 { label:"Total Bookings", value: totalBookings, icon: <ClipboardList className="w-5 h-5" />, color:"text-accent-light bg-bg" },
 { label:"Completed", value: completedCount, icon: <TrendingUp className="w-5 h-5" />, color:"text-accent bg-accent-light" },
 { label:"Cancelled", value: cancelledCount, icon: <ClipboardList className="w-5 h-5" />, color:"text-rose-600 bg-rose-50" },
 { label:"Revenue (Mock)", value:`₹${totalBookings * 1800}`, icon: <DollarSign className="w-5 h-5" />, color:"text-secondary bg-bg" },
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
 <Breadcrumb items={[{ label:"Dashboard", href:"/agency/dashboard" }, { label:"Reports" }]} />

 {/* 2. Page Header */}
 <SectionHeader
 title="Reports"
 description={`Review operational performance across ${orgName}.`}
 />

 {!hasData ? (
 <EmptyState
 icon={<ClipboardList className="w-5 h-5" />}
 title="No report data"
 description="Reports will be generated once bookings and professionals are added."
 buttonLabel="Booking Requests"
 buttonLink="/agency/booking-requests"
 />
 ) : (
 <>
 {/* 3. KPI Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {KPI_CARDS.map((card) => (
 <DashboardCard key={card.label} className="p-8 flex items-center gap-6">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
 {card.icon}
 </div>
 <div>
 <p className="text-xl font-black text-primary">{card.value}</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">{card.label}</p>
 </div>
 </DashboardCard>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* 4. Booking Summary */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ClipboardList className="w-4 h-4 text-accent-light" />
 Booking Summary
 </h3>
 <div className="space-y-3">
 <StatRow label="Pending" value={pendingCount} total={totalBookings} />
 <StatRow label="Confirmed" value={confirmedCount} total={totalBookings} />
 <StatRow label="Completed" value={completedCount} total={totalBookings} />
 <StatRow label="Cancelled" value={cancelledCount} total={totalBookings} />
 </div>
 </DashboardCard>

 {/* 5. Professional Summary */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Users className="w-4 h-4 text-accent-light" />
 Professional Summary
 </h3>
 <div className="space-y-3">
 {["Doctors","Nurses","Caregivers","Physiotherapists","Patient Attenders"].map((cat) => (
 <StatRow key={cat} label={cat} value={categoryMap[cat] ?? 0} total={totalPros || 1} />
 ))}
 </div>
 </DashboardCard>

 {/* 6. Service Summary */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <TrendingUp className="w-4 h-4 text-accent-light" />
 Service Summary
 </h3>
 <div className="space-y-3">
 {[
 { label:"Most Requested", value: mostRequested },
 { label:"Least Requested", value: leastRequested },
 { label:"Avg Duration", value:"2 Hours" },
 { label:"Average Rating", value: avgRating > 0 ?`${avgRating.toFixed(1)} / 5`:"N/A" },
 ].map(({ label, value }) => (
 <div key={label} className="flex items-start justify-between gap-6">
 <span className="text-base font-bold text-text-tertiary uppercase tracking-wide shrink-0">{label}</span>
 <span className="text-sm font-extrabold text-primary text-right">{value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>
 </div>

 {/* 7. Monthly Activity Table */}
 <DashboardCard className="p-8 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Monthly Activity</h3>
 <div className="overflow-x-auto rounded-xl border border-border-light">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="bg-bg-alt border-b border-border-light">
 {["Month","Bookings","Completed","Cancelled","Avg Rating"].map((h) => (
 <th key={h} className="px-5 py-4 text-sm uppercase tracking-wider font-extrabold text-text-tertiary whitespace-nowrap">
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {monthlyActivity.map((row, i) => {
 const isCurrent = i === new Date().getMonth();
 return (
 <tr
 key={row.month}
 className={`transition-colors ${isCurrent ?"bg-bg/50" :"hover:bg-bg-alt/50 :bg-primary/40"}`}
 >
 <td className="px-5 py-4 whitespace-nowrap">
 <span className={`font-bold ${isCurrent ?"text-accent-light" :"text-text-secondary"}`}>
 {row.month}{isCurrent ?" ●" :""}
 </span>
 </td>
 <td className="px-5 py-4 whitespace-nowrap font-extrabold text-primary">{row.bookings}</td>
 <td className="px-5 py-4 whitespace-nowrap text-accent font-bold">{row.completed}</td>
 <td className="px-5 py-4 whitespace-nowrap text-rose-600 font-bold">{row.cancelled}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{row.avgRating}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </DashboardCard>
 </>
 )}
 </div>
 );
}
