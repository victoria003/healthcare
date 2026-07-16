"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import { ArrowLeft, User, Phone, Mail, MapPin, ClipboardList, ShieldCheck, FileText, Star, Briefcase, Building2 } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { organizationService } from"@/lib/services/organization.service";
import { Booking, BookingStatus } from"@/types/booking";

const PATIENT_DETAILS: Record<string, {
 name: string;
 phone: string;
 email: string;
 address: string;
 emergencyContact: string;
}> = {
"patient-1": {
 name:"Arjun Mehta",
 phone:"+91 98765 43210",
 email:"arjun.mehta@gmail.com",
 address:"123 Care Street, Jubilee Hills, Hyderabad, Telangana, 500081",
 emergencyContact:"Sarah Mehta (Spouse) — +91 98765 99999",
 },
"patient-2": {
 name:"Priya Sharma",
 phone:"+91 91234 56789",
 email:"priya.sharma@gmail.com",
 address:"Flat 202, Fortune Towers, Madhapur, Hyderabad, Telangana, 500081",
 emergencyContact:"Rajesh Sharma (Father) — +91 91234 88888",
 },
"patient-3": {
 name:"Ravi Nair",
 phone:"+91 87654 32109",
 email:"ravi.nair@gmail.com",
 address:"House 10, Road No. 4, Banjara Hills, Hyderabad, Telangana, 500034",
 emergencyContact:"Gita Nair (Daughter) — +91 87654 77777",
 },
"patient-4": {
 name:"Sunita Das",
 phone:"+91 76543 21098",
 email:"sunita.das@gmail.com",
 address:"Flat 101, Prestige Apartments, Gachibowli, Hyderabad, Telangana, 500032",
 emergencyContact:"Debashis Das (Son) — +91 76543 66666",
 },
};

const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];

