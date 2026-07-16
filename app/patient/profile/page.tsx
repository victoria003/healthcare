"use client";

import React, { useState, useEffect } from"react";
import { User, ShieldCheck, Mail, Phone, Calendar, Heart, Save, AlertCircle, Edit2, ShieldAlert, Award, MapPin } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import FormLayout from"@/components/forms/FormLayout";
import FormSection from"@/components/forms/FormSection";
import TextInput from"@/components/forms/TextInput";
import SelectInput from"@/components/forms/SelectInput";
import TextAreaInput from"@/components/forms/TextAreaInput";
import Switch from"@/components/forms/Switch";
import { patientService } from"@/lib/services/patient.service";
import { PatientProfile } from"@/types/patient";

export default function PatientProfilePage() {
 const [profile, setProfile] = useState<PatientProfile | null>(null);
 
 // Local state form data
 const [formData, setFormData] = useState({
 firstName:"",
 lastName:"",
 dob:"",
 gender:"",
 email:"",
 phone:"",
 addressLine1:"",
 addressLine2:"",
 city:"",
 state:"",
 pincode:"",
 country:"",
 emergencyName:"Sarah Patient",
 emergencyRelation:"Spouse",
 emergencyPhone:"+91 98765 99999",
 bloodGroup:"O+",
 allergies:"Penicillin allergy",
 conditions:"Hypertension",
 medicalNotes:"Requires monthly vitals tracking assistance.",
 language:"en-US",
 timeZone:"IST (UTC+5:30)",
 theme:"Dark",
 password:"",
 confirmPassword:"",
 bookingNotif: true,
 smsNotif: true,
 emailNotif: true,
 marketingNotif: false,
 });

 const [savedSuccess, setSavedSuccess] = useState(false);

 useEffect(() => {
 patientService.getProfile().then((p) => {
 if (p) {
 setProfile(p);
 setFormData((prev) => ({
 ...prev,
 firstName: p.patient.firstName,
 lastName: p.patient.lastName,
 email: p.patient.email,
 phone: p.patient.phone,
 dob: p.dateOfBirth,
 gender: p.gender,
 bloodGroup: p.bloodGroup,
 addressLine1: p.address.street,
 city: p.address.city,
 state: p.address.state,
 pincode: p.address.postalCode,
 country: p.address.country,
 }));
 }
 });
 }, []);

 const handleSave = (e: React.FormEvent) => {
 e.preventDefault();
 setSavedSuccess(true);
 setTimeout(() => setSavedSuccess(false), 3000);
 };

 const handleCancel = () => {
 if (profile) {
 setFormData((prev) => ({
 ...prev,
 firstName: profile.patient.firstName,
 lastName: profile.patient.lastName,
 email: profile.patient.email,
 phone: profile.patient.phone,
 dob: profile.dateOfBirth,
 gender: profile.gender,
 bloodGroup: profile.bloodGroup,
 addressLine1: profile.address.street,
 city: profile.address.city,
 state: profile.address.state,
 pincode: profile.address.postalCode,
 country: profile.address.country,
 }));
 }
 };

 const themeOptions = [
 { label:"Light", value:"Light" },
 { label:"Dark", value:"Dark" },
 { label:"System", value:"System" },
 ];

 const languageOptions = [
 { label:"English (US)", value:"en-US" },
 { label:"Hindi (India)", value:"hi-IN" },
 { label:"Telugu (India)", value:"te-IN" },
 ];

 const bloodGroupOptions = [
 { label:"O+", value:"O+" },
 { label:"O-", value:"O-" },
 { label:"A+", value:"A+" },
 { label:"A-", value:"A-" },
 { label:"B+", value:"B+" },
 { label:"B-", value:"B-" },
 { label:"AB+", value:"AB+" },
 { label:"AB-", value:"AB-" },
 ];

 if (!profile) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 return (
 <div className="space-y-16 max-w-[1440px] mx-auto w-full px-5 md:px-8 lg:px-10 py-6">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/patient/dashboard" },
 { label:"Profile" },
 ]}
 />

 {/* 2. Page Header */}
 <div className="space-y-1">
 <h1 className="text-3xl font-bold tracking-tight text-primary">
 Profile Settings
 </h1>
 <p className="text-base text-text-tertiary font-medium">
 Manage your account configurations, personal metrics information, and preferences.
 </p>
 </div>

 {savedSuccess && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-accent text-sm font-bold flex items-center gap-6 animate-pulse">
 <ShieldCheck className="w-4 h-4" />
 Changes saved successfully (Local state updated).
 </div>
 )}

 {/* Main Two-column Profile Form */}
 <form onSubmit={handleSave} className="space-y-16">
 <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
 
 {/* Left Column (70% - 7 spans) */}
 <div className="lg:col-span-7 space-y-16">
 
 {/* PROFILE HEADER HERO CARD */}
 <div className="bg-gradient-to-br from-[var(--accent-hover)] to-[var(--accent)] text-white rounded-[24px] p-8 sm:p-10 shadow-[0_4px_20px_rgba(249,115,22,0.12)] relative overflow-hidden flex flex-col sm:flex-row gap-6 items-center">
 {/* Photo Avatar */}
 <div className="w-20 h-20 rounded-full bg-white text-orange-655 flex items-center justify-center font-bold text-3xl uppercase shrink-0 shadow-md">
 {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
 </div>
 <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
 <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6">
 <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
 {formData.firstName} {formData.lastName}
 </h2>
 <span className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-full bg-white/10 text-white text-base font-semibold">
 <ShieldCheck className="w-3.5 h-3.5" />
 Active Patient
 </span>
 </div>
 
 <p className="text-[12px] text-orange-50 font-bold uppercase tracking-wider block mt-2">
 Patient ID: {profile.patient.id}
 </p>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-sm text-orange-50/80 pt-2 font-medium">
 <span className="flex items-center gap-1">
 <Mail className="w-3.5 h-3.5 text-orange-100" />
 {formData.email}
 </span>
 <span>&middot;</span>
 <span className="flex items-center gap-1">
 <Phone className="w-3.5 h-3.5 text-orange-100" />
 {formData.phone}
 </span>
 </div>
 <span className="text-base text-orange-100 block pt-1.5 font-semibold">
 Member Since: July 12, 2026
 </span>
 </div>
 
 {/* Photo upload trigger */}
 <SecondaryButton
 type="button"
 onClick={() => alert("Photo upload placeholder.")}
 className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-sm font-semibold px-5 py-2 rounded-xl shrink-0"
 >
 Change Avatar
 </SecondaryButton>
 
 {/* Abstract layout glow */}
 <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 blur-3xl rounded-full translate-x-16" />
 </div>

 {/* FORM FIELD GROUP SECTIONS */}
 <FormLayout>
 {/* Personal Information */}
 <FormSection title="Basic Personal Information">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <TextInput
 label="First Name"
 value={formData.firstName}
 required
 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
 />
 <TextInput
 label="Last Name"
 value={formData.lastName}
 required
 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
 />
 <TextInput
 label="Date of Birth"
 type="date"
 value={formData.dob}
 required
 onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
 />
 <TextInput
 label="Gender"
 placeholder="Male / Female / Other"
 value={formData.gender}
 required
 onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
 />
 <TextInput
 label="Email"
 type="email"
 value={formData.email}
 required
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 />
 <TextInput
 label="Phone Number"
 value={formData.phone}
 required
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 />
 </div>
 </FormSection>

 {/* Address Information */}
 <FormSection title="Address Coordinates">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="sm:col-span-2">
 <TextInput
 label="Address Line 1"
 value={formData.addressLine1}
 required
 onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
 />
 </div>
 <div className="sm:col-span-2">
 <TextInput
 label="Address Line 2"
 value={formData.addressLine2}
 onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
 />
 </div>
 <TextInput
 label="City"
 value={formData.city}
 required
 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
 />
 <TextInput
 label="State"
 value={formData.state}
 required
 onChange={(e) => setFormData({ ...formData, state: e.target.value })}
 />
 <TextInput
 label="Pincode"
 value={formData.pincode}
 required
 onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
 />
 <TextInput
 label="Country"
 value={formData.country}
 required
 onChange={(e) => setFormData({ ...formData, country: e.target.value })}
 />
 </div>
 </FormSection>

 {/* Emergency Contact */}
 <FormSection title="Emergency Contact Details">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <TextInput
 label="Contact Name"
 value={formData.emergencyName}
 required
 onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
 />
 <TextInput
 label="Relationship"
 value={formData.emergencyRelation}
 required
 onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
 />
 <div className="sm:col-span-2">
 <TextInput
 label="Phone Number"
 value={formData.emergencyPhone}
 required
 onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
 />
 </div>
 </div>
 </FormSection>

 {/* Health Information */}
 <FormSection title="Health Parameters Information">
 <div className="space-y-6">
 <SelectInput
 options={bloodGroupOptions}
 value={formData.bloodGroup}
 required
 placeholder="Select blood group"
 onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
 />
 <TextAreaInput
 label="Allergies"
 value={formData.allergies}
 onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
 />
 <TextAreaInput
 label="Existing Medical Conditions"
 value={formData.conditions}
 onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
 />
 <TextAreaInput
 label="Additional Medical Notes"
 value={formData.medicalNotes}
 onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
 />
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* Right Column (30% - 3 spans, Sticky settings panel) */}
 <div className="lg:col-span-3 space-y-8 sticky top-24 z-20">
 
 {/* Account Settings */}
 <div className="bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-xs space-y-6">
 <h3 className="text-base font-semibold text-primary pb-3 border-b border-border-light">
 Account Settings
 </h3>
 <div className="space-y-4">
 <SelectInput
 options={languageOptions}
 value={formData.language}
 onChange={(e) => setFormData({ ...formData, language: e.target.value })}
 />
 <TextInput
 label="Time Zone"
 value={formData.timeZone}
 readOnly
 disabled
 />
 <SelectInput
 options={themeOptions}
 value={formData.theme}
 onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
 />
 </div>
 </div>

 {/* Security Settings */}
 <div className="bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-xs space-y-6">
 <h3 className="text-base font-semibold text-primary pb-3 border-b border-border-light">
 Security Settings
 </h3>
 <div className="space-y-4">
 <TextInput
 label="Change Password"
 type="password"
 placeholder="••••••••"
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 />
 <TextInput
 label="Confirm Password"
 type="password"
 placeholder="••••••••"
 value={formData.confirmPassword}
 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
 />
 </div>
 </div>

 {/* Notification Preferences (Switch toggles) */}
 <div className="bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-xs space-y-6">
 <h3 className="text-base font-semibold text-primary pb-3 border-b border-border-light">
 Notification Preferences
 </h3>
 <div className="space-y-4">
 <Switch
 id="bookingNotif"
 label="Booking Alerts"
 checked={formData.bookingNotif}
 onChange={(val) => setFormData({ ...formData, bookingNotif: val })}
 />
 <Switch
 id="smsNotif"
 label="SMS Notifications"
 checked={formData.smsNotif}
 onChange={(val) => setFormData({ ...formData, smsNotif: val })}
 />
 <Switch
 id="emailNotif"
 label="Email Notifications"
 checked={formData.emailNotif}
 onChange={(val) => setFormData({ ...formData, emailNotif: val })}
 />
 <Switch
 id="marketingNotif"
 label="Marketing Updates"
 checked={formData.marketingNotif}
 onChange={(val) => setFormData({ ...formData, marketingNotif: val })}
 />
 </div>
 </div>
 </div>
 </div>

 {/* Global Save Actions Command bar */}
 <div className="flex justify-end gap-6 border-t border-border/60 pt-6 select-none max-w-4xl">
 <SecondaryButton type="button" onClick={handleCancel} className="px-6 py-2.5 text-sm font-semibold">
 Cancel
 </SecondaryButton>
 <PrimaryButton type="submit" className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold">
 <Save className="w-4 h-4" />
 Save Changes
 </PrimaryButton>
 </div>
 </form>
 </div>
 );
}
