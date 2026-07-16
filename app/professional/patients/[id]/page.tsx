"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import { ArrowLeft, User, Phone, Mail, MapPin, ClipboardList, ShieldAlert, FileText } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { bookingService } from"@/lib/services/booking.service";
import { providerService } from"@/lib/services/provider.service";
import { patientService } from"@/lib/services/patient.service";
import { Booking, BookingStatus } from"@/types/booking";

// Helper static data mapping patient ID to additional details
const PATIENT_DETAILS: Record<string, {
 name: string;
 phone: string;
 email: string;
 gender: string;
 age: number;
 bloodGroup: string;
 allergies: string;
 conditions: string;
 notes: string;
 emergencyContact: {
 name: string;
 relationship: string;
 phone: string;
 };
}> = {
"patient-1": {
 name:"Arjun Mehta",
 phone:"+91 98765 43210",
 email:"arjun.mehta@gmail.com",
 gender:"Male",
 age: 45,
 bloodGroup:"O+",
 allergies:"Penicillin, Sulfonamides",
 conditions:"Hypertension",
 notes:"Requires assistance with mobility and transfers.",
 emergencyContact: {
 name:"Sarah Mehta",
 relationship:"Spouse",
 phone:"+91 98765 99999",
 },
 },
"patient-2": {
 name:"Priya Sharma",
 phone:"+91 91234 56789",
 email:"priya.sharma@gmail.com",
 gender:"Female",
 age: 32,
 bloodGroup:"A+",
 allergies:"None",
 conditions:"Diabetes Type 2",
 notes:"Requires monitoring of blood glucose levels post-exercise.",
 emergencyContact: {
 name:"Rajesh Sharma",
 relationship:"Father",
 phone:"+91 91234 88888",
 },
 },
"patient-3": {
 name:"Ravi Nair",
 phone:"+91 87654 32109",
 email:"ravi.nair@gmail.com",
 gender:"Male",
 age: 68,
 bloodGroup:"B+",
 allergies:"Sulfa drugs",
 conditions:"Arthritis, Mild Asthma",
 notes:"Needs help with nebulizer setup on dry days.",
 emergencyContact: {
 name:"Gita Nair",
 relationship:"Daughter",
 phone:"+91 87654 77777",
 },
 },
"patient-4": {
 name:"Sunita Das",
 phone:"+91 76543 21098",
 email:"sunita.das@gmail.com",
 gender:"Female",
 age: 57,
 bloodGroup:"O-",
 allergies:"Dust, Shellfish",
 conditions:"Post-surgery recovery",
 notes:"Incision care on lower right abdominal region.",
 emergencyContact: {
 name:"Debashis Das",
 relationship:"Son",
 phone:"+91 76543 66666",
 },
 },
};

const SERVICES = ["Home Nursing Care","Physiotherapy","Doctor Visit","Caregiver Support","Elder Care","Post-Surgery Recovery"];

function getPatientInfo(id: string) {
 return PATIENT_DETAILS[id] ?? {
 name:`Patient ${id.substring(id.length - 4)}`,
 phone:"+91 99999 88888",
 email:"patient@homecare.in",
 gender:"Other",
 age: 40,
 bloodGroup:"AB+",
 allergies:"None",
 conditions:"None",
 notes:"No specific medical notes available.",
 emergencyContact: {
 name:"Emergency Contact",
 relationship:"Spouse",
 phone:"+91 99999 77777",
 },
 };
}

