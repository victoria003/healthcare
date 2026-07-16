"use client";

import React, { useState, useEffect } from"react";
import { User, ShieldCheck, Mail, Phone, Calendar, Heart, Save, Edit2, ShieldAlert, Star, Award, MapPin } from"lucide-react";
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
import { providerService, MockProfessional } from"@/lib/services/provider.service";

const LANGUAGES_LIST = ["English","Hindi","Telugu","Tamil","Kannada","Malayalam"];

const CATEGORY_OPTIONS = [
 { label:"Doctors", value:"Doctors" },
 { label:"Nurses", value:"Nurses" },
 { label:"Caregivers", value:"Caregivers" },
 { label:"Physiotherapists", value:"Physiotherapists" },
 { label:"Patient Attenders", value:"Patient Attenders" },
];

export default function ProfessionalProfilePage() {
 const [loading, setLoading] = useState(true);
 const [saveSuccess, setSaveSuccess] = useState(false);
 const [professional, setProfessional] = useState<MockProfessional | null>(null);

 // Form State
 const [formData, setFormData] = useState({
 firstName:"Suresh",
 lastName:"Kumar",
 dob:"1988-05-14",
 gender:"Male",
 email:"suresh.kumar@homecare.in",
 phone:"+91 98765 11111",

 category:"Doctors",
 specialization:"General Medicine / Geriatrics",
 licenseNumber:"MC-876543",
 registrationNumber:"REG-992288",
 orgName:"Nisarga Health Agency",
 yearsExp:"12 Years",

 addressLine1:"Flat 402, Nisarga Heights",
 addressLine2:"Jubilee Hills, Road No. 36",
 city:"Hyderabad",
 state:"Telangana",
 pincode:"500033",
 country:"India",
 emergencyContact:"Anitha Kumar (Spouse) — +91 98765 22222",

 highestQual:"MD - General Medicine",
 additionalCerts:"Geriatric Care Specialization, ALS Certified",
 currentOrg:"Nisarga Health Agency",
 prevOrg:"Apollo Hospitals, Hyderabad",

 languages: ["English","Telugu"],
 bio:"Dedicated medical professional with over 12 years of experience specializing in geriatric care and general medicine. Passionate about providing high-quality healthcare services in home environments to improve patient quality of life.",
 });

 useEffect(() => {
 providerService.getProviders()
 .then((providers) => {
 if (providers && providers.length > 0) {
 const pro = providers[0];
 setProfessional(pro);
 const names = pro.fullName.split("");
 setFormData(prev => ({
 ...prev,
 firstName: names[0] ||"",
 lastName: names.slice(1).join("") ||"",
 category: pro.category,
 yearsExp: pro.experience,
 orgName: pro.organization,
 languages: pro.languages || ["English","Telugu"],
 }));
 }
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error fetching provider info:", err);
 setLoading(false);
 });
 }, []);

 const handleLanguageToggle = (lang: string) => {
 setFormData(prev => {
 const exists = prev.languages.includes(lang);
 if (exists) {
 return { ...prev, languages: prev.languages.filter(l => l !== lang) };
 } else {
 return { ...prev, languages: [...prev.languages, lang] };
 }
 });
 };

 const handleSave = (e: React.FormEvent) => {
 e.preventDefault();
 setSaveSuccess(true);
 setTimeout(() => setSaveSuccess(false), 3000);
 };

 const handleCancel = () => {
 if (professional) {
 const names = professional.fullName.split("");
 setFormData({
 firstName: names[0] ||"",
 lastName: names.slice(1).join("") ||"",
 dob:"1988-05-14",
 gender:"Male",
 email:"suresh.kumar@homecare.in",
 phone:"+91 98765 11111",
 category: professional.category,
 specialization:"General Medicine / Geriatrics",
 licenseNumber:"MC-876543",
 registrationNumber:"REG-992288",
 orgName: professional.organization,
 yearsExp: professional.experience,
 addressLine1:"Flat 402, Nisarga Heights",
 addressLine2:"Jubilee Hills, Road No. 36",
 city:"Hyderabad",
 state:"Telangana",
 pincode:"500033",
 country:"India",
 emergencyContact:"Anitha Kumar (Spouse) — +91 98765 22222",
 highestQual:"MD - General Medicine",
 additionalCerts:"Geriatric Care Specialization, ALS Certified",
 currentOrg: professional.organization,
 prevOrg:"Apollo Hospitals, Hyderabad",
 languages: professional.languages || ["English","Telugu"],
 bio:"Dedicated medical professional with over 12 years of experience specializing in geriatric care and general medicine. Passionate about providing high-quality healthcare services in home environments to improve patient quality of life.",
 });
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
 <div className="space-y-6 max-w-7xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/professional/dashboard" },
 { label:"Profile" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Professional Profile"
 description="Manage your professional information and profile."
 />

 {saveSuccess && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-accent text-sm font-bold flex items-center gap-6">
 <ShieldCheck className="w-4 h-4" />
 Profile updated successfully (Local state updated).
 </div>
 )}

 <form onSubmit={handleSave} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 
 {/* 3. Professional Summary Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden">
 <div className="w-20 h-20 rounded-[28px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shadow-inner">
 {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
 </div>
 <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
 <h2 className="text-xl font-black text-primary">
 {formData.firstName} {formData.lastName}
 </h2>
 {professional?.verified && (
 <span className="inline-flex items-center gap-1 px-3 py-2.5 rounded-full bg-accent-light border border-emerald-100 text-accent text-sm font-extrabold uppercase">
 <ShieldCheck className="w-3 h-3" /> Verified
 </span>
 )}
 </div>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-sm text-text-tertiary">
 <span className="font-bold">ID: {professional?.id ||"PRO-8899"}</span>
 <span>·</span>
 <span className="font-bold">{formData.category}</span>
 <span>·</span>
 <span>{formData.orgName}</span>
 </div>
 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-base text-text-tertiary pt-1">
 <span className="flex items-center gap-1 font-bold">
 <Star className="w-3.5 h-3.5 text-accent-light fill-current" />
 Rating: {professional?.rating?.toFixed(1) ||"4.9"}
 </span>
 <span>·</span>
 <span className="font-bold">Exp: {formData.yearsExp}</span>
 <span>·</span>
 <span className="px-3 py-2.5 rounded-lg bg-accent-light text-accent font-extrabold text-sm uppercase">
 {professional?.availability ||"Available Today"}
 </span>
 </div>
 </div>
 <SecondaryButton type="button" className="text-sm py-2.5 px-3 flex items-center gap-1 select-none">
 <Edit2 className="w-3 h-3" />
 Edit Photo
 </SecondaryButton>
 </DashboardCard>

 <FormLayout>
 {/* 4. Personal Information */}
 <FormSection title="Personal Information" description="Basic personal details.">
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

 {/* 5. Professional Information */}
 <FormSection title="Professional Information" description="Licenses, categorization, and current assignment details.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div>
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Professional Category</label>
 <SelectInput
 options={CATEGORY_OPTIONS}
 value={formData.category}
 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
 />
 </div>
 <TextInput
 label="Specialization"
 value={formData.specialization}
 required
 onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
 />
 <TextInput
 label="License Number"
 value={formData.licenseNumber}
 required
 onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
 />
 <TextInput
 label="Registration Number"
 value={formData.registrationNumber}
 required
 onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
 />
 <TextInput
 label="Current Organization Name"
 value={formData.orgName}
 required
 onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
 />
 <TextInput
 label="Years of Experience"
 value={formData.yearsExp}
 required
 onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
 />
 </div>
 </FormSection>

 {/* 6. Contact Information */}
 <FormSection title="Contact Information" description="Current residential address and emergency contact details.">
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

 {/* 7. Qualifications & Experience */}
 <FormSection title="Qualifications & Experience" description="Degree information and career background.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <TextInput
 label="Highest Qualification"
 value={formData.highestQual}
 required
 onChange={(e) => setFormData({ ...formData, highestQual: e.target.value })}
 />
 <TextInput
 label="Additional Certifications"
 value={formData.additionalCerts}
 onChange={(e) => setFormData({ ...formData, additionalCerts: e.target.value })}
 />
 <TextInput
 label="Years of Experience"
 value={formData.yearsExp}
 required
 onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
 />
 <TextInput
 label="Current Organization"
 value={formData.currentOrg}
 required
 onChange={(e) => setFormData({ ...formData, currentOrg: e.target.value })}
 />
 <div className="sm:col-span-2">
 <TextInput
 label="Previous Organization"
 value={formData.prevOrg}
 onChange={(e) => setFormData({ ...formData, prevOrg: e.target.value })}
 />
 </div>
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 
 {/* 8. Languages */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <Award className="w-4 h-4 text-accent-light" />
 Languages
 </h3>
 <p className="text-base text-text-tertiary font-bold uppercase tracking-wider">Select all that apply</p>
 <div className="flex flex-wrap gap-6">
 {LANGUAGES_LIST.map((lang) => {
 const isSelected = formData.languages.includes(lang);
 return (
 <button
 key={lang}
 type="button"
 onClick={() => handleLanguageToggle(lang)}
 className={`px-3 py-2.5 rounded-xl text-base font-extrabold transition-all border ${
 isSelected
 ?"bg-accent-light border-accent-light text-white"
 :"border-border text-text-tertiary hover:border-border"
 }`}
 >
 {lang}
 </button>
 );
 })}
 </div>
 </DashboardCard>

 {/* 9. Bio */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Bio</h3>
 <div className="space-y-1">
 <TextAreaInput
 label="Professional Bio"
 value={formData.bio}
 maxLength={500}
 rows={6}
 onChange={(e) => setFormData({ ...formData, bio: e.target.value.substring(0, 500) })}
 />
 <div className="flex justify-end text-base font-extrabold text-text-tertiary pr-1">
 {formData.bio.length} / 500 characters
 </div>
 </div>
 </DashboardCard>
 </div>
 </div>

 {/* 10. Save Section */}
 <div className="flex justify-end gap-6 border-t border-border-light pt-6 select-none">
 <SecondaryButton type="button" onClick={handleCancel}>
 Cancel
 </SecondaryButton>
 <PrimaryButton type="submit">
 Save Changes
 </PrimaryButton>
 </div>
 </form>
 </div>
 );
}
