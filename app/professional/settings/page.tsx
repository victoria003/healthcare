"use client";

import React, { useState, useEffect } from"react";
import { Save, ShieldCheck } from"lucide-react";
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
import { providerService } from"@/lib/services/provider.service";

// Select Option lists
const LANGUAGE_OPTIONS = [
 { label:"English", value:"English" },
 { label:"Telugu", value:"Telugu" },
 { label:"Hindi", value:"Hindi" },
 { label:"Tamil", value:"Tamil" },
 { label:"Kannada", value:"Kannada" },
 { label:"Malayalam", value:"Malayalam" },
];

const DATE_FORMAT_OPTIONS = [
 { label:"DD/MM/YYYY", value:"DD/MM/YYYY" },
 { label:"MM/DD/YYYY", value:"MM/DD/YYYY" },
 { label:"YYYY-MM-DD", value:"YYYY-MM-DD" },
];

const TIME_FORMAT_OPTIONS = [
 { label:"12 Hour", value:"12 Hour" },
 { label:"24 Hour", value:"24 Hour" },
];

const THEME_OPTIONS = [
 { label:"Light", value:"Light" },
 { label:"Dark", value:"Dark" },
 { label:"System", value:"System" },
];

const SIDEBAR_MODE_OPTIONS = [
 { label:"Expanded", value:"Expanded" },
 { label:"Collapsed", value:"Collapsed" },
];

const DASHBOARD_DENSITY_OPTIONS = [
 { label:"Comfortable", value:"Comfortable" },
 { label:"Compact", value:"Compact" },
];

const DEFAULT_DASHBOARD_OPTIONS = [
 { label:"Dashboard", value:"Dashboard" },
 { label:"My Schedule", value:"My Schedule" },
 { label:"My Bookings", value:"My Bookings" },
];

// Replaced local duplicate Toggle with imported Switch component

