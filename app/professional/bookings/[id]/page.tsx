"use client";

import React, { useEffect, useState } from"react";
import { useParams, useRouter } from"next/navigation";
import { ArrowLeft, Clock, CheckCircle2, CircleCheck, XCircle } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

const PATIENT_NAMES: Record<string, string> = {
"patient-1":"Arjun Mehta","patient-2":"Priya Sharma",
"patient-3":"Ravi Nair","patient-4":"Sunita Das",
};
const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];
const LOCATIONS = ["Jubilee Hills, Hyd","Gachibowli, Hyd","Madhapur, Hyd","Banjara Hills, Hyd"];
function derivedService(id: string) { return SERVICES[parseInt(id.replace(/\D/g,"0").slice(-2),10)%SERVICES.length]; }
function derivedLocation(id: string) { return LOCATIONS[parseInt(id.replace(/\D/g,"0").slice(-1),10)%LOCATIONS.length]; }
function bookingRef(id: string) { return`BK-${id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`; }

const STATUS_META: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
 [BookingStatus.Pending]: { label:"Pending", bg:"bg-bg text-accent-light border-amber-100", icon: <Clock className="w-3.5 h-3.5" /> },
 [BookingStatus.Confirmed]: { label:"Confirmed", bg:"bg-bg text-secondary border-blue-100", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
 [BookingStatus.Completed]: { label:"Completed", bg:"bg-accent-light text-accent border-emerald-100", icon: <CircleCheck className="w-3.5 h-3.5" /> },
 [BookingStatus.Cancelled]: { label:"Cancelled", bg:"bg-rose-50 text-rose-700 border-rose-100", icon: <XCircle className="w-3.5 h-3.5" /> },
};

function InfoRow({ label, value }: { label: string; value: string }) {
 return (
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">{label}</p>
 <p className="text-sm font-bold text-primary">{value ||"—"}</p>
 </div>
 );
}

export default function ProfessionalBookingDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [booking, setBooking] = useState<Booking | undefined>(undefined);
 const [proName, setProName] = useState("Loading...");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!id) return;
 Promise.all([bookingService.getBookings(), providerService.getProviders()])
 .then(([bks, pros]) => {
 const b = bks.find((bk) => bk.id === id);
 setBooking(b);
 if (b) {
 const pro = pros.find((p) => p.id === b.providerId);
 setProName(pro?.fullName ??"Unassigned");
 }
 })
 .catch(console.error)
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
 <Link href="/professional/bookings" className="text-accent-light hover:underline">Go back</Link>
 </div>
 );
 }

 const ref = bookingRef(booking.id);
 const meta = STATUS_META[booking.status];

 return (
 <div className="space-y-6 max-w-3xl mx-auto w-full">
 {/* Breadcrumb */}
 <Breadcrumb items={[
 { label:"Dashboard", href:"/professional/dashboard" },
 { label:"My Bookings", href:"/professional/bookings" },
 { label: ref },
 ]} />

 {/* Back */}
 <Link href="/professional/bookings" className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group">
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to My Bookings
 </Link>

 <SectionHeader title={`Booking ${ref}`} description={`${booking.date} at ${booking.time}`} />

 {/* Summary */}
 <DashboardCard className="p-6 space-y-5">
 <div className="flex items-center gap-6 flex-wrap">
 <span className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-base font-extrabold uppercase tracking-wide ${meta?.bg}`}>
 {meta?.icon}{meta?.label}
 </span>
 <span className="font-mono font-extrabold text-base text-accent-light">{ref}</span>
 </div>

 {/* Booking Information */}
 <div>
 <p className="text-base uppercase tracking-wider font-extrabold text-text-tertiary mb-3">Booking Information</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <InfoRow label="Booking ID" value={booking.id} />
 <InfoRow label="Status" value={booking.status} />
 <InfoRow label="Date" value={booking.date} />
 <InfoRow label="Time" value={booking.time} />
 </div>
 </div>

 {/* Patient Information */}
 <div className="border-t border-border-light pt-4">
 <p className="text-base uppercase tracking-wider font-extrabold text-text-tertiary mb-3">Patient Information</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <InfoRow label="Patient Name" value={PATIENT_NAMES[booking.patientId] ?? booking.patientId} />
 <InfoRow label="Patient ID" value={booking.patientId} />
 <InfoRow label="Location" value={derivedLocation(booking.id)} />
 </div>
 </div>

 {/* Service Information */}
 <div className="border-t border-border-light pt-4">
 <p className="text-base uppercase tracking-wider font-extrabold text-text-tertiary mb-3">Service Information</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <InfoRow label="Service" value={derivedService(booking.id)} />
 <InfoRow label="Duration" value="2 Hours" />
 <InfoRow label="Booking Type" value="Home Visit" />
 </div>
 </div>

 {/* Professional Information */}
 <div className="border-t border-border-light pt-4">
 <p className="text-base uppercase tracking-wider font-extrabold text-text-tertiary mb-3">Professional Information</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <InfoRow label="Assigned To" value={proName} />
 <InfoRow label="Provider ID" value={booking.providerId} />
 </div>
 </div>

 {/* Placeholder */}
 <div className="border-t border-dashed border-border pt-4 text-center space-y-1">
 <p className="text-sm font-extrabold text-text-tertiary">Professional Booking Detail</p>
 <p className="text-base text-text-tertiary">Full detail view will be implemented in a future phase.</p>
 </div>
 </DashboardCard>

 <div className="flex justify-start">
 <SecondaryButton type="button" onClick={() => router.push("/professional/bookings")} className="flex items-center gap-6 text-base">
 <ArrowLeft className="w-3.5 h-3.5" /> Back to My Bookings
 </SecondaryButton>
 </div>
 </div>
 );
}
