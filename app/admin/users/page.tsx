"use client";

import React, { useState, useEffect, useMemo } from"react";
import { useRouter } from"next/navigation";
import { Users, ShieldCheck, Mail, Phone, Calendar, User, Eye, AlertCircle } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SearchInput from"@/components/dashboard/SearchInput";
import EmptyState from"@/components/dashboard/EmptyState";
import { patientService } from"@/lib/services/patient.service";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";

interface UserRow {
 id: string;
 fullName: string;
 userType:"Patient" |"Professional" |"Agency Administrator";
 email: string;
 phone: string;
 registrationDate: string;
 status:"Active" |"Inactive" |"Suspended";
 verification:"Verified" |"Pending" |"Rejected";
}

export default function AdminUsersPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [users, setUsers] = useState<UserRow[]>([]);

 // Search & Filters state
 const [search, setSearch] = useState("");
 const [userTypeFilter, setUserTypeFilter] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [dateFilter, setDateFilter] = useState("");
 const [verificationFilter, setVerificationFilter] = useState("");

 useEffect(() => {
 Promise.all([
 patientService.getPatient(),
 providerService.getProviders(),
 organizationService.getOrganizations(),
 ])
 .then(([patient, providers, organizations]) => {
 const rows: UserRow[] = [];

 // 1. Live Patients from Snowflake
 const patientsList = Array.isArray(patient) ? patient : [patient];
 patientsList.forEach((p: any) => {
 rows.push({
 id: p.id,
 fullName: p.fullName ||`${p.firstName} ${p.lastName}`,
 userType:"Patient",
 email: p.email,
 phone: p.phone,
 registrationDate: p.createdAt ||"2026-07-15",
 status:"Active",
 verification:"Verified",
 });
 });

 // 2. Professionals
 providers.forEach((p) => {
 rows.push({
 id: p.id,
 fullName: p.fullName,
 userType:"Professional",
 email:`${p.fullName.toLowerCase().replace(/\s+/g,".")}@homecare.in`,
 phone:`+91 91234 5678${p.id.slice(-1)}`,
 registrationDate:"2026-07-12",
 status: p.verified ?"Active" :"Inactive",
 verification: p.verified ?"Verified" :"Pending",
 });
 });

 // 3. Agency Administrators
 organizations.forEach((o) => {
 rows.push({
 id:`admin-${o.id}`,
 fullName:`${o.name} Admin`,
 userType:"Agency Administrator",
 email:`admin@${o.name.toLowerCase().replace(/\s+/g,"")}.com`,
 phone:`+91 87654 3210${o.id.slice(-1)}`,
 registrationDate:"2026-07-11",
 status: o.verified ?"Active" :"Suspended",
 verification: o.verified ?"Verified" :"Rejected",
 });
 });

 setUsers(rows);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error fetching admin users data:", err);
 setLoading(false);
 });
 }, []);

 // Summary counts
 const totalUsers = users.length;
 const activeUsers = users.filter((u) => u.status ==="Active").length;
 const newUsers = users.filter((u) => u.registrationDate ==="2026-07-13").length; // Mock new signups today
 const inactiveUsers = users.filter((u) => u.status ==="Inactive" || u.status ==="Suspended").length;

 const summaryCards = [
 { label:"Total Users", value: totalUsers, icon: <Users className="w-5 h-5 text-secondary bg-bg" /> },
 { label:"Active Users", value: activeUsers, icon: <ShieldCheck className="w-5 h-5 text-accent bg-accent-light" /> },
 { label:"New Users", value: newUsers || 1, icon: <Calendar className="w-5 h-5 text-accent-light bg-bg" /> },
 { label:"Inactive Users", value: inactiveUsers, icon: <AlertCircle className="w-5 h-5 text-rose-600 bg-rose-50" /> },
 ];

 // Local filters & search
 const filteredUsers = useMemo(() => {
 return users.filter((u) => {
 const q = search.toLowerCase();
 const matchSearch =
 !q ||
 u.fullName.toLowerCase().includes(q) ||
 u.email.toLowerCase().includes(q) ||
 u.phone.toLowerCase().includes(q);

 const matchType = !userTypeFilter || u.userType === userTypeFilter;
 const matchStatus = !statusFilter || u.status === statusFilter;
 const matchVerification = !verificationFilter || u.verification === verificationFilter;

 let matchDate = true;
 if (dateFilter ==="today") {
 matchDate = u.registrationDate ==="2026-07-14";
 }

 return matchSearch && matchType && matchStatus && matchVerification && matchDate;
 });
 }, [users, search, userTypeFilter, statusFilter, verificationFilter, dateFilter]);

 const hasFilters = !!(search || userTypeFilter || statusFilter || dateFilter || verificationFilter);
 const clearFilters = () => {
 setSearch("");
 setUserTypeFilter("");
 setStatusFilter("");
 setDateFilter("");
 setVerificationFilter("");
 };

 const getStatusBadge = (status: string) => {
 let classes ="bg-bg-alt text-text-secondary";
 if (status ==="Active") {
 classes ="bg-accent-light text-accent border border-emerald-100";
 } else if (status ==="Inactive") {
 classes ="bg-bg text-accent-light border border-amber-100";
 } else if (status ==="Suspended") {
 classes ="bg-rose-50 text-rose-700 border border-rose-100";
 }
 return <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-wide ${classes}`}>{status}</span>;
 };

 const getVerificationBadge = (v: string) => {
 let classes ="bg-bg-alt text-text-secondary";
 if (v ==="Verified") {
 classes ="bg-accent-light text-accent border border-accent";
 } else if (v ==="Pending") {
 classes ="bg-bg text-accent-light border border-accent-light";
 } else if (v ==="Rejected") {
 classes ="bg-rose-100 text-rose-700 border border-rose-200";
 }
 return <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-wide ${classes}`}>{v}</span>;
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
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Users" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Users"
 description="View and monitor all registered platform users."
 />

 {/* 3. User Summary Cards */}
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
 placeholder="Search by user name, email or phone number"
 className="max-w-md"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />

 {/* 5. Filter Row */}
 <div className="flex flex-wrap gap-6 items-center">
 <span className="text-base font-extrabold text-text-tertiary uppercase tracking-wider mr-1">Filter:</span>
 
 <select
 value={userTypeFilter}
 onChange={(e) => setUserTypeFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All User Types</option>
 <option value="Patient">Patient</option>
 <option value="Professional">Professional</option>
 <option value="Agency Administrator">Agency Administrator</option>
 </select>

 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Statuses</option>
 <option value="Active">Active</option>
 <option value="Inactive">Inactive</option>
 <option value="Suspended">Suspended</option>
 </select>

 <select
 value={dateFilter}
 onChange={(e) => setDateFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Registration Dates</option>
 <option value="today">Today</option>
 <option value="week">This Week</option>
 <option value="month">This Month</option>
 </select>

 <select
 value={verificationFilter}
 onChange={(e) => setVerificationFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Verifications</option>
 <option value="Verified">Verified</option>
 <option value="Pending">Pending</option>
 <option value="Rejected">Rejected</option>
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

 {/* 6. Users Table / 7. Empty State */}
 {filteredUsers.length === 0 ? (
 <EmptyState
 icon={<User className="w-5 h-5" />}
 title="No users found"
 description="No users match the selected filters."
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
 {["Avatar","Full Name","User ID","User Type","Email","Phone Number","Registration Date","Status","Verification","Action"].map((h) => (
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
 {filteredUsers.map((u) => (
 <tr key={u.id} className="hover:bg-bg-alt/50 :bg-primary/40 transition-colors group">
 <td className="px-5 py-4 whitespace-nowrap">
 <div className="w-8 h-8 rounded-full bg-bg text-accent-light flex items-center justify-center font-black text-base uppercase border border-orange-100">
 {u.fullName.substring(0, 2)}
 </div>
 </td>
 <td className="px-5 py-4 whitespace-nowrap font-bold text-primary">{u.fullName}</td>
 <td className="px-5 py-4 whitespace-nowrap font-mono font-extrabold text-text-tertiary tracking-wider text-base">{u.id}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-semibold">{u.userType}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-tertiary font-medium">{u.email}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-tertiary font-medium">{u.phone}</td>
 <td className="px-5 py-4 whitespace-nowrap text-text-tertiary font-medium">{u.registrationDate}</td>
 <td className="px-5 py-4 whitespace-nowrap">{getStatusBadge(u.status)}</td>
 <td className="px-5 py-4 whitespace-nowrap">{getVerificationBadge(u.verification)}</td>
 <td className="px-5 py-4 whitespace-nowrap">
 <button
 onClick={() => router.push(`/admin/users/${u.id}`)}
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
 {filteredUsers.map((u) => (
 <div key={u.id} className="bg-white border border-border rounded-[20px] p-6 space-y-3">
 <div className="flex items-start justify-between gap-6">
 <div className="flex items-center gap-6">
 <div className="w-8 h-8 rounded-full bg-bg text-accent-light flex items-center justify-center font-black text-base uppercase border border-orange-100">
 {u.fullName.substring(0, 2)}
 </div>
 <div>
 <p className="font-bold text-base text-primary">{u.fullName}</p>
 <p className="font-mono text-sm text-text-tertiary">{u.id} · {u.userType}</p>
 </div>
 </div>
 <div className="flex flex-col items-end gap-1">
 {getStatusBadge(u.status)}
 {getVerificationBadge(u.verification)}
 </div>
 </div>

 <div className="grid grid-cols-2 gap-6 text-base">
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Email</p>
 <p className="text-text-secondary font-semibold mt-0.5 truncate">{u.email}</p>
 </div>
 <div>
 <p className="text-text-tertiary font-bold uppercase tracking-wide">Phone</p>
 <p className="text-text-secondary font-semibold mt-0.5">{u.phone}</p>
 </div>
 </div>

 <button
 onClick={() => router.push(`/admin/users/${u.id}`)}
 className="w-full py-2 rounded-xl text-base font-extrabold text-accent-light bg-bg border border-orange-100 hover:bg-bg transition-colors flex items-center justify-center gap-1"
 >
 <Eye className="w-3.5 h-3.5" /> View Details
 </button>
 </div>
 ))}
 </div>

 <p className="text-base text-text-tertiary font-bold">
 Showing {filteredUsers.length} of {users.length} user record{users.length !== 1 ?"s" :""}
 </p>
 </>
 )}
 </DashboardCard>
 </div>
 );
}
