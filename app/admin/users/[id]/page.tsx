"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import { ArrowLeft, User, Phone, Mail, MapPin, ClipboardList, ShieldCheck, FileText } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { patientService } from"@/lib/services/patient.service";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";

interface UserActivity {
 date: string;
 activity: string;
 status: string;
}

const MOCK_USER_ACTIVITIES: UserActivity[] = [
 { date:"2026-07-14", activity:"Logged in via Web Interface", status:"Success" },
 { date:"2026-07-13", activity:"Profile information updated", status:"Completed" },
 { date:"2026-07-12", activity:"Verification documents review completed", status:"Verified" },
 { date:"2026-07-11", activity:"Account registration verification link clicked", status:"Completed" },
];

export default function AdminUserDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [userProfile, setUserProfile] = useState<any>(null);

 useEffect(() => {
 if (!id) return;
 
 Promise.all([
 patientService.getPatient(),
 providerService.getProviders(),
 organizationService.getOrganizations(),
 ])
 .then(([patient, providers, organizations]) => {
 let profile: any = null;

 const patientsList = Array.isArray(patient) ? patient : [patient];
 const matchedPatient = patientsList.find(p => p.id === id);

 if (matchedPatient) {
 profile = {
 id: matchedPatient.id,
 fullName: matchedPatient.fullName ||`${matchedPatient.firstName} ${matchedPatient.lastName}`,
 firstName: matchedPatient.firstName,
 lastName: matchedPatient.lastName,
 userType:"Patient",
 email: matchedPatient.email,
 phone: matchedPatient.phone,
 gender:"Male",
 dob:"1990-01-01",
 address:"123 Care Street, Road 4",
 city:"Hyderabad",
 state:"Telangana",
 pincode:"500081",
 country:"India",
 regDate:"2026-07-10",
 status:"Active",
 verification:"Verified",
 role:"Patient",
 lastLogin:"2026-07-14 10:15 AM",
 totalBookings: 2,
 };
 } else if (id.startsWith("patient-")) {
 const patientNames = ["Arjun Mehta","Priya Sharma","Ravi Nair","Sunita Das"];
 const index = parseInt(id.replace("patient-",""), 10) - 1;
 const name = patientNames[index] ??"Demo Patient";
 const first = name.split("")[0];
 const last = name.split("").slice(1).join("");
 
 profile = {
 id,
 fullName: name,
 firstName: first,
 lastName: last,
 userType:"Patient",
 email:`${name.toLowerCase().replace("",".")}@gmail.com`,
 phone:`+91 98765 4321${index}`,
 gender: index % 2 === 0 ?"Male" :"Female",
 dob:`198${index}-04-12`,
 address:"123 Care Street, Road 4",
 city:"Hyderabad",
 state:"Telangana",
 pincode:"500081",
 country:"India",
 regDate:"2026-07-10",
 status:"Active",
 verification:"Verified",
 role:"Patient",
 lastLogin:"2026-07-14 10:15 AM",
 totalBookings: 2,
 };
 } else if (id.startsWith("p")) {
 const pro = providers.find(p => p.id === id) || providers[0];
 const names = pro.fullName.split("");
 
 profile = {
 id: pro.id,
 fullName: pro.fullName,
 firstName: names[0] ||"",
 lastName: names.slice(1).join("") ||"",
 userType:"Professional",
 email:`${pro.fullName.toLowerCase().replace(/\s+/g,".")}@homecare.in`,
 phone:`+91 91234 5678${pro.id.slice(-1)}`,
 gender:"Male",
 dob:"1988-05-14",
 address:"Flat 402, Nisarga Heights",
 city:"Hyderabad",
 state:"Telangana",
 pincode:"500033",
 country:"India",
 regDate:"2026-07-12",
 status: pro.verified ?"Active" :"Inactive",
 verification: pro.verified ?"Verified" :"Pending",
 role: pro.category,
 lastLogin:"2026-07-14 09:30 AM",
 totalBookings: 3,
 };
 } else {
 // Admin/Agency admin
 const agencyId = id.replace("admin-","");
 const agency = organizations.find(o => o.id === agencyId) || organizations[0];
 
 profile = {
 id,
 fullName:`${agency.name} Admin`,
 firstName:"Agency",
 lastName:"Administrator",
 userType:"Agency Administrator",
 email:`admin@${agency.name.toLowerCase().replace(/\s+/g,"")}.com`,
 phone:"+91 87654 32101",
 gender:"Female",
 dob:"1985-08-20",
 address:"Commercial Plaza, Block B",
 city:"Hyderabad",
 state:"Telangana",
 pincode:"500032",
 country:"India",
 regDate:"2026-07-11",
 status: agency.verified ?"Active" :"Suspended",
 verification: agency.verified ?"Verified" :"Rejected",
 role:"Agency Administrator",
 lastLogin:"2026-07-14 08:45 AM",
 totalBookings: 5,
 };
 }

 setUserProfile(profile);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading user profile details:", err);
 setLoading(false);
 });
 }, [id]);

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 if (!userProfile) {
 return (
 <div className="text-center py-20 text-text-tertiary text-base font-semibold">
 User profile not found.{""}
 <Link href="/admin/users" className="text-accent-light hover:underline">
 Go back
 </Link>
 </div>
 );
 }

 return (
 <div className="space-y-6 max-w-6xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Users", href:"/admin/users" },
 { label:"User Detail" },
 ]}
 />

 {/* Back link */}
 <Link
 href="/admin/users"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Users
 </Link>

 {/* 2. Page Header */}
 <SectionHeader
 title="User Details"
 description="View detailed information for this user account."
 />

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 
 {/* 3. User Summary Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden">
 <div className="w-20 h-20 rounded-[28px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shrink-0">
 {userProfile.fullName.substring(0, 2)}
 </div>
 <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
 <h2 className="text-xl font-black text-primary">{userProfile.fullName}</h2>
 <span className={`px-3 py-2.5 rounded-full text-sm font-extrabold uppercase ${
 userProfile.verification ==="Verified"
 ?"bg-accent-light text-accent border border-emerald-100"
 :"bg-bg text-accent-light border border-amber-100"
 }`}>
 {userProfile.verification}
 </span>
 </div>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-text-tertiary font-bold">
 <span>ID: {userProfile.id}</span>
 <span>·</span>
 <span>Type: {userProfile.userType}</span>
 <span>·</span>
 <span>Joined: {userProfile.regDate}</span>
 </div>
 <div className="pt-2">
 <span className={`px-3 py-2 rounded-lg text-sm font-extrabold uppercase tracking-wide ${
 userProfile.status ==="Active"
 ?"bg-accent-light text-emerald-750"
 :"bg-rose-50 text-rose-750"
 }`}>
 {userProfile.status}
 </span>
 </div>
 </div>
 <div className="absolute right-0 bottom-0 w-28 h-28 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 {/* 4. Personal Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <User className="w-4 h-4 text-accent-light" />
 Personal Information
 </h3>
 <div className="grid grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">First Name</p>
 <p className="text-primary mt-0.5">{userProfile.firstName}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Last Name</p>
 <p className="text-primary mt-0.5">{userProfile.lastName}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Gender</p>
 <p className="text-primary mt-0.5">{userProfile.gender}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Date of Birth</p>
 <p className="text-primary mt-0.5">{userProfile.dob}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 5. Contact Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Phone className="w-4 h-4 text-accent-light" />
 Contact Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Email</p>
 <p className="text-slate-850 mt-0.5 select-all">{userProfile.email}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Phone Number</p>
 <p className="text-slate-855 mt-0.5">{userProfile.phone}</p>
 </div>
 <div className="sm:col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Address</p>
 <p className="text-primary mt-0.5">
 {userProfile.address}, {userProfile.city}, {userProfile.state}, {userProfile.pincode}, {userProfile.country}
 </p>
 </div>
 </div>
 </DashboardCard>

 {/* 7. Verification Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ShieldCheck className="w-4 h-4 text-accent-light" />
 Verification Information
 </h3>
 <div className="grid grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Status</p>
 <p className="text-primary mt-0.5">{userProfile.verification}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Date</p>
 <p className="text-primary mt-0.5">{userProfile.regDate}</p>
 </div>
 <div className="col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Method</p>
 <p className="text-primary mt-0.5">National Identity Database Verification & Document Check</p>
 </div>
 </div>
 </DashboardCard>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 6. Account Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Account Information</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Account Created", value: userProfile.regDate },
 { label:"Last Login", value: userProfile.lastLogin },
 { label:"Total Bookings", value: userProfile.totalBookings },
 { label:"Role", value: userProfile.role },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-border-light last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 8. Recent Activity */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <FileText className="w-4 h-4 text-accent-light" />
 Recent Activity
 </h3>
 <div className="relative border-l border-border space-y-4 ml-1">
 {MOCK_USER_ACTIVITIES.map((act, idx) => (
 <div key={idx} className="ml-4 relative text-sm">
 <div className="absolute -left-[20px] w-2 h-2 rounded-full bg-slate-350 mt-1.5 border border-white" />
 <div className="flex items-center justify-between text-base text-text-tertiary font-bold">
 <span>{act.date}</span>
 <span className="font-mono text-sm uppercase text-accent-light font-extrabold">{act.status}</span>
 </div>
 <p className="font-semibold text-text-secondary leading-relaxed mt-0.5">{act.activity}</p>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 9. Actions */}
 <DashboardCard className="p-6 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Actions</h3>
 <div className="space-y-2">
 <SecondaryButton
 type="button"
 onClick={() => router.push("/admin/users")}
 className="w-full flex items-center justify-center gap-1.5 text-base"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Users
 </SecondaryButton>
 <button
 type="button"
 onClick={() => router.push("/admin/bookings")}
 className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-base font-extrabold text-white bg-accent-light hover:bg-accent-light transition-colors shadow-sm focus:outline-none"
 >
 <ClipboardList className="w-3.5 h-3.5" />
 View Bookings
 </button>
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