export default function AdminBookingDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [booking, setBooking] = useState<any>(null);

 useEffect(() => {
 if (!id) return;
 
 Promise.all([
 bookingService.getBookings(),
 providerService.getProviders(),
 organizationService.getOrganizations(),
 ])
 .then(([bookings, providers, organizations]) => {
 const found = bookings.find(b => b.id === id) || bookings[0];
 
 const idx = bookings.indexOf(found);
 const ref =`BK-${found.id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`;
 const serviceName = SERVICES[parseInt(found.id.replace(/\D/g,"0").slice(-2), 10) % SERVICES.length];

 // Patient info
 const patient = PATIENT_DETAILS[found.patientId] ?? {
 name:`Patient ${found.patientId}`,
 phone:"+91 99999 88888",
 email:"patient@homecare.in",
 address:"Home Address, Hyderabad",
 emergencyContact:"Emergency Contact — +91 99999 77777",
 };

 // Professional info
 const pro = providers.find(p => p.id === found.providerId) || providers[0];

 // Organization info
 const org = organizations.find(o => o.name === pro.organization) || organizations[0];

 const details = {
 id: found.id,
 ref,
 status: found.status,
 service: serviceName,
 date: found.date,
 time: found.time,
 duration:"2 Hours",
 bookingType: idx % 2 === 0 ?"Home Visit" :"Follow-up",
 patient: {
 id: found.patientId,
 ...patient,
 },
 professional: {
 id: pro.id,
 name: pro.fullName,
 category: pro.category,
 experience: pro.experience,
 organization: pro.organization,
 availability: pro.availability ||"Available Today",
 rating: pro.rating,
 },
 agency: {
 id: org.id,
 name: org.name,
 businessType:"Home Care Agency",
 phone:"+91 40 6678 9901",
 location: org.location,
 verificationStatus: org.verified ?"Verified" :"Pending",
 },
 createdDate:"2026-07-10",
 scheduledDate: found.date,
 completionDate: found.status === BookingStatus.Completed ? found.date :"—",
 };

 setBooking(details);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading admin booking details:", err);
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

 if (!booking) {
 return (
 <div className="text-center py-20 text-text-tertiary text-base font-semibold">
 Booking not found.{""}
 <Link href="/admin/bookings" className="text-accent-light hover:underline">
 Go back
 </Link>
 </div>
 );
 }

 const getStatusBadge = (status: string) => {
 let classes ="bg-bg-alt text-text-secondary";
 if (status === BookingStatus.Pending) {
 classes ="bg-bg text-accent-light border border-amber-100";
 } else if (status === BookingStatus.Confirmed) {
 classes ="bg-bg text-secondary border border-blue-100";
 } else if (status === BookingStatus.Completed) {
 classes ="bg-accent-light text-accent border border-emerald-100";
 } else if (status === BookingStatus.Cancelled) {
 classes ="bg-rose-50 text-rose-700 border border-rose-100";
 }
 return <span className={`px-3 py-2 rounded-xl text-base font-extrabold uppercase tracking-wide ${classes}`}>{status}</span>;
 };

 // Timeline steps config
 const steps = [
 { title:"Booking Created", time:"2026-07-10 10:00 AM", key:"created" },
 { title:"Professional Assigned", time:"2026-07-10 10:15 AM", key:"assigned" },
 { title:"Booking Confirmed", time:"2026-07-11 02:30 PM", key:"confirmed" },
 { title:"Visit Started", time:`${booking.date} ${booking.time}`, key:"started" },
 { title:"Visit Completed", time: booking.status === BookingStatus.Completed ?`${booking.date} 12:00 PM`:"—", key:"completed" },
 ];

 // Logic to color highlight current timeline index
 let activeIndex = 0;
 if (booking.status === BookingStatus.Pending) activeIndex = 1;
 else if (booking.status === BookingStatus.Confirmed) activeIndex = 2;
 else if (booking.status === BookingStatus.Completed) activeIndex = 4;
 else activeIndex = 3; // In Progress / Confirmed etc

 const isCancelled = booking.status === BookingStatus.Cancelled;

 return (
 <div className="space-y-6 max-w-6xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Bookings", href:"/admin/bookings" },
 { label:"Booking Detail" },
 ]}
 />

 {/* Back button */}
 <Link
 href="/admin/bookings"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Bookings
 </Link>

 {/* 2. Page Header */}
 <SectionHeader
 title="Booking Details"
 description="View complete booking parameters and timeline."
 />

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 
 {/* 3. Booking Summary Card */}
 <DashboardCard className="p-6 space-y-4 relative overflow-hidden">
 <div className="flex items-center justify-between gap-6 flex-wrap">
 <div>
 <h2 className="text-lg font-black text-primary flex items-center gap-6">
 Booking Reference: <span className="font-mono text-accent-light font-extrabold">{booking.ref}</span>
 </h2>
 <p className="text-base text-slate-450 font-bold uppercase tracking-wider mt-0.5">ID: {booking.id}</p>
 </div>
 {getStatusBadge(booking.status)}
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-bold pt-2 border-t border-border-light">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Service</p>
 <p className="text-primary mt-0.5">{booking.service}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Scheduled Date</p>
 <p className="text-slate-805 mt-0.5">{booking.date}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Scheduled Time</p>
 <p className="text-slate-805 mt-0.5 font-mono">{booking.time}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Duration & Type</p>
 <p className="text-slate-805 mt-0.5">{booking.duration} ({booking.bookingType})</p>
 </div>
 </div>
 <div className="absolute right-0 bottom-0 w-28 h-28 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 {/* 4. Patient Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <User className="w-4 h-4 text-accent-light" />
 Patient Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Patient Name</p>
 <p className="text-primary mt-0.5">{booking.patient.name}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Patient ID</p>
 <p className="text-primary mt-0.5 font-mono">{booking.patient.id}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Phone Number</p>
 <p className="text-primary mt-0.5">{booking.patient.phone}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Email</p>
 <p className="text-slate-850 mt-0.5 select-all">{booking.patient.email}</p>
 </div>
 <div className="sm:col-span-2">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Address</p>
 <p className="text-primary mt-0.5">{booking.patient.address}</p>
 </div>
 <div className="sm:col-span-2 border-t border-border-light pt-3">
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Emergency Contact</p>
 <p className="text-primary mt-0.5">{booking.patient.emergencyContact}</p>
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
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Professional Name</p>
 <p className="text-primary mt-0.5">{booking.professional.name}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Professional ID</p>
 <p className="text-slate-805 font-mono mt-0.5">{booking.professional.id}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Category</p>
 <p className="text-slate-805 mt-0.5">{booking.professional.category}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Experience & Rating</p>
 <p className="text-slate-805 mt-0.5">{booking.professional.experience} (★ {booking.professional.rating.toFixed(1)})</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Assigned Agency</p>
 <p className="text-slate-805 mt-0.5">{booking.professional.organization}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Availability Status</p>
 <p className="text-slate-805 mt-0.5">{booking.professional.availability}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 6. Agency Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ShieldCheck className="w-4 h-4 text-accent-light" />
 Agency Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Agency Name</p>
 <p className="text-primary mt-0.5">{booking.agency.name}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Agency ID</p>
 <p className="text-slate-805 font-mono mt-0.5">{booking.agency.id}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Business Type</p>
 <p className="text-slate-850 mt-0.5">{booking.agency.businessType}</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary font-extrabold">Location & Verification</p>
 <p className="text-slate-850 mt-0.5">{booking.agency.location} ({booking.agency.verificationStatus})</p>
 </div>
 </div>
 </DashboardCard>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 7. Booking Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Booking Info</h3>
 <div className="space-y-3 text-sm font-bold">
 {[
 { label:"Booking Reference", value: booking.ref },
 { label:"Booking Type", value: booking.bookingType },
 { label:"Service", value: booking.service },
 { label:"Visit Type", value:"Home Visit" },
 { label:"Created Date", value: booking.createdDate },
 { label:"Scheduled Date", value: booking.scheduledDate },
 { label:"Completion Date", value: booking.completionDate },
 { label:"Duration", value: booking.duration },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2.5 border-b border-border-light last:border-0">
 <span className="text-text-tertiary">{item.label}</span>
 <span className="text-slate-805 font-medium">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 8. Timeline */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Timeline</h3>
 <div className="relative border-l border-border space-y-4 ml-1 pt-1">
 {isCancelled ? (
 <div className="ml-4 relative text-sm">
 <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 border-2 border-white" />
 <p className="font-extrabold text-rose-600">Booking Cancelled</p>
 <p className="text-sm text-text-tertiary font-bold">{booking.date}</p>
 </div>
 ) : (
 steps.map((step, idx) => {
 const isPassed = idx <= activeIndex;
 const dotColor = isPassed ?"bg-accent-light border-accent-light" :"bg-slate-200 border-border";
 const textClass = isPassed ?"font-extrabold text-primary" :"font-bold text-text-tertiary";

 return (
 <div key={step.key} className="ml-4 relative text-sm">
 <div className={`absolute -left-[20px] w-2.5 h-2.5 rounded-full border-2 ${dotColor} mt-1`} />
 <p className={textClass}>{step.title}</p>
 <p className="text-sm text-text-tertiary font-bold">{step.time}</p>
 </div>
 );
 })
 )}
 </div>
 </DashboardCard>

 {/* 9. Notes */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Notes</h3>
 <div className="space-y-3 text-sm font-bold">
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary">Patient Notes</p>
 <p className="text-text-secondary mt-0.5">Please check vitals. Prefers morning appointments.</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary">Professional Notes</p>
 <p className="text-slate-650 mt-0.5">—</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary">Agency Notes</p>
 <p className="text-slate-650 mt-0.5">—</p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider text-text-tertiary">Administrator Notes</p>
 <p className="text-slate-650 mt-0.5">Auto-assigned based on proximity metrics.</p>
 </div>
 </div>
 </DashboardCard>

 {/* 10. Actions */}
 <DashboardCard className="p-6 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Actions</h3>
 <div className="space-y-2">
 <SecondaryButton
 type="button"
 onClick={() => router.push("/admin/bookings")}
 className="w-full flex items-center justify-center gap-1.5 text-base"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Bookings
 </SecondaryButton>
 <button
 type="button"
 onClick={() => router.push(`/admin/professionals/${booking.professional.id}`)}
 className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-base font-extrabold text-text-secondary bg-bg-alt border border-border hover:bg-slate-200 transition-colors shadow-sm focus:outline-none"
 >
 <User className="w-3.5 h-3.5" />
 View Professional
 </button>
 <button
 type="button"
 onClick={() => router.push(`/admin/agencies/${booking.agency.id}`)}
 className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-base font-extrabold text-text-secondary bg-bg-alt border border-border hover:bg-slate-200 transition-colors shadow-sm focus:outline-none"
 >
 <Building2 className="w-3.5 h-3.5" />
 View Agency
 </button>
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
