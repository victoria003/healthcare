"use client";

import React, { useState, useEffect } from"react";
import { Save } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import FormLayout from"@/components/forms/FormLayout";
import FormSection from"@/components/forms/FormSection";
import TextInput from"@/components/forms/TextInput";
import SelectInput from"@/components/forms/SelectInput";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import Switch from"@/components/forms/Switch";
import { organizationService } from"@/lib/services/organization.service";

const THEME_OPTIONS = [
 { label:"Light", value:"Light" },
 { label:"Dark", value:"Dark" },
 { label:"System", value:"System" },
];
const LANGUAGE_OPTIONS = [
 { label:"English (US)", value:"en-US" },
 { label:"Hindi (India)", value:"hi-IN" },
 { label:"Telugu (India)", value:"te-IN" },
];

// Replaced local duplicate Toggle with imported Switch component

export default function AgencySettingsPage() {
 const [saved, setSaved] = useState(false);

 // General
 const [orgName, setOrgName] = useState("");
 const [email, setEmail] = useState("contact@carefirst.in");
 const [phone, setPhone] = useState("+91 40 6678 9900");
 const [website, setWebsite] = useState("https://carefirst.in");

 // Notifications
 const [bookingAlerts, setBookingAlerts] = useState(true);
 const [emailNotif, setEmailNotif] = useState(true);
 const [smsNotif, setSmsNotif] = useState(true);
 const [marketingNotif, setMarketingNotif] = useState(false);

 // Security (UI only)
 const [currentPw, setCurrentPw] = useState("");
 const [newPw, setNewPw] = useState("");
 const [confirmPw, setConfirmPw] = useState("");

 // Appearance
 const [theme, setTheme] = useState("Dark");
 const [language, setLanguage] = useState("en-US");
 const [timezone] = useState("IST (UTC+5:30)");

 // Preferences
 const [calendarNotif, setCalendarNotif] = useState(true);
 const [dailySummary, setDailySummary] = useState(false);
 const [weeklyReports, setWeeklyReports] = useState(true);

 useEffect(() => {
 organizationService.getOrganizations().then((orgs) => {
 if (orgs.length > 0) setOrgName(orgs[0].name);
 }).catch(console.error);
 }, []);

 const handleSave = (e: React.FormEvent) => {
 e.preventDefault();
 setSaved(true);
 setTimeout(() => setSaved(false), 3000);
 };

 const handleCancel = () => {
 setCurrentPw(""); setNewPw(""); setConfirmPw("");
 };

 return (
 <div className="space-y-6 max-w-5xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb items={[{ label:"Dashboard", href:"/agency/dashboard" }, { label:"Settings" }]} />

 {/* 2. Page Header */}
 <SectionHeader
 title="Settings"
 description="Configure organization preferences and system settings."
 />

 {saved && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-accent text-sm font-bold flex items-center gap-6">
 <Save className="w-4 h-4" />
 Settings saved successfully (local state updated).
 </div>
 )}

 <form onSubmit={handleSave} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

 {/* ── Left column (8-span) ── */}
 <div className="lg:col-span-8 space-y-6">
 <FormLayout>
 {/* 3. General Settings */}
 <FormSection title="General Settings" description="Basic organization contact information.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="sm:col-span-2">
 <TextInput
 label="Organization Name"
 value={orgName}
 required
 onChange={(e) => setOrgName(e.target.value)}
 />
 </div>
 <TextInput
 label="Email"
 type="email"
 value={email}
 required
 onChange={(e) => setEmail(e.target.value)}
 />
 <TextInput
 label="Phone"
 value={phone}
 required
 onChange={(e) => setPhone(e.target.value)}
 />
 <div className="sm:col-span-2">
 <TextInput
 label="Website"
 type="url"
 value={website}
 onChange={(e) => setWebsite(e.target.value)}
 />
 </div>
 </div>
 </FormSection>

 {/* 4. Notification Settings */}
 <FormSection title="Notification Settings" description="Control how you receive alerts and updates.">
 <div className="space-y-1">
 <Switch id="bookingAlerts" label="Booking Alerts" checked={bookingAlerts} onChange={setBookingAlerts} />
 <Switch id="emailNotif" label="Email Notifications" checked={emailNotif} onChange={setEmailNotif} />
 <Switch id="smsNotif" label="SMS Notifications" checked={smsNotif} onChange={setSmsNotif} />
 <Switch id="marketingNotif" label="Marketing Updates" checked={marketingNotif} onChange={setMarketingNotif} />
 </div>
 </FormSection>

 {/* 5. Security Settings */}
 <FormSection title="Security Settings" description="Password fields are UI only — no backend persistence.">
 <div className="grid grid-cols-1 gap-6">
 <TextInput
 label="Current Password"
 type="password"
 value={currentPw}
 placeholder="••••••••"
 onChange={(e) => setCurrentPw(e.target.value)}
 />
 <TextInput
 label="New Password"
 type="password"
 value={newPw}
 placeholder="••••••••"
 onChange={(e) => setNewPw(e.target.value)}
 />
 <TextInput
 label="Confirm Password"
 type="password"
 value={confirmPw}
 placeholder="••••••••"
 onChange={(e) => setConfirmPw(e.target.value)}
 />
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* ── Right column (4-span) ── */}
 <div className="lg:col-span-4 space-y-6">

 {/* 6. Appearance */}
 <DashboardCard className="p-6 space-y-4">
 <SectionHeader title="Appearance" />
 <div className="space-y-3">
 <div className="flex flex-col gap-1.5">
 <label className="text-base uppercase tracking-wider font-extrabold text-text-tertiary select-none">Theme</label>
 <SelectInput
 options={THEME_OPTIONS}
 value={theme}
 onChange={(e) => setTheme(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1.5">
 <label className="text-base uppercase tracking-wider font-extrabold text-text-tertiary select-none">Language</label>
 <SelectInput
 options={LANGUAGE_OPTIONS}
 value={language}
 onChange={(e) => setLanguage(e.target.value)}
 />
 </div>
 <TextInput
 label="Time Zone"
 value={timezone}
 readOnly
 disabled
 />
 </div>
 </DashboardCard>

 {/* 7. Preferences */}
 <DashboardCard className="p-6 space-y-4">
 <SectionHeader title="Preferences" />
 <div className="space-y-1">
 <Switch id="calendarNotif" label="Enable Calendar Notifications" checked={calendarNotif} onChange={setCalendarNotif} />
 <Switch id="dailySummary" label="Enable Daily Summary" checked={dailySummary} onChange={setDailySummary} />
 <Switch id="weeklyReports" label="Enable Weekly Reports" checked={weeklyReports} onChange={setWeeklyReports} />
 </div>
 </DashboardCard>
 </div>
 </div>

 {/* 8. Save Section */}
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
