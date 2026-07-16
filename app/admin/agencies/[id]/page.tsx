"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import { ArrowLeft, Building2, Phone, Mail, MapPin, ClipboardList, ShieldCheck, FileText, Star } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { organizationService } from"@/lib/services/organization.service";

interface ActivityRow {
 date: string;
 activity: string;
 status: string;
}

const MOCK_AGENCY_ACTIVITIES: ActivityRow[] = [
 { date:"2026-07-14", activity:"New professional profile added: Nurse Kavya", status:"Success" },
 { date:"2026-07-13", activity:"Weekly analytics performance report generated", status:"Completed" },
 { date:"2026-07-12", activity:"Completed verification document checks", status:"Verified" },
 { date:"2026-07-11", activity:"Assigned doctor Suresh Kumar to patient Arjun Mehta", status:"Success" },
];

export default function AdminAgencyDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [agencyProfile, setAgencyProfile] = useState<any>(null);

 useEffect(() => {
 if (!id) return;
 
 organizationService.getOrganizations()
 .then((orgs) => {
 const org = orgs.find(o => o.id === id) || orgs[0];
 
 const bizTypes = ["Home Care Agency","Hospital","Clinic","NGO","Healthcare Provider"];
 const states = ["Telangana","Karnataka","Maharashtra"];
 const idx = orgs.indexOf(org);

 const profile = {
 id: org.id,
 name: org.name,
 logo: org.logo,
 businessType: bizTypes[idx % bizTypes.length],
 registrationNumber:`REG-${org.id.toUpperCase()}-9900`,
 state: states[idx % states.length],
 rating: org.rating,
 verified: org.verified,
 status: org.verified ?"Active" :"Suspended",
 verificationStatus: org.verified ?"Verified" :"Pending",
 email:`contact@${org.name.toLowerCase().replace(/\s+/g,"")}.org`,
 phone:"+91 40 6678 9901",
 gstNumber:`36AAAAA1111A1Z${idx}`,
 website:`https://${org.name.toLowerCase().replace(/\s+/g,"")}.org`,
 description:`Established agency offering high quality, patient-focused medical care including home visits, bedside nursing, and physiotherapy services in Jubilee Hills and surrounding locations.`,
 address1:"Plot 120, Road No 10",
 address2:"Near Metro Station, Jubilee Hills",
 city:"Hyderabad",
 pincode:"500033",
 country:"India",
 emergencyContact:"Emergency Desk — +91 40 6678 9999",
 regDate:"2026-07-11",
 licenseNumber:`LIC-${org.id.toUpperCase()}-7711`,
 licenseExpiry:"2028-07-10",
 taxReg:"GST IN/UID Registered",
 verifiedBy:"Platform Compliance Specialist",
 docStatus:"All Documents Verified",
 };

 setAgencyProfile(profile);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error fetching admin agency details:", err);
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

 if (!agencyProfile) {
 return (
 <div className="text-center py-20 text-text-tertiary text-base font-semibold">
 Agency profile not found.{""}
 <Link href="/admin/agencies" className="text-accent-light hover:underline">
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
 { label:"Agencies", href:"/admin/agencies" },
 { label:"Agency Detail" },
 ]}
 />

 {/* Back button */}
 <Link
 href="/admin/agencies"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Agencies
 </Link>

 {/* 2. Page Header */}
 <SectionHeader
 title="Agency Details"
 description="View detailed information for this organization."
 />

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 
 {/* 3. Agency Summary Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden">
 <div className="w-20 h-20 rounded-[28px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shrink-0">
 {agencyProfile.name.substring(0, 2)}
 </div>
 <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
 <h2 className="text-xl font-black text-primary">{agencyProfile.name}</h2>
 <span className={`px-3 py-2.5 rounded-full text-sm font-extrabold uppercase ${
 agencyProfile.verificationStatus ==="Verified"
 ?"bg-accent-light text-accent border border-emerald-100"
 :"bg-bg text-accent-light border border-amber-100"
 }`}>
 {agencyProfile.verificationStatus}
 </span>
 </div>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-text-tertiary font-bold">
 <span>ID: {agencyProfile.id}</span>
 <span>·</span>
 <span>Type: {agencyProfile.businessType}</span>
 <span>·</span>
 <span className="flex items-center gap-1">
 <Star className="w-3.5 h-3.5 text-accent-light fill-current" />
 {agencyProfile.rating.toFixed(1)}
 </span>
 <span>·</span>
 <span>Since: {agencyProfile.regDate}</span>
 </div>
 <div className="pt-2">
 <span className={`px-3 py-2 rounded-lg text-sm font-extrabold uppercase tracking-wide ${
 agencyProfile.status ==="Active"
 ?"bg-accent-light text-accent"
 :"bg-rose-50 text-rose-700"
 }`}>
 {agencyProfile.status}
 </span>
 </div>
 </div>
 <div className="absolute right-0 bottom-0 w-28 h-28 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 {/* 4. Organization Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Building2 className="w-4 h-4 text-accent-light" />
 Organization Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Organization Name</p>
 <p className="text-primary mt-0.5">{agencyProfile.name}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Business Type</p>
 <p className="text-primary mt-0.5">{agencyProfile.businessType}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Registration Number</p>
 <p className="text-primary mt-0.5 font-mono">{agencyProfile.registrationNumber}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">GST Number</p>
 <p className="text-primary mt-0.5 font-mono">{agencyProfile.gstNumber}</p>
 </div>
 <div className="sm:col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Website</p>
 <p className="text-primary mt-0.5 select-all">{agencyProfile.website}</p>
 </div>
 <div className="sm:col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Description</p>
 <p className="text-text-secondary leading-relaxed font-semibold mt-0.5">{agencyProfile.description}</p>
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
 <p className="text-primary mt-0.5 select-all">{agencyProfile.email}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Phone Number</p>
 <p className="text-primary mt-0.5">{agencyProfile.phone}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Address Line 1</p>
 <p className="text-primary mt-0.5">{agencyProfile.address1}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Address Line 2</p>
 <p className="text-primary mt-0.5">{agencyProfile.address2}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">City & State</p>
 <p className="text-primary mt-0.5">{agencyProfile.city}, {agencyProfile.state}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Pincode & Country</p>
 <p className="text-primary mt-0.5">{agencyProfile.pincode}, {agencyProfile.country}</p>
 </div>
 <div className="sm:col-span-2 border-t border-border-light pt-3">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Emergency Contact Desk</p>
 <p className="text-primary mt-0.5">{agencyProfile.emergencyContact}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 7. Services Offered */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ClipboardList className="w-4 h-4 text-accent-light" />
 Services Offered
 </h3>
 <div className="flex flex-wrap gap-6">
 {["Doctors","Nurses","Caregivers","Physiotherapists","Patient Attenders","Home Visits"].map((svc) => (
 <span
 key={svc}
 className="px-3 py-2.5 rounded-xl bg-bg-alt border border-border text-text-secondary text-base font-extrabold uppercase tracking-wide"
 >
 {svc}
 </span>
 ))}
 </div>
 </DashboardCard>

 {/* 8. Verification Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ShieldCheck className="w-4 h-4 text-accent-light" />
 Verification Information
 </h3>
 <div className="grid grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Status</p>
 <p className="text-primary mt-0.5">{agencyProfile.verificationStatus}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verification Date</p>
 <p className="text-primary mt-0.5">{agencyProfile.regDate}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Verified By</p>
 <p className="text-primary mt-0.5">{agencyProfile.verifiedBy}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Document Verification Status</p>
 <p className="text-primary mt-0.5">{agencyProfile.docStatus}</p>
 </div>
 </div>
 </DashboardCard>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 6. Registration Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Registration Information</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Registration Date", value: agencyProfile.regDate },
 { label:"License Number", value: agencyProfile.licenseNumber },
 { label:"License Expiry", value: agencyProfile.licenseExpiry },
 { label:"Tax Registration", value: agencyProfile.taxReg },
 { label:"Organization Status", value: agencyProfile.status },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-border-light last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 9. Recent Activity */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <FileText className="w-4 h-4 text-accent-light" />
 Recent Activity
 </h3>
 <div className="relative border-l border-border space-y-4 ml-1">
 {MOCK_AGENCY_ACTIVITIES.map((act, idx) => (
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

 {/* 10. Actions */}
 <DashboardCard className="p-6 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Actions</h3>
 <div className="space-y-2">
 <SecondaryButton
 type="button"
 onClick={() => router.push("/admin/agencies")}
 className="w-full flex items-center justify-center gap-1.5 text-base"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Agencies
 </SecondaryButton>
 <button
 type="button"
 onClick={() => router.push("/admin/professionals")}
 className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-base font-extrabold text-white bg-accent-light hover:bg-accent-light transition-colors shadow-sm focus:outline-none"
 >
 <Building2 className="w-3.5 h-3.5" />
 View Professionals
 </button>
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
