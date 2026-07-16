"use client";

import React, { useState, useEffect } from"react";
import {
 ShieldCheck, Star, Mail, Phone, Globe, MapPin,
 Save, Upload, Eye, Edit2, Building2
} from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import FormLayout from"@/components/forms/FormLayout";
import FormSection from"@/components/forms/FormSection";
import TextInput from"@/components/forms/TextInput";
import TextAreaInput from"@/components/forms/TextAreaInput";
import SelectInput from"@/components/forms/SelectInput";
import { organizationService, MockOrganization } from"@/lib/services/organization.service";

const ALL_SERVICES = [
"Doctors",
"Nurses",
"Caregivers",
"Physiotherapists",
"Patient Attenders",
"Organizations",
];

const DOCUMENTS = [
 { name:"Registration Certificate", icon:"📋" },
 { name:"Healthcare License", icon:"🏥" },
 { name:"GST Certificate", icon:"📄" },
 { name:"Insurance", icon:"🛡️" },
];

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

const businessTypeOptions = [
 { label:"Private Limited", value:"private-limited" },
 { label:"Partnership", value:"partnership" },
 { label:"Sole Proprietorship", value:"sole-proprietorship" },
 { label:"LLP", value:"llp" },
 { label:"Non-Profit", value:"non-profit" },
];