export default function ProfessionalSettingsPage() {
 const [loading, setLoading] = useState(true);
 const [saveSuccess, setSaveSuccess] = useState(false);

 // 3. Account Settings State
 const [language, setLanguage] = useState("English");
 const [timeZone] = useState("Asia/Kolkata");
 const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
 const [timeFormat, setTimeFormat] = useState("12 Hour");

 // 4. Notification Preferences State
 const [emailNotif, setEmailNotif] = useState(true);
 const [smsNotif, setSmsNotif] = useState(true);
 const [pushNotif, setPushNotif] = useState(true);
 const [bookingNotif, setBookingNotif] = useState(true);
 const [scheduleReminders, setScheduleReminders] = useState(true);
 const [availabilityAlerts, setAvailabilityAlerts] = useState(true);
 const [systemUpdates, setSystemUpdates] = useState(false);
 const [marketingEmails, setMarketingEmails] = useState(false);

 // 5. Appearance State
 const [theme, setTheme] = useState("Dark");
 const [sidebarMode, setSidebarMode] = useState("Expanded");
 const [density, setDensity] = useState("Comfortable");

 // 6. Privacy State
 const [showProfilePublicly, setShowProfilePublicly] = useState(true);
 const [showRatings, setShowRatings] = useState(true);
 const [showExperience, setShowExperience] = useState(true);
 const [showLanguages, setShowLanguages] = useState(true);
 const [allowDirectBookings, setAllowDirectBookings] = useState(true);

 // 7. Security State (UI only)
 const [currentPassword, setCurrentPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");

 // 8. Application Preferences State
 const [defaultDashboard, setDefaultDashboard] = useState("Dashboard");
 const [startAvailability, setStartAvailability] = useState(true);
 const [autoRefresh, setAutoRefresh] = useState(true);
 const [rememberFilters, setRememberFilters] = useState(true);
 const [enableAnimations, setEnableAnimations] = useState(true);

 useEffect(() => {
 providerService.getProviders()
 .then(() => setLoading(false))
 .catch((err) => {
 console.error(err);
 setLoading(false);
 });
 }, []);

 const handleSave = (e: React.FormEvent) => {
 e.preventDefault();
 setSaveSuccess(true);
 setTimeout(() => setSaveSuccess(false), 3000);
 };

 const handleCancel = () => {
 // Reset values to defaults
 setLanguage("English");
 setDateFormat("DD/MM/YYYY");
 setTimeFormat("12 Hour");
 setEmailNotif(true);
 setSmsNotif(true);
 setPushNotif(true);
 setBookingNotif(true);
 setScheduleReminders(true);
 setAvailabilityAlerts(true);
 setSystemUpdates(false);
 setMarketingEmails(false);
 setTheme("Dark");
 setSidebarMode("Expanded");
 setDensity("Comfortable");
 setShowProfilePublicly(true);
 setShowRatings(true);
 setShowExperience(true);
 setShowLanguages(true);
 setAllowDirectBookings(true);
 setCurrentPassword("");
 setNewPassword("");
 setConfirmPassword("");
 setDefaultDashboard("Dashboard");
 setStartAvailability(true);
 setAutoRefresh(true);
 setRememberFilters(true);
 setEnableAnimations(true);
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
 { label:"Settings" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Settings"
 description="Manage your account preferences and application settings."
 />

 {saveSuccess && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-accent text-sm font-bold flex items-center gap-6">
 <ShieldCheck className="w-4 h-4" />
 Settings saved successfully (Local state only).
 </div>
 )}

 <form onSubmit={handleSave} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 <FormLayout>
 {/* 3. Account Settings */}
 <FormSection title="Account Settings" description="Regional configurations and language preferences.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Language</label>
 <SelectInput
 options={LANGUAGE_OPTIONS}
 value={language}
 onChange={(e) => setLanguage(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Time Zone</label>
 <input
 type="text"
 value={timeZone}
 readOnly
 disabled
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none text-text-tertiary cursor-not-allowed select-none font-bold"
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Date Format</label>
 <SelectInput
 options={DATE_FORMAT_OPTIONS}
 value={dateFormat}
 onChange={(e) => setDateFormat(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Time Format</label>
 <SelectInput
 options={TIME_FORMAT_OPTIONS}
 value={timeFormat}
 onChange={(e) => setTimeFormat(e.target.value)}
 />
 </div>
 </div>
 </FormSection>

 {/* 4. Notification Preferences */}
 <FormSection title="Notification Preferences" description="Choose how and when you get notified.">
 <div className="space-y-1">
 <Switch id="emailNotif" label="Email Notifications" checked={emailNotif} onChange={setEmailNotif} />
 <Switch id="smsNotif" label="SMS Notifications" checked={smsNotif} onChange={setSmsNotif} />
 <Switch id="pushNotif" label="Push Notifications" checked={pushNotif} onChange={setPushNotif} />
 <Switch id="bookingNotif" label="Booking Notifications" checked={bookingNotif} onChange={setBookingNotif} />
 <Switch id="scheduleRem" label="Schedule Reminders" checked={scheduleReminders} onChange={setScheduleReminders} />
 <Switch id="availAlerts" label="Availability Alerts" checked={availabilityAlerts} onChange={setAvailabilityAlerts} />
 <Switch id="sysUpdates" label="System Updates" checked={systemUpdates} onChange={setSystemUpdates} />
 <Switch id="mktEmails" label="Marketing Emails" checked={marketingEmails} onChange={setMarketingEmails} />
 </div>
 </FormSection>

 {/* 7. Security */}
 <FormSection title="Security" description="Passwords and access keys (UI only actions).">
 <div className="grid grid-cols-1 gap-6">
 <TextInput
 label="Current Password"
 type="password"
 placeholder="••••••••"
 value={currentPassword}
 onChange={(e) => setCurrentPassword(e.target.value)}
 />
 <TextInput
 label="New Password"
 type="password"
 placeholder="••••••••"
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 />
 <TextInput
 label="Confirm Password"
 type="password"
 placeholder="••••••••"
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 />
 <div className="flex justify-start">
 <button
 type="button"
 disabled
 className="px-5 py-2.5 text-base font-extrabold uppercase rounded-xl border border-border text-text-tertiary bg-bg-alt cursor-not-allowed select-none transition-colors"
 >
 Change Password
 </button>
 </div>
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 5. Appearance */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Appearance</h3>
 <div className="space-y-4">
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Theme</label>
 <SelectInput
 options={THEME_OPTIONS}
 value={theme}
 onChange={(e) => setTheme(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Sidebar Mode</label>
 <SelectInput
 options={SIDEBAR_MODE_OPTIONS}
 value={sidebarMode}
 onChange={(e) => setSidebarMode(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Dashboard Density</label>
 <SelectInput
 options={DASHBOARD_DENSITY_OPTIONS}
 value={density}
 onChange={(e) => setDensity(e.target.value)}
 />
 </div>
 </div>
 </DashboardCard>

 {/* 6. Privacy */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Privacy</h3>
 <div className="space-y-1">
 <Switch id="showProfile" label="Show Profile Publicly" checked={showProfilePublicly} onChange={setShowProfilePublicly} />
 <Switch id="showRatings" label="Show Ratings" checked={showRatings} onChange={setShowRatings} />
 <Switch id="showExp" label="Show Experience" checked={showExperience} onChange={setShowExperience} />
 <Switch id="showLang" label="Show Languages" checked={showLanguages} onChange={setShowLanguages} />
 <Switch id="allowDirect" label="Allow Direct Booking Requests" checked={allowDirectBookings} onChange={setAllowDirectBookings} />
 </div>
 </DashboardCard>

 {/* 8. Application Preferences */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Application Preferences</h3>
 <div className="space-y-4">
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Default Dashboard</label>
 <SelectInput
 options={DEFAULT_DASHBOARD_OPTIONS}
 value={defaultDashboard}
 onChange={(e) => setDefaultDashboard(e.target.value)}
 />
 </div>
 <div className="space-y-1 pt-2 border-t border-border-light">
 <Switch id="startAvail" label="Start Availability" checked={startAvailability} onChange={setStartAvailability} />
 <Switch id="autoRef" label="Auto Refresh Dashboard" checked={autoRefresh} onChange={setAutoRefresh} />
 <Switch id="remFilters" label="Remember Filters" checked={rememberFilters} onChange={setRememberFilters} />
 <Switch id="enableAnim" label="Enable Animations" checked={enableAnimations} onChange={setEnableAnimations} />
 </div>
 </div>
 </DashboardCard>
 </div>
 </div>

 {/* 9. Save Section */}
 <div className="flex justify-end gap-6 border-t border-border-light pt-6 select-none">
 <SecondaryButton type="button" onClick={handleCancel}>
 Cancel
 </SecondaryButton>
 <PrimaryButton type="submit">
 Save Settings
 </PrimaryButton>
 </div>
 </form>
 </div>
 );
}