export default function ProfessionalPatientDetailPage() {
 const { id } = useParams<{ id: string }>();
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [patient, setPatient] = useState<any>(null);
 const [assignedBooking, setAssignedBooking] = useState<Booking | null>(null);
 const [bookingHistory, setBookingHistory] = useState<any[]>([]);
 const [proName, setProName] = useState("Professional");
 const [orgName, setOrgName] = useState("Nisarga Health Agency");

 useEffect(() => {
 if (!id) return;
 Promise.all([
 bookingService.getBookings(),
 providerService.getProviders(),
 patientService.getPatient(),
 ])
 .then(([bookings, providers, patients]) => {
 // Retrieve info
 const patientsList = Array.isArray(patients) ? patients : [patients];
 const matchedPatient = patientsList.find(p => p.id === id);
 const name = matchedPatient ? (matchedPatient.fullName ||`${matchedPatient.firstName} ${matchedPatient.lastName}`) : getPatientInfo(id).name;
 const phone = matchedPatient ? matchedPatient.phone : getPatientInfo(id).phone;
 const email = matchedPatient ? matchedPatient.email : getPatientInfo(id).email;
 const gender = matchedPatient ?"Male" : getPatientInfo(id).gender;

 const info = {
 ...getPatientInfo(id),
 name,
 phone,
 email,
 gender,
 };
 const relativeBookings = bookings.filter((b) => b.patientId === id);
 const primary = relativeBookings[0] || null;

 // Current visit status
 let currentVisitStatus ="None";
 if (primary) {
 currentVisitStatus = primary.status === BookingStatus.Confirmed ?"In Progress" : primary.status;
 }

 // Assigned Professional / Org name
 if (primary) {
 const pro = providers.find((p) => p.id === primary.providerId);
 if (pro) {
 setProName(pro.fullName);
 setOrgName(pro.organization);
 }
 }

 setPatient({
 id,
 ...info,
 currentVisitStatus,
 });
 setAssignedBooking(primary);

 // Build history rows
 const history = relativeBookings.map((b) => {
 const ref =`BK-${b.id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`;
 const serviceName = SERVICES[parseInt(b.id.replace(/\D/g,"0").slice(-2), 10) % SERVICES.length];
 return {
 ref,
 date: b.date,
 service: serviceName,
 status: b.status,
 };
 });
 setBookingHistory(history);

 setLoading(false);
 })
 .catch((err) => {
 console.error("Error fetching patient details:", err);
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

 if (!patient) {
 return (
 <div className="text-center py-20 text-text-tertiary text-base font-semibold">
 Patient not found.{""}
 <Link href="/professional/patients" className="text-accent-light hover:underline">
 Go back
 </Link>
 </div>
 );
 }

 const primaryRef = assignedBooking ?`BK-${assignedBooking.id.replace(/\D/g,"").padStart(4,"0").slice(-4).toUpperCase()}`:"N/A";
 const primaryService = assignedBooking ? SERVICES[parseInt(assignedBooking.id.replace(/\D/g,"0").slice(-2), 10) % SERVICES.length] :"N/A";

 return (
 <div className="space-y-6 max-w-6xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/professional/dashboard" },
 { label:"Patients", href:"/professional/patients" },
 { label:"Patient Detail" },
 ]}
 />

 {/* Back button link */}
 <Link
 href="/professional/patients"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Patients
 </Link>

 {/* 2. Page Header */}
 <SectionHeader
 title="Patient Details"
 description="Review patient profile, contact and medical history."
 />

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 {/* 3. Patient Summary Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden">
 <div className="w-20 h-20 rounded-[28px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shrink-0">
 {patient.name.substring(0, 2)}
 </div>
 <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
 <h2 className="text-xl font-black text-primary">{patient.name}</h2>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-text-tertiary">
 <span className="font-bold">ID: {patient.id}</span>
 <span>·</span>
 <span>{patient.age} Yrs</span>
 <span>·</span>
 <span>{patient.gender}</span>
 <span>·</span>
 <span className="px-3 py-2.5 rounded-lg bg-bg text-accent-light font-extrabold text-base">Blood: {patient.bloodGroup}</span>
 </div>
 <div className="pt-2">
 <span className={`px-3 py-2 rounded-lg text-sm font-extrabold uppercase tracking-wide ${
 patient.currentVisitStatus ==="Completed"
 ?"bg-accent-light text-accent border border-emerald-100"
 :"bg-bg text-secondary border border-blue-100"
 }`}>
 {patient.currentVisitStatus}
 </span>
 </div>
 </div>
 <div className="absolute right-0 bottom-0 w-28 h-28 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 {/* 4. Contact Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Phone className="w-4 h-4 text-accent-light" />
 Contact Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Phone Number</p>
 <p className="font-bold text-primary">{patient.phone}</p>
 </div>
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Email Address</p>
 <p className="font-bold text-primary">{patient.email}</p>
 </div>
 <div className="space-y-0.5 sm:col-span-2">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Address</p>
 <p className="font-bold text-primary">123 Care Street, Jubilee Hills, Hyderabad, Telangana, 500081</p>
 </div>
 <div className="space-y-0.5 sm:col-span-2 border-t border-border-light pt-3">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Emergency Contact</p>
 <p className="font-bold text-primary">{patient.emergencyContact.name} ({patient.emergencyContact.relationship}) — {patient.emergencyContact.phone}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 5. Visit Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ClipboardList className="w-4 h-4 text-accent-light" />
 Visit Information
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Booking Reference</p>
 <p className="font-mono font-extrabold text-accent-light">{primaryRef}</p>
 </div>
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Service Category</p>
 <p className="font-bold text-primary">{primaryService}</p>
 </div>
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Scheduled Date</p>
 <p className="font-bold text-primary">{assignedBooking?.date ??"N/A"}</p>
 </div>
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Scheduled Time</p>
 <p className="font-bold text-primary">{assignedBooking?.time ??"N/A"}</p>
 </div>
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Assigned Organization</p>
 <p className="font-bold text-primary">{orgName}</p>
 </div>
 <div className="space-y-0.5">
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary">Assigned Professional</p>
 <p className="font-bold text-primary">{proName}</p>
 </div>
 </div>
 </DashboardCard>

 {/* 6. Medical Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <ShieldAlert className="w-4 h-4 text-accent-light" />
 Medical Information
 </h3>
 <div className="space-y-3 text-sm">
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Known Allergies</p>
 <p className="px-3 py-2 bg-rose-50 text-rose-700 rounded-xl font-bold border border-rose-100">
 {patient.allergies}
 </p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Existing Conditions</p>
 <p className="px-3 py-2 bg-bg-alt border border-slate-150 rounded-xl font-bold text-text-secondary">
 {patient.conditions}
 </p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Medical Notes</p>
 <p className="p-3 bg-bg-alt border border-slate-150 rounded-xl text-text-secondary leading-relaxed font-semibold">
 {patient.notes}
 </p>
 </div>
 </div>
 </DashboardCard>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 7. Booking History */}
 <DashboardCard className="p-8 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <FileText className="w-4 h-4 text-accent-light" />
 Booking History
 </h3>
 <div className="space-y-3">
 {bookingHistory.map((hist, i) => (
 <div key={i} className="p-3 border border-border-light rounded-2xl space-y-2">
 <div className="flex items-center justify-between gap-6">
 <span className="font-mono font-extrabold text-base text-accent-light">{hist.ref}</span>
 <span className={`px-3 py-2.5 rounded-lg text-[8px] font-extrabold uppercase ${
 hist.status === BookingStatus.Completed
 ?"bg-accent-light text-accent"
 : hist.status === BookingStatus.Confirmed
 ?"bg-bg text-secondary"
 :"bg-bg-alt text-text-secondary"
 }`}>
 {hist.status}
 </span>
 </div>
 <p className="text-base font-bold text-slate-850">{hist.service}</p>
 <p className="text-sm text-text-tertiary font-semibold">{hist.date}</p>
 </div>
 ))}
 </div>
 </DashboardCard>

 {/* 8. Notes */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Notes</h3>
 <div className="space-y-3 text-sm">
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Professional Notes</p>
 <p className="p-3 bg-bg-alt border border-slate-150 rounded-xl text-text-secondary leading-relaxed font-semibold">
 Checked vitals during the last visit. Pulse and BP within normal ranges. Continuing mobility routine.
 </p>
 </div>
 <div>
 <p className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary mb-1">Patient Notes</p>
 <p className="p-3 bg-bg-alt border border-slate-150 rounded-xl text-text-secondary leading-relaxed font-semibold">
 Prefers physiotherapist visit before noon due to afternoon fatigue.
 </p>
 </div>
 </div>
 </DashboardCard>

 {/* 9. Actions */}
 <DashboardCard className="p-6 space-y-3">
 <h3 className="text-base font-extrabold text-primary">Actions</h3>
 <div className="space-y-2">
 <SecondaryButton
 type="button"
 onClick={() => router.push("/professional/patients")}
 className="w-full flex items-center justify-center gap-1.5 text-base py-2.5"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back to Patients
 </SecondaryButton>
 <button
 type="button"
 onClick={() => router.push("/professional/bookings")}
 className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-base font-extrabold text-white bg-accent-light hover:bg-accent-light transition-all shadow-sm focus:outline-none"
 >
 <ClipboardList className="w-3.5 h-3.5" />
 View Booking
 </button>
 </div>
 </DashboardCard>
 </div>
 </div>
 </div>
 );
}
