"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import {
 ArrowLeft, Clock, CheckCircle2, CircleCheck, XCircle,
 ShieldCheck, Star, UserPlus, Ban, ExternalLink,
 ClipboardList, User, CalendarDays, FileText,
} from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { bookingService } from"@/lib/services/booking.service";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

// ── Deterministic helpers ─────────────────────────────────────────────────────

const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta",
"patient-2":"Priya Sharma",
"patient-3":"Ravi Nair",
"patient-4":"Sunita Das",
};
const PATIENT_PHONES: Record<string, string> = {
"patient-1":"+91 98765 43210",
"patient-2":"+91 91234 56789",
"patient-3":"+91 87654 32109",
"patient-4":"+91 76543 21098",
};
const PATIENT_EMAILS: Record<string, string> = {
"patient-1":"arjun.mehta@gmail.com",
"patient-2":"priya.sharma@gmail.com",
"patient-3":"ravi.nair@gmail.com",
"patient-4":"sunita.das@gmail.com",
};
const SERVICES = [
"Home Nursing Care","Physiotherapy","Doctor Visit",
"Caregiver Support","Elder Care","Post-Surgery Recovery",
];
function derivedService(id: string): string {
 const n = parseInt(id.replace(/\D/g,"0").slice(-2), 10);
 return SERVICES[n % SERVICES.length];
}
function bookingRef(id: string): string {
 return`BK-${id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`;
}

// ── Status metadata ───────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
 [BookingStatus.Pending]: {
 label:"Pending",
 bg:"bg-bg text-accent-light border-amber-100",
 icon: <Clock className="w-3.5 h-3.5" />,
 },
 [BookingStatus.Confirmed]: {
 label:"Confirmed",
 bg:"bg-bg text-secondary border-blue-100",
 icon: <CheckCircle2 className="w-3.5 h-3.5" />,
 },
 [BookingStatus.Completed]: {
 label:"Completed",
 bg:"bg-accent-light text-accent border-emerald-100",
 icon: <CircleCheck className="w-3.5 h-3.5" />,
 },
 [BookingStatus.Cancelled]: {
 label:"Cancelled",
 bg:"bg-rose-50 text-rose-700 border-rose-100",
 icon: <XCircle className="w-3.5 h-3.5" />,
 },
};

// ── Timeline step ─────────────────────────────────────────────────────────────

const TIMELINE_STEPS: { key: BookingStatus |"assigned"; label: string }[] = [
 { key: BookingStatus.Pending, label:"Booking Requested" },
 { key: BookingStatus.Confirmed, label:"Booking Confirmed" },
 { key:"assigned", label:"Professional Assigned" },
 { key: BookingStatus.Completed, label:"Completed" },
 { key: BookingStatus.Cancelled, label:"Cancelled" },
];

const STATUS_POSITION: Record<string, number> = {
 [BookingStatus.Pending]: 0,
 [BookingStatus.Confirmed]: 2,
 [BookingStatus.Completed]: 3,
 [BookingStatus.Cancelled]: 4,
};