export default function AgencyProfilePage() {
 const [organization, setOrganization] = useState<MockOrganization | undefined>(undefined);
 const [loading, setLoading] = useState(true);
 const [savedSuccess, setSavedSuccess] = useState(false);

 const [selectedServices, setSelectedServices] = useState<string[]>([
"Doctors","Nurses","Caregivers",
 ]);

 const [formData, setFormData] = useState({
 name:"",
 registrationNumber:"REG-2024-HC-00142",
 licenseNumber:"HC-LIC-TEL-08831",
 description:"A premier homecare service provider delivering certified clinical care to patients across Hyderabad and surrounding districts.",
 email:"contact@carefirst.in",
 phone:"+91 40 6678 9900",
 website:"https://carefirst.in",
 addressLine1:"Tower B, Mindspace IT Park",
 addressLine2:"Level 4, Suite 402",
 city:"",
 state:"",
 pincode:"",
 country:"India",
 businessType:"private-limited",
 gstNumber:"36AAACH1234F1Z5",
 operatingHours:"Monday – Saturday: 8:00 AM – 8:00 PM",
 emergencyContact:"+91 98765 00001",
 language:"en-US",
 timeZone:"IST (UTC+5:30)",
 theme:"Dark",
 emailNotif: true,
 smsNotif: true,
 bookingAlerts: true,
 marketingNotif: false,
 });

 useEffect(() => {
 setLoading(true);
 organizationService.getOrganizations()
 .then((data) => {
 if (data && data.length > 0) {
 const org = data[0];
 setOrganization(org);
 setFormData((prev) => ({
 ...prev,
 name: org.name,
 city: org.location.split(",")[0]?.trim() ||"Hyderabad",
 state: org.location.split(",")[1]?.trim() ||"Telangana",
 pincode:"500081",
 }));
 // Pre-select org services
 if (org.services && org.services.length > 0) {
 setSelectedServices(org.services.slice(0, 3));
 }
 }
 })
 .catch((err) => console.error("Error loading organization:", err))
 .finally(() => setLoading(false));
 }, []);

 const toggleService = (svc: string) => {
 setSelectedServices((prev) =>
 prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
 );
 };

 const handleSave = (e: React.FormEvent) => {
 e.preventDefault();
 setSavedSuccess(true);
 setTimeout(() => setSavedSuccess(false), 3000);
 };

 const handleCancel = () => {
 if (organization) {
 setFormData((prev) => ({
 ...prev,
 name: organization.name,
 city: organization.location.split(",")[0]?.trim() ||"Hyderabad",
 state: organization.location.split(",")[1]?.trim() ||"Telangana",
 }));
 }
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 return (
 <div className="space-y-6 max-w-5xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/agency/dashboard" },
 { label:"Organization Profile" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Organization Profile"
 description="Manage your organization's information and operational settings."
 />

 {savedSuccess && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-emerald-655 text-sm font-bold flex items-center gap-6">
 <ShieldCheck className="w-4 h-4" />
 Changes saved successfully (Local state updated).
 </div>
 )}

 <form onSubmit={handleSave} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* ── Left Column (8-span) ── */}
 <div className="lg:col-span-8 space-y-6">

 {/* 3. Organization Summary Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden">
 <div className="w-20 h-20 rounded-[24px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shadow-inner">
 {formData.name.substring(0, 2)}
 </div>
 <div className="flex-1 space-y-1 text-center sm:text-left">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
 <h2 className="text-xl font-black text-primary">
 {formData.name}
 </h2>
 {organization?.verified && (
 <span className="inline-flex items-center gap-1 px-3 py-2.5 rounded-full bg-bg border border-orange-100 text-orange-655 text-sm font-extrabold uppercase">
 <ShieldCheck className="w-3 h-3" />
 Verified
 </span>
 )}
 </div>
 <span className="text-base text-text-tertiary font-bold uppercase tracking-wider block">
 ID: {organization?.id?.toUpperCase() ||"ORG-001"}
 </span>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-text-tertiary pt-1.5">
 <span className="flex items-center gap-1 font-bold text-accent-light bg-bg px-3 py-2.5 rounded-lg">
 <Star className="w-3.5 h-3.5 fill-current" />
 {organization?.rating.toFixed(1)} Rating
 </span>
 <span className="text-sm text-text-tertiary font-bold">Member Since: July 2024</span>
 </div>
 </div>
 <SecondaryButton
 type="button"
 className="text-sm py-2.5 px-3 flex items-center gap-1 select-none shrink-0"
 >
 <Edit2 className="w-3 h-3" />
 Edit Logo
 </SecondaryButton>
 <div className="absolute right-0 bottom-0 w-20 h-20 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 <FormLayout>
 {/* 4. Organization Information */}
 <FormSection
 title="Organization Information"
 description="Core registration and legal identifiers for the agency."
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="sm:col-span-2">
 <TextInput
 label="Organization Name"
 value={formData.name}
 required
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 />
 </div>
 <TextInput
 label="Registration Number"
 value={formData.registrationNumber}
 required
 onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
 />
 <TextInput
 label="License Number"
 value={formData.licenseNumber}
 required
 onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
 />
 <div className="sm:col-span-2">
 <TextAreaInput
 label="Description"
 rows={3}
 value={formData.description}
 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
 />
 </div>
 </div>
 </FormSection>

 {/* 5. Contact Information */}
 <FormSection
 title="Contact Information"
 description="Official communication channels and registered address."
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <TextInput
 label="Email"
 type="email"
 value={formData.email}
 required
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 />
 <TextInput
 label="Phone"
 value={formData.phone}
 required
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 />
 <div className="sm:col-span-2">
 <TextInput
 label="Website"
 type="url"
 value={formData.website}
 onChange={(e) => setFormData({ ...formData, website: e.target.value })}
 />
 </div>
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

 {/* 6. Business Information */}
 <FormSection
 title="Business Information"
 description="Regulatory and operational metadata."
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="flex flex-col gap-1.5 w-full">
 <label className="text-base uppercase tracking-wider font-extrabold text-text-tertiary select-none">Business Type</label>
 <SelectInput
 options={businessTypeOptions}
 value={formData.businessType}
 required
 onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
 />
 </div>
 <TextInput
 label="GST Number"
 value={formData.gstNumber}
 onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
 />
 <div className="sm:col-span-2">
 <TextInput
 label="Operating Hours"
 value={formData.operatingHours}
 onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
 />
 </div>
 <div className="sm:col-span-2">
 <TextInput
 label="Emergency Contact"
 value={formData.emergencyContact}
 required
 onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
 />
 </div>
 </div>
 </FormSection>

 {/* 7. Service Coverage */}
 <FormSection
 title="Service Coverage"
 description="Select the care categories your organization provides."
 >
 <div className="flex flex-wrap gap-6 pt-1">
 {ALL_SERVICES.map((svc) => {
 const isSelected = selectedServices.includes(svc);
 return (
 <button
 key={svc}
 type="button"
 onClick={() => toggleService(svc)}
 className={`px-3.5 py-2.5 text-base font-extrabold rounded-xl border transition-all select-none ${
 isSelected
 ?"bg-accent-light border-orange-600 text-white shadow-sm"
 :"bg-slate-55 border-border text-text-secondary hover:border-border"
 }`}
 >
 {svc}
 </button>
 );
 })}
 </div>
 </FormSection>

 {/* 8. Documents */}
 <FormSection
 title="Documents"
 description="Upload and manage your organization's compliance documents."
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 {DOCUMENTS.map((doc) => (
 <DashboardCard key={doc.name} className="p-6 flex flex-col gap-6">
 <div className="flex items-center gap-6.5">
 <span className="text-xl">{doc.icon}</span>
 <span className="font-extrabold text-sm text-primary">
 {doc.name}
 </span>
 </div>
 <div className="flex gap-6">
 <SecondaryButton
 type="button"
 className="flex-1 text-sm py-2.5 flex items-center justify-center gap-1 opacity-60 cursor-not-allowed"
 disabled
 >
 <Upload className="w-3 h-3" />
 Upload
 </SecondaryButton>
 <SecondaryButton
 type="button"
 className="flex-1 text-sm py-2.5 flex items-center justify-center gap-1 opacity-60 cursor-not-allowed"
 disabled
 >
 <Eye className="w-3 h-3" />
 View
 </SecondaryButton>
 </div>
 </DashboardCard>
 ))}
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* ── Right Column (4-span) ── */}
 <div className="lg:col-span-4 space-y-6">

 {/* 9. Preferences */}
 <DashboardCard className="p-6 space-y-6">
 <SectionHeader title="Preferences" />

 {/* Notification toggles */}
 <div className="space-y-3 text-sm font-bold text-text-secondary">
 <span className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary block">
 Notifications
 </span>
 {[
 { key:"emailNotif", label:"Email Notifications" },
 { key:"smsNotif", label:"SMS Notifications" },
 { key:"bookingAlerts", label:"Booking Alerts" },
 { key:"marketingNotif", label:"Marketing Updates" },
 ].map(({ key, label }) => (
 <label key={key} className="flex items-center gap-6 select-none cursor-pointer">
 <input
 type="checkbox"
 checked={formData[key as keyof typeof formData] as boolean}
 onChange={(e) =>
 setFormData({ ...formData, [key]: e.target.checked })
 }
 className="w-4 h-4 rounded text-accent-light focus:ring-accent"
 />
 <span>{label}</span>
 </label>
 ))}
 </div>

 {/* Appearance */}
 <div className="space-y-3 border-t border-border-light pt-4">
 <span className="text-sm uppercase tracking-wider font-extrabold text-text-tertiary block">
 Appearance & Locale
 </span>
 <div className="flex flex-col gap-1.5 w-full">
 <label className="text-base uppercase tracking-wider font-extrabold text-text-tertiary select-none">Theme</label>
 <SelectInput
 options={themeOptions}
 value={formData.theme}
 onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
 />
 </div>
 <div className="flex flex-col gap-1.5 w-full">
 <label className="text-base uppercase tracking-wider font-extrabold text-text-tertiary select-none">Language</label>
 <SelectInput
 options={languageOptions}
 value={formData.language}
 onChange={(e) => setFormData({ ...formData, language: e.target.value })}
 />
 </div>
 <TextInput
 label="Time Zone"
 value={formData.timeZone}
 readOnly
 disabled
 />
 </div>
 </DashboardCard>
 </div>
 </div>

 {/* 10. Save Section */}
 <div className="flex justify-end gap-6 border-t border-border-light pt-6 select-none">
 <SecondaryButton type="button" onClick={handleCancel}>
 Cancel
 </SecondaryButton>
 <PrimaryButton type="submit" className="flex items-center gap-1.5">
 <Save className="w-4 h-4" />
 Save Changes
 </PrimaryButton>
 </div>
 </form>
 </div>
 );
}
