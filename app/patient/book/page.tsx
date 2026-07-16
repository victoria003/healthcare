"use client";

import React, { useState, useEffect, Suspense } from"react";
import { useSearchParams, useRouter } from"next/navigation";
import {
 CheckCircle2,
 ShieldCheck,
 Calendar,
 Clock,
 MapPin,
 FileText,
 ArrowRight,
 ArrowLeft,
 Briefcase,
 Activity,
 Heart,
 Stethoscope,
 Users,
 Building2,
 UserCheck,
 Check
} from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import TextInput from"@/components/forms/TextInput";
import TextAreaInput from"@/components/forms/TextAreaInput";
import DateInput from"@/components/forms/DateInput";
import TimeSlotSelector from"@/components/forms/TimeSlotSelector";
import ReviewCard from"@/components/forms/ReviewCard";
import { providerService, MockProfessional } from"@/lib/services/provider.service";

function BookingWizardContent() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const providerId = searchParams ? searchParams.get("providerId") ||"p1" :"p1";

 const [provider, setProvider] = useState<MockProfessional | undefined>(undefined);
 const [step, setStep] = useState(1);
 const [bookingRef] = useState(() =>`HC-2026-${Math.floor(100000 + Math.random() * 900000)}`);
 
 // Wizard State
 const [formData, setFormData] = useState({
 service:"General Consultation",
 date:"",
 time:"",
 addressLine1:"",
 addressLine2:"",
 city:"",
 state:"",
 pincode:"",
 landmark:"",
 contactNumber:"",
 symptoms:"",
 medicalConditions:"",
 notes:"",
 });

 const [errors, setErrors] = useState<Record<string, string>>({});

 useEffect(() => {
 providerService.getProviderById(providerId).then((data) => {
 setProvider(data);
 });
 }, [providerId]);

 // Available slots list
 const mockTimeSlots = [
"09:00 AM",
"09:30 AM",
"10:00 AM",
"10:30 AM",
"11:00 AM",
"11:30 AM",
"02:00 PM",
"02:30 PM",
"03:00 PM",
"03:30 PM",
 ];

 // Services options list (enriching details)
 const serviceOptions = [
 { label:"General Consultation", desc:"Standard clinical health assessment and vitals check.", icon: <Stethoscope className="w-5 h-5" />, price:"₹499" },
 { label:"Nursing Care", desc:"Wound care, IV dressing and clinical nurse assistance.", icon: <UserCheck className="w-5 h-5" />, price:"₹599" },
 { label:"Physiotherapy", desc:"Recovery workouts and pain rehabilitation sessions.", icon: <Activity className="w-5 h-5" />, price:"₹649" },
 { label:"Caregiver", desc:"Elderly support, daily routines and companion care.", icon: <Heart className="w-5 h-5" />, price:"₹450" },
 { label:"Patient Attender", desc:"Bedside assistance and physical patient transfer.", icon: <Users className="w-5 h-5" />, price:"₹400" },
 { label:"Doctor Home Visit", desc:"Specialist consultation directly in your home.", icon: <Building2 className="w-5 h-5" />, price:"₹799" },
 ];

 // Inline Validation
 const validateStep = (currentStep: number) => {
 const nextErrors: Record<string, string> = {};
 if (currentStep === 2 && !formData.date) {
 nextErrors.date ="Please select a booking date.";
 }
 if (currentStep === 3 && !formData.time) {
 nextErrors.time ="Please select a preferred time slot.";
 }
 if (currentStep === 4) {
 if (!formData.addressLine1) nextErrors.addressLine1 ="Address Line 1 is required.";
 if (!formData.city) nextErrors.city ="City is required.";
 if (!formData.state) nextErrors.state ="State is required.";
 if (!formData.pincode) nextErrors.pincode ="Pincode is required.";
 if (!formData.contactNumber) nextErrors.contactNumber ="Contact number is required.";
 }
 setErrors(nextErrors);
 return Object.keys(nextErrors).length === 0;
 };

 const handleNext = () => {
 if (validateStep(step)) {
 setStep((prev) => prev + 1);
 }
 };

 const handlePrevious = () => {
 setStep((prev) => prev - 1);
 };

 const handleCancel = () => {
 router.push(`/patient/provider/${providerId}`);
 };

 const handleFinish = () => {
 if (validateStep(step)) {
 setStep(7); // Jump directly to Step 7 (Confirmation Success page)
 }
 };

 // Static step navigation definitions
 const stepTitles = ["Choose Service","Select Date","Pick Time Slot","Service Address","Medical Notes","Review & Submit"];

 return (
 <div className="max-w-[1200px] mx-auto w-full space-y-12 px-5 md:px-8 lg:px-10 py-6">
 {/* 1. Breadcrumb Navigation */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/patient/dashboard" },
 { label:"Explore Care", href:"/patient/explore" },
 {
 label: provider ? provider.fullName :"Provider Profile",
 href:`/patient/provider/${providerId}`,
 },
 { label:"Booking Wizard" },
 ]}
 />

 {/* 2. Page Title Header */}
 <div className="space-y-1">
 <h1 className="text-3xl font-bold tracking-tight text-primary">
 Booking Wizard
 </h1>
 <p className="text-base text-text-tertiary font-medium">
 Confirm your details and customize your diagnostic home care appointment.
 </p>
 </div>

 {/* 3. Steps Connected Progress Line */}
 {step < 7 && (
 <div className="bg-white [#12121a] border border-border/60 p-6 rounded-[24px] shadow-xs">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 select-none">
 {stepTitles.map((title, index) => {
 const currentNum = index + 1;
 const isCompleted = step > currentNum;
 const isActive = step === currentNum;
 return (
 <div key={title} className="flex-1 w-full">
 <div className="flex items-center gap-6">
 {/* Circle badge */}
 <div
 className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
 isCompleted
 ?"bg-accent text-white"
 : isActive
 ?"bg-accent-light text-white ring-4 ring-accent/25"
 :"bg-bg-alt text-text-tertiary"
 }`}
 >
 {isCompleted ? <Check className="w-4 h-4" /> : currentNum}
 </div>
 {/* Label details */}
 <div className="min-w-0">
 <p className={`text-[12px] font-semibold truncate leading-none ${isActive ?"text-primary" :"text-text-tertiary"}`}>
 {title}
 </p>
 <p className="text-base text-text-tertiary mt-1 leading-none">Step {currentNum}</p>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {/* 4. Two-column grid (Left: Form Step card, Right: Sticky Summary Details) */}
 {step < 7 ? (
 <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
 
 {/* Left Column (70% - 7 spans) */}
 <div className="lg:col-span-7 bg-white [#12121a] border border-border/60 rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
 
 {/* Step Content Renderers */}
 {step === 1 && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-primary">{stepTitles[0]}</h3>
 <p className="text-base text-slate-455 mt-1">Select the type of clinical home assistance you require today.</p>
 </div>
 
 {/* Custom Selection Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 {serviceOptions.map((opt) => {
 const isSelected = formData.service === opt.label;
 return (
 <button
 key={opt.label}
 type="button"
 onClick={() => setFormData({ ...formData, service: opt.label })}
 className={`p-6 rounded-2xl border text-left flex items-start gap-6 transition-all relative ${
 isSelected
 ?"border-accent-light bg-bg/10 shadow-sm"
 :"border-border/60 hover:bg-bg-alt :bg-primary/40"
 }`}
 >
 <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ?"bg-accent-light text-white" :"bg-bg-alt text-text-tertiary"}`}>
 {opt.icon}
 </div>
 <div className="min-w-0 pr-6">
 <h4 className="font-semibold text-base text-primary truncate">{opt.label}</h4>
 <p className="text-[12px] text-slate-455 mt-1 leading-relaxed">{opt.desc}</p>
 <span className="inline-block mt-2 text-sm font-semibold text-accent-light bg-bg px-3 py-2.5 rounded-lg">
 {opt.price}
 </span>
 </div>
 {isSelected && (
 <div className="absolute right-3.5 top-3.5 w-4 h-4 rounded-full bg-accent-light text-white flex items-center justify-center">
 <Check className="w-2.5 h-2.5" />
 </div>
 )}
 </button>
 );
 })}
 </div>
 </div>
 )}

 {step === 2 && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-primary">{stepTitles[1]}</h3>
 <p className="text-base text-slate-455 mt-1">Select a convenient calendar date for your home visit appointment.</p>
 </div>
 <div className="max-w-md">
 <DateInput
 value={formData.date}
 required
 error={errors.date}
 onChange={(e) => {
 setFormData({ ...formData, date: e.target.value });
 setErrors({ ...errors, date:"" });
 }}
 />
 </div>
 </div>
 )}

 {step === 3 && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-primary">{stepTitles[2]}</h3>
 <p className="text-base text-slate-455 mt-1">Select a preferred time slot from the provider&apos;s general availability roster.</p>
 </div>
 <TimeSlotSelector
 slots={mockTimeSlots}
 selectedSlot={formData.time}
 error={errors.time}
 onSelectSlot={(slot) => {
 setFormData({ ...formData, time: slot });
 setErrors({ ...errors, time:"" });
 }}
 />
 </div>
 )}

 {step === 4 && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-primary">{stepTitles[3]}</h3>
 <p className="text-base text-slate-455 mt-1">Provide precise home address details for the care appointment.</p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="sm:col-span-2">
 <TextInput
 label="Address Line 1"
 placeholder="Street name, building/apartment number"
 value={formData.addressLine1}
 required
 error={errors.addressLine1}
 onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
 />
 </div>
 <div className="sm:col-span-2">
 <TextInput
 label="Address Line 2"
 placeholder="Suite, unit, block, floor (optional)"
 value={formData.addressLine2}
 onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
 />
 </div>
 <TextInput
 label="City"
 placeholder="Hyderabad"
 value={formData.city}
 required
 error={errors.city}
 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
 />
 <TextInput
 label="State"
 placeholder="Telangana"
 value={formData.state}
 required
 error={errors.state}
 onChange={(e) => setFormData({ ...formData, state: e.target.value })}
 />
 <TextInput
 label="Pincode"
 placeholder="500001"
 value={formData.pincode}
 required
 error={errors.pincode}
 onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
 />
 <TextInput
 label="Landmark"
 placeholder="Near central park (optional)"
 value={formData.landmark}
 onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
 />
 <div className="sm:col-span-2">
 <TextInput
 label="Contact Number"
 placeholder="+91 98765 43210"
 value={formData.contactNumber}
 required
 error={errors.contactNumber}
 onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
 />
 </div>
 </div>
 </div>
 )}

 {step === 5 && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-primary">{stepTitles[4]}</h3>
 <p className="text-base text-slate-455 mt-1">Detail present symptoms or preexisting conditions to align clinical diagnostics.</p>
 </div>
 <div className="space-y-6">
 <TextAreaInput
 label="Symptoms"
 placeholder="Briefly describe what symptoms you are experiencing today..."
 value={formData.symptoms}
 onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
 />
 <TextAreaInput
 label="Existing Medical Conditions"
 placeholder="List any active medical diagnoses, allergies, or medications..."
 value={formData.medicalConditions}
 onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
 />
 <TextAreaInput
 label="Additional Notes"
 placeholder="Any special entry instructions or caregiver directions..."
 value={formData.notes}
 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
 />
 </div>
 </div>
 )}

 {step === 6 && (
 <div className="space-y-6">
 <div>
 <h3 className="text-lg font-semibold text-primary">{stepTitles[5]}</h3>
 <p className="text-base text-slate-455 mt-1">Assert validation checks on booking details prior to sending requests.</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <ReviewCard
 title="Service & Provider"
 items={[
 { label:"Provider", value: provider ? provider.fullName :"Provider Profile" },
 { label:"Category", value: provider ? provider.category :"N/A" },
 { label:"Selected Service", value: formData.service },
 ]}
 />
 <ReviewCard
 title="Schedule Details"
 items={[
 { label:"Selected Date", value: formData.date },
 { label:"Selected Time", value: formData.time },
 ]}
 />
 <div className="md:col-span-2">
 <ReviewCard
 title="Service Address & Contact"
 items={[
 {
 label:"Address",
 value:`${formData.addressLine1}${formData.addressLine2 ?"," + formData.addressLine2 :""}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
 },
 { label:"Landmark", value: formData.landmark ||"None" },
 { label:"Contact Number", value: formData.contactNumber },
 ]}
 />
 </div>
 <div className="md:col-span-2">
 <ReviewCard
 title="Clinical Information"
 items={[
 { label:"Symptoms", value: formData.symptoms ||"None declared" },
 { label:"Existing Conditions", value: formData.medicalConditions ||"None declared" },
 { label:"Additional Instructions", value: formData.notes ||"None" },
 ]}
 />
 </div>
 </div>
 </div>
 )}

 {/* Flat Navigation inside Form Panel */}
 <div className="flex items-center gap-6 pt-6 border-t border-border-light">
 {step > 1 ? (
 <SecondaryButton
 type="button"
 onClick={handlePrevious}
 className="px-6 py-2.5 flex items-center gap-1.5"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Back
 </SecondaryButton>
 ) : (
 <SecondaryButton
 type="button"
 onClick={handleCancel}
 className="px-6 py-2.5"
 >
 Cancel
 </SecondaryButton>
 )}
 
 <div className="ml-auto">
 {step < 6 ? (
 <PrimaryButton
 type="button"
 onClick={handleNext}
 className="px-6 py-2.5 flex items-center gap-1.5"
 >
 Next Step
 <ArrowRight className="w-3.5 h-3.5" />
 </PrimaryButton>
 ) : (
 <PrimaryButton
 type="button"
 onClick={handleFinish}
 className="px-6 py-2.5 flex items-center gap-1.5"
 >
 Submit Booking Request
 </PrimaryButton>
 )}
 </div>
 </div>

 </div>

 {/* Right Column (30% - 3 spans, Sticky Booking Summary) */}
 <div className="lg:col-span-3 space-y-6 sticky top-24 z-20">
 <div className="bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-sm space-y-6">
 <h3 className="text-base font-semibold text-primary pb-3 border-b border-border-light">
 Booking Summary
 </h3>

 {/* Provider Info Card */}
 {provider && (
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-full bg-accent-light text-white flex items-center justify-center font-bold text-base uppercase shrink-0">
 {provider.fullName.charAt(0)}
 </div>
 <div className="min-w-0">
 <h4 className="font-semibold text-sm text-primary truncate">{provider.fullName}</h4>
 <p className="text-base text-slate-455 truncate">{provider.category} &middot; {provider.organization}</p>
 </div>
 </div>
 )}

 {/* Selected fields metrics list */}
 <div className="space-y-3.5 text-sm text-slate-650">
 <div className="flex justify-between items-center">
 <span>Selected Service</span>
 <span className="font-semibold text-slate-850">{formData.service}</span>
 </div>
 <div className="flex justify-between items-center">
 <span>Consulting Date</span>
 <span className="font-semibold text-slate-850">{formData.date ||"Not selected"}</span>
 </div>
 <div className="flex justify-between items-center">
 <span>Time Slot</span>
 <span className="font-semibold text-slate-850">{formData.time ||"Not selected"}</span>
 </div>
 <div className="flex justify-between items-center">
 <span>Estimated Duration</span>
 <span className="font-semibold text-slate-850">1.5 Hours</span>
 </div>
 <div className="border-t border-border-light pt-3 flex justify-between items-center text-base font-semibold">
 <span className="text-primary">Consulting Fee</span>
 <span className="text-primary">Starting at ₹499/hr</span>
 </div>
 </div>
 </div>
 </div>

 </div>
 ) : (
 /* Step 7: Confirmation Success Layout */
 <DashboardCard className="p-8 sm:p-12 text-center max-w-xl mx-auto flex flex-col items-center rounded-[24px]">
 <div className="w-16 h-16 rounded-full bg-accent-light text-accent flex items-center justify-center mb-6 border border-emerald-100/30 shadow-inner">
 <CheckCircle2 className="w-8 h-8" />
 </div>
 <h1 className="text-3xl font-bold text-primary tracking-tight">
 Booking Confirmed 🎉
 </h1>
 <p className="text-base text-text-tertiary mt-3 max-w-sm leading-relaxed">
 Your clinical caregiver booking request has been submitted successfully. The health partner will review and connect shortly.
 </p>

 <div className="my-6 px-6 py-4 bg-bg-alt/50 rounded-2xl border border-border/60 text-sm">
 <span className="font-bold text-base uppercase tracking-wider text-text-tertiary block mb-1">
 Booking Reference Number
 </span>
 <strong className="text-primary text-base font-extrabold tracking-wide">
 {bookingRef}
 </strong>
 </div>

 <div className="flex flex-col sm:flex-row gap-6 w-full justify-center pt-2">
 <PrimaryButton onClick={() => router.push("/patient/bookings")} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold">
 View Booking Details
 </PrimaryButton>
 <SecondaryButton onClick={() => router.push("/patient/dashboard")} className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold">
 Return to Dashboard
 </SecondaryButton>
 </div>
 </DashboardCard>
 )}
 </div>
 );
}

export default function BookingWizardPage() {
 return (
 <Suspense fallback={
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 }>
 <BookingWizardContent />
 </Suspense>
 );
}