// ── InfoRow helper ────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
 return (
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">{label}</p>
 <p className="text-sm font-bold text-primary">{value ||"—"}</p>
 </div>
 );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgencyBookingDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [booking, setBooking] = useState<Booking | undefined>(undefined);
 const [professional, setProfessional] = useState<MockProfessional | undefined>(undefined);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!id) return;
 setLoading(true);
 Promise.all([
 bookingService.getBookings(),
 providerService.getProviders(),
 ])
 .then(([bookings, providers]) => {
 const b = bookings.find((bk) => bk.id === id);
 setBooking(b);
 if (b) setProfessional(providers.find((p) => p.id === b.providerId));
 })
 .catch((err) => console.error("Error:", err))
 .finally(() => setLoading(false));
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
 <Link href="/agency/booking-requests" className="text-accent-light hover:underline">
 Go back
 </Link>
 </div>
 );
 }

 const ref = bookingRef(booking.id);
 const meta = STATUS_META[booking.status];
 const service = derivedService(booking.id);
 const stepIdx = STATUS_POSITION[booking.status] ?? 0;

 const patientName = PATIENT_NAMES[booking.patientId] ??`Patient ${booking.patientId}`;
 const patientPhone = PATIENT_PHONES[booking.patientId] ??"+91 00000 00000";
 const patientEmail = PATIENT_EMAILS[booking.patientId] ??`${booking.patientId}@example.com`;

 return (
 <div className="space-y-6 max-w-6xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/agency/dashboard" },
 { label:"Booking Requests", href:"/agency/booking-requests" },
 { label: ref },
 ]}
 />

 {/* Back */}
 <Link
 href="/agency/booking-requests"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Booking Requests
 </Link>

 {/* 2. Page Header */}
 <SectionHeader
 title="Booking Details"
 description="Review booking information and assigned professional."
 />

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* ── Left column (8-span) ── */}
 <div className="lg:col-span-8 space-y-6">

 {/* 3. Booking Summary Card */}
 <DashboardCard className="p-6 relative overflow-hidden">
 <div className="flex flex-wrap items-start justify-between gap-6">
 <div className="space-y-1">
 <div className="flex items-center gap-6">
 <ClipboardList className="w-5 h-5 text-accent-light" />
 <span className="font-mono font-extrabold text-lg text-accent-light">
 {ref}
 </span>
 </div>
 <div className="flex flex-wrap gap-6 text-sm text-text-tertiary font-semibold pt-1">
 <span className="flex items-center gap-1">
 <CalendarDays className="w-3.5 h-3.5" />
 {booking.date}
 </span>
 <span className="flex items-center gap-1">
 <Clock className="w-3.5 h-3.5" />
 {booking.time}
 </span>
 <span className="flex items-center gap-1">
 <FileText className="w-3.5 h-3.5" />
 {service}
 </span>
 </div>
 </div>
 <span className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-base font-extrabold uppercase tracking-wide ${meta?.bg}`}>
 {meta?.icon}
 {meta?.label}
 </span>
 </div>
 <div className="absolute right-0 bottom-0 w-24 h-24 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 {/* 4. Patient Information */}
 <DashboardCard className="p-6 space-y-4">
 <div className="flex items-center gap-6 mb-1">
 <User className="w-4 h-4 text-accent-light" />
 <h3 className="text-base font-extrabold text-primary">Patient Information</h3>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <InfoRow label="Patient Name" value={patientName} />
 <InfoRow label="Phone" value={patientPhone} />
 <InfoRow label="Email" value={patientEmail} />
 <InfoRow label="Address" value="Flat 4B, Green Valley Apts, Hyderabad" />
 <InfoRow label="Emergency Contact" value="+91 99876 54321" />
 </div>
 </DashboardCard>

 {/* 5. Booking Information */}
 <DashboardCard className="p-6 space-y-4">
 <div className="flex items-center gap-6 mb-1">
 <ClipboardList className="w-4 h-4 text-accent-light" />
 <h3 className="text-base font-extrabold text-primary">Booking Information</h3>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <InfoRow label="Service" value={service} />
 <InfoRow label="Duration" value="2 Hours" />
 <InfoRow label="Booking Type" value="Home Visit" />
 <InfoRow label="Created Date" value={booking.date} />
 <InfoRow label="Preferred Date" value={booking.date} />
 <InfoRow label="Preferred Time" value={booking.time} />
 </div>
 </DashboardCard>

 {/* 7. Timeline */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Timeline</h3>
 <ol className="relative border-l-2 border-border space-y-5 ml-3">
 {TIMELINE_STEPS.map((step, idx) => {
 const isCurrent = idx === stepIdx;
 const isDone = idx < stepIdx;
 const isCancel = step.key === BookingStatus.Cancelled;
 const isCancelActive = booking.status === BookingStatus.Cancelled && isCancel;

 let dotClass ="bg-slate-200 border-border";
 let labelClass ="text-text-tertiary";
 if (isDone) { dotClass ="bg-accent border-accent"; labelClass ="text-text-secondary"; }
 if (isCurrent && !isCancelActive) { dotClass ="bg-accent-light border-accent-light ring-4 ring-accent/20"; labelClass ="text-primary font-extrabold"; }
 if (isCancelActive) { dotClass ="bg-rose-500 border-rose-500 ring-4 ring-rose-500/20"; labelClass ="text-rose-600 font-extrabold"; }

 return (
 <li key={step.key} className="ml-5 relative">
 <div className={`absolute -left-[30px] w-4 h-4 rounded-full border-2 transition-all ${dotClass}`} />
 <p className={`text-sm transition-all ${labelClass}`}>{step.label}</p>
 {(isCurrent || isCancelActive) && (
 <p className="text-sm text-text-tertiary mt-0.5">Current status</p>
 )}
 </li>
 );
 })}
 </ol>
 </DashboardCard>

 {/* 8. Notes */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Notes</h3>
 <div className="space-y-3">
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Patient Notes</p>
 <p className="text-sm text-text-secondary bg-bg-alt border border-border-light rounded-xl p-3 leading-relaxed">
 Patient requires assistance with mobility. Please bring standard nursing kit. Prefers morning visits.
 </p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Agency Notes</p>
 <p className="text-sm text-text-secondary bg-bg-alt border border-border-light rounded-xl p-3 leading-relaxed">
 Verified contact details. Awaiting professional confirmation. Priority booking.
 </p>
 </div>
 </div>
 </DashboardCard>
 </div>

 {/* ── Right column (4-span) ── */}
 <div className="lg:col-span-4 space-y-6">

 {/* 6. Assigned Professional */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Assigned Professional</h3>
 {professional ? (
 <div className="space-y-4">
 <div className="flex items-center gap-6">
 <div className="w-12 h-12 rounded-[16px] bg-bg text-accent-light flex items-center justify-center font-black text-base uppercase border border-orange-100 overflow-hidden shrink-0">
 {professional.photo ? (
 <img src={professional.photo} alt={professional.fullName} className="w-full h-full object-cover" />
 ) : (
 professional.fullName.substring(0, 2)
 )}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-1.5 flex-wrap">
 <p className="font-extrabold text-base text-primary">{professional.fullName}</p>
 {professional.verified && (
 <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
 )}
 </div>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wide">{professional.category}</p>
 </div>
 </div>
 <div className="space-y-2 text-base">
 <div className="flex items-center justify-between">
 <span className="text-text-tertiary font-bold">Experience</span>
 <span className="text-text-secondary font-semibold">{professional.experience}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-text-tertiary font-bold">Rating</span>
 <span className="flex items-center gap-1 text-accent-light font-bold">
 <Star className="w-3 h-3 fill-current" />
 {professional.rating.toFixed(1)}
 </span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-text-tertiary font-bold">Availability</span>
 <span className="text-text-secondary font-semibold">{professional.availability}</span>
 </div>
 </div>
 <button
 onClick={() => router.push(`/agency/professionals/${professional.id}`)}
 className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-base font-extrabold text-accent-light bg-bg border border-orange-100 hover:bg-bg :bg-orange-950/40 transition-colors"
 >
 <ExternalLink className="w-3 h-3" />
 View Professional
 </button>
 </div>
 ) : (
 <div className="text-center py-4 text-text-tertiary text-sm font-semibold">
 No professional assigned yet.
 </div>
 )}
 </DashboardCard>

 {/* 9. Actions */}
 <DashboardCard className="p-6 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Actions</h3>
 <div className="space-y-2">
 <SecondaryButton
 type="button"
 onClick={() => router.push("/agency/booking-requests")}
 className="w-full flex items-center justify-center gap-1.5 text-base"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Booking Requests
 </SecondaryButton>
 <PrimaryButton
 type="button"
 disabled
 className="w-full flex items-center justify-center gap-1.5 text-base opacity-50 cursor-not-allowed"
 >
 <UserPlus className="w-3.5 h-3.5" />
 Assign Professional
 </PrimaryButton>
 <button
 type="button"
 disabled
 className="w-full flex items-center justify-center gap-1.5 py-2.5 text-base font-extrabold rounded-xl bg-rose-50 text-rose-500 border border-rose-100 opacity-50 cursor-not-allowed"
 >
 <Ban className="w-3.5 h-3.5" />
 Cancel Booking
 </button>
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
