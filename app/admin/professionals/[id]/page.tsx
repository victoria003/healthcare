"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import { ArrowLeft, User, Phone, Mail, MapPin, ClipboardList, ShieldCheck, FileText, Star, Briefcase, Award, Clock } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";

interface ProActivity {
 date: string;
 activity: string;
 status: string;
}

const MOCK_PRO_ACTIVITIES: ProActivity[] = [
 { date:"2026-07-14", activity:"Completed appointment BK-0001 with Arjun Mehta", status:"Completed" },
 { date:"2026-07-13", activity:"Availability parameters updated: enabled Monday to Saturday", status:"Success" },
 { date:"2026-07-12", activity:"Verified medical license document review checks", status:"Verified" },
 { date:"2026-07-10", activity:"Registered on HomeCare Marketplace platform", status:"Success" },
];

export default function AdminProfessionalDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [pro, setPro] = useState<any>(null);

 useEffect(() => {
 if (!id) return;
 
 Promise.all([
 providerService.getProviders(),
 organizationService.getOrganizations(),
 ])
 .then(([providers, organizations]) => {
 const found = providers.find(p => p.id === id) || providers[0];
 
 const idx = providers.indexOf(found);
 const genders = ["Male","Female"];
 const dobs = ["1988-05-14","1992-10-22","1985-04-03","1990-12-15","1987-07-09"];
 const phone =`+91 91234 5678${found.id.slice(-1)}`;
 const email =`${found.fullName.toLowerCase().replace(/\s+/g,".")}@homecare.in`;
 
 // Find organization detail
 const org = organizations.find(o => o.name === found.organization) || organizations[0];

 const details = {
 id: found.id,
 fullName: found.fullName,
 category: found.category,
 organization: found.organization,
 organizationId: org?.id ||"org-1122",
 experience: found.experience,
 rating: found.rating,
 verified: found.verified,
 availability: found.availability ||"Available Today",
 status: found.verified ?"Active" : idx % 2 === 0 ?"Inactive" :"Suspended",
 verificationStatus: found.verified ?"Verified" : idx % 2 === 0 ?"Pending" :"Rejected",
 gender: genders[idx % genders.length],
 dob: dobs[idx % dobs.length],
 email,
 phone,
 address:"Plot 402, Nisarga Heights, Jubilee Hills, Road No. 36, Hyderabad, 500033",
 emergencyContact:"Anitha Kumar (Spouse) — +91 98765 22222",
 specialization: found.category ==="Doctors" ?"General Medicine / Geriatrics" : found.category ==="Physiotherapists" ?"Orthopedics & Spine" :"Critical Home Care",
 registrationNumber:`MCI-REG-88221${idx}`,
 licenseNumber:`LIC-MED-99884${idx}`,
 languages: found.languages?.join(",") ||"English, Telugu, Hindi",
 branch:"Main Branch, Hyderabad",
 joinedDate:"2026-07-10",
 highestQual: found.category ==="Doctors" ?"MD - General Medicine" : found.category ==="Physiotherapists" ?"MPT - Orthopedics" :"B.Sc - Nursing",
 additionalCerts:"Advanced Life Support (ALS), Geriatric Care Specialist Certification",
 registrations:"State Medical Council, Rehabilitation Council of India",
 workingDays:"Monday to Saturday (Sunday off)",
 workingHours:"09:00 AM – 06:00 PM (Break: 01:00 PM – 02:00 PM)",
 lastAvailUpdate:"2026-07-13 04:30 PM",
 completedBookings: 12 + idx,
 cancelledBookings: idx,
 reviewsCount: 8 + idx,
 responseTime:"15 minutes",
 verifiedBy:"Platform Compliance Specialist",
 docStatus:"All Licenses & Certificates Verified",
 };

 setPro(details);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading admin professional detail:", err);
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

 if (!pro) {
 return (
 <div className="text-center py-20 text-text-tertiary text-base font-semibold">
 Professional profile not found.{""}
 <Link href="/admin/professionals" className="text-accent-light hover:underline">
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
 { label:"Professionals", href:"/admin/professionals" },
 { label:"Professional Detail" },
 ]}
 />

 {/* Back link */}
 <Link
 href="/admin/professionals"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Professionals
 </Link>

 {/* 2. Page Header */}
 <SectionHeader
 title="Professional Details"
 description="View details of registered healthcare professional."
 />

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 
 {/* 3. Professional Summary Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden">
 <div className="w-20 h-20 rounded-[28px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shrink-0">
 {pro.fullName.substring(0, 2)}
 </div>
 <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
 <h2 className="text-xl font-black text-primary">{pro.fullName}</h2>
 <span className={`px-3 py-2.5 rounded-full text-sm font-extrabold uppercase ${
 pro.verificationStatus ==="Verified"
 ?"bg-accent-light text-accent border border-emerald-100"
 :"bg-bg text-accent-light border border-amber-100"
 }`}>
 {pro.verificationStatus}
 </span>
 </div>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-text-tertiary font-bold">
 <span>ID: {pro.id}</span>
 <span>·</span>
 <span>Type: {pro.category}</span>
 <span>·</span>
 <span>{pro.organization}</span>
 </div>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-base text-text-tertiary pt-1">
 <span className="flex items-center gap-1 font-bold">
 <Star className="w-3.5 h-3.5 text-accent-light fill-current" />
 {pro.rating.toFixed(1)}
 </span>
 <span>·</span>
 <span className="font-bold">Experience: {pro.experience}</span>
 <span>·</span>
 <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase ${
 pro.availability ==="Available Today"
 ?"bg-accent-light text-emerald-705"
 :"bg-bg text-amber-705"
 }`}>
 {pro.availability}
 </span>
 <span>·</span>
 <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase ${
 pro.status ==="Active"
 ?"bg-emerald-55 text-emerald-755"
 :"bg-rose-55 text-rose-755"
 }`}>
 {pro.status}
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
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Full Name</p>
 <p className="text-primary mt-0.5">{pro.fullName}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Gender</p>
 <p className="text-primary mt-0.5">{pro.gender}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Date of Birth</p>
 <p className="text-primary mt-0.5">{pro.dob}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Email</p>
 <p className="text-slate-850 mt-0.5 select-all">{pro.email}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Phone Number</p>
 <p className="text-slate-855 mt-0.5">{pro.phone}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Emergency Contact</p>
 <p className="text-primary mt-0.5">{pro.emergencyContact}</p>
 </div>
 <div className="sm:col-span-2 border-t border-slate-105 pt-3">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Current Address</p>
 <p className="text-primary mt-0.5">{pro.address}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 5. Professional Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Briefcase className="w-4 h-4 text-accent-light" />
 Professional Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Category</p>
 <p className="text-slate-805 mt-0.5">{pro.category}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Specialization</p>
 <p className="text-slate-805 mt-0.5">{pro.specialization}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Registration Number</p>
 <p className="text-slate-805 font-mono mt-0.5">{pro.registrationNumber}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">License Number</p>
 <p className="text-slate-805 font-mono mt-0.5">{pro.licenseNumber}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Years of Experience</p>
 <p className="text-slate-805 mt-0.5">{pro.experience}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Languages Spoken</p>
 <p className="text-slate-805 mt-0.5">{pro.languages}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 7. Qualifications */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Award className="w-4 h-4 text-accent-light" />
 Qualifications & Certifications
 </h3>
 <div className="space-y-3.5 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Highest Qualification</p>
 <p className="text-primary mt-0.5">{pro.highestQual}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Additional Certifications</p>
 <p className="text-primary mt-0.5">{pro.additionalCerts}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Professional Registrations</p>
 <p className="text-primary mt-0.5">{pro.registrations}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 8. Availability */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Clock className="w-4 h-4 text-accent-light" />
 Availability Configuration
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Current Status</p>
 <p className="text-slate-805 mt-0.5">{pro.availability}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Last Availability Update</p>
 <p className="text-slate-805 mt-0.5">{pro.lastAvailUpdate}</p>
 </div>
 <div className="sm:col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Working Days</p>
 <p className="text-slate-805 mt-0.5">{pro.workingDays}</p>
 </div>
 <div className="sm:col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Working Hours</p>
 <p className="text-slate-850 mt-0.5">{pro.workingHours}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 10. Verification Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ShieldCheck className="w-4 h-4 text-accent-light" />
 Verification Information
 </h3>
 <div className="grid grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Status</p>
 <p className="text-slate-805 mt-0.5">{pro.verificationStatus}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Date</p>
 <p className="text-slate-805 mt-0.5">{pro.joinedDate}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verified By</p>
 <p className="text-slate-805 mt-0.5">{pro.verifiedBy}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Document Status</p>
 <p className="text-slate-805 mt-0.5">{pro.docStatus}</p>
 </div>
 </div>
 </DashboardCard>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 6. Organization Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Organization Info</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Organization Name", value: pro.organization },
 { label:"Organization ID", value: pro.organizationId },
 { label:"Branch", value: pro.branch },
 { label:"Joined Date", value: pro.joinedDate },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-border-light last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 9. Performance Metrics */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Performance Metrics</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Completed Bookings", value: pro.completedBookings },
 { label:"Cancelled Bookings", value: pro.cancelledBookings },
 { label:"Average Rating", value:`★ ${pro.rating.toFixed(1)}`},
 { label:"Patient Reviews", value: pro.reviewsCount },
 { label:"Response Time", value: pro.responseTime },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-border-light last:border-0 font-mono">
 <span className="text-slate-505 font-sans font-bold">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 11. Recent Activity */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <FileText className="w-4 h-4 text-accent-light" />
 Recent Activity
 </h3>
 <div className="relative border-l border-border space-y-4 ml-1">
 {MOCK_PRO_ACTIVITIES.map((act, idx) => (
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

 {/* 12. Actions */}
 <DashboardCard className="p-6 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Actions</h3>
 <div className="space-y-2">
 <SecondaryButton
 type="button"
 onClick={() => router.push("/admin/professionals")}
 className="w-full flex items-center justify-center gap-1.5 text-base"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Professionals
 </SecondaryButton>
 <button
 type="button"
 onClick={() => router.push(`/admin/agencies/${pro.organizationId}`)}
 className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-base font-extrabold text-white bg-accent-light hover:bg-accent-light transition-colors shadow-sm focus:outline-none"
 >
 <Briefcase className="w-3.5 h-3.5" />
 View Organization
 </button>
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
