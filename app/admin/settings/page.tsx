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
import TextAreaInput from"@/components/forms/TextAreaInput";
import DateInput from"@/components/forms/DateInput";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import Switch from"@/components/forms/Switch";
import { providerService } from"@/lib/services/provider.service";

// Select configurations
const DEFAULT_LANGUAGE_OPTIONS = [
 { label:"English", value:"English" },
 { label:"Telugu", value:"Telugu" },
 { label:"Hindi", value:"Hindi" },
 { label:"Tamil", value:"Tamil" },
 { label:"Kannada", value:"Kannada" },
 { label:"Malayalam", value:"Malayalam" },
];

const DEFAULT_DATE_FORMAT_OPTIONS = [
 { label:"DD/MM/YYYY", value:"DD/MM/YYYY" },
 { label:"MM/DD/YYYY", value:"MM/DD/YYYY" },
 { label:"YYYY-MM-DD", value:"YYYY-MM-DD" },
];

const DEFAULT_TIME_FORMAT_OPTIONS = [
 { label:"12 Hour", value:"12 Hour" },
 { label:"24 Hour", value:"24 Hour" },
];

const SESSION_TIMEOUT_OPTIONS = [
 { label:"15 Minutes", value:"15 Minutes" },
 { label:"30 Minutes", value:"30 Minutes" },
 { label:"60 Minutes", value:"60 Minutes" },
];

const PASSWORD_POLICY_OPTIONS = [
 { label:"Basic", value:"Basic" },
 { label:"Medium", value:"Medium" },
 { label:"Strong", value:"Strong" },
];

const MAX_LOGIN_ATTEMPTS_OPTIONS = [
 { label:"3", value:"3" },
 { label:"5", value:"5" },
 { label:"10", value:"10" },
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

const ACCENT_COLOR_OPTIONS = [
 { label:"Orange", value:"Orange" },
 { label:"Blue", value:"Blue" },
 { label:"Green", value:"Green" },
 { label:"Purple", value:"Purple" },
];

// Replaced local duplicate Toggle with imported Switch component

export default function AdminSettingsPage() {
 const [loading, setLoading] = useState(true);
 const [saveSuccess, setSaveSuccess] = useState(false);

 // 3. General Settings State
 const [platformName, setPlatformName] = useState("HomeCare Marketplace");
 const [supportEmail, setSupportEmail] = useState("support@homecare.in");
 const [supportPhone, setSupportPhone] = useState("+91 40 6678 1100");
 const [websiteUrl, setWebsiteUrl] = useState("https://homecare.in");
 const [platformDesc, setPlatformDesc] = useState("India's premier marketplace linking verification-approved healthcare professionals, nursing agencies, and care seekers.");

 // 4. Platform Settings State
 const [defaultLanguage, setDefaultLanguage] = useState("English");
 const [timeZone] = useState("Asia/Kolkata");
 const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
 const [timeFormat, setTimeFormat] = useState("12 Hour");

 // 5. Notification Settings State
 const [emailNotif, setEmailNotif] = useState(true);
 const [smsNotif, setSmsNotif] = useState(true);
 const [pushNotif, setPushNotif] = useState(true);
 const [adminAlerts, setAdminAlerts] = useState(true);
 const [bookingNotif, setBookingNotif] = useState(true);
 const [agencyNotif, setAgencyNotif] = useState(true);
 const [proNotif, setProNotif] = useState(true);
 const [systemNotif, setSystemNotif] = useState(false);

 // 6. Security Settings State
 const [sessionTimeout, setSessionTimeout] = useState("30 Minutes");
 const [passwordPolicy, setPasswordPolicy] = useState("Strong");
 const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
 const [requireStrongPass, setRequireStrongPass] = useState(true);
 const [enableAccountLockout, setEnableAccountLockout] = useState(true);
 const [enableAuditLogs, setEnableAuditLogs] = useState(true);

 // 7. Appearance State
 const [theme, setTheme] = useState("Dark");
 const [sidebarMode, setSidebarMode] = useState("Expanded");
 const [density, setDensity] = useState("Comfortable");
 const [accentColor, setAccentColor] = useState("Orange");

 // 8. Maintenance Mode State
 const [maintenanceMode, setMaintenanceMode] = useState(false);
 const [maintenanceMsg, setMaintenanceMsg] = useState("HomeCare Marketplace is currently undergoing scheduled platform updates. Please check back later.");
 const [maintenanceDate, setMaintenanceDate] = useState("2026-08-01");
 const [maintenanceTime, setMaintenanceTime] = useState("02:00");

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
 setPlatformName("HomeCare Marketplace");
 setSupportEmail("support@homecare.in");
 setSupportPhone("+91 40 6678 1100");
 setWebsiteUrl("https://homecare.in");
 setPlatformDesc("India's premier marketplace linking verification-approved healthcare professionals, nursing agencies, and care seekers.");
 setDefaultLanguage("English");
 setDateFormat("DD/MM/YYYY");
 setTimeFormat("12 Hour");
 setEmailNotif(true);
 setSmsNotif(true);
 setPushNotif(true);
 setAdminAlerts(true);
 setBookingNotif(true);
 setAgencyNotif(true);
 setProNotif(true);
 setSystemNotif(false);
 setSessionTimeout("30 Minutes");
 setPasswordPolicy("Strong");
 setMaxLoginAttempts("5");
 setRequireStrongPass(true);
 setEnableAccountLockout(true);
 setEnableAuditLogs(true);
 setTheme("Dark");
 setSidebarMode("Expanded");
 setDensity("Comfortable");
 setAccentColor("Orange");
 setMaintenanceMode(false);
 setMaintenanceMsg("HomeCare Marketplace is currently undergoing scheduled platform updates. Please check back later.");
 setMaintenanceDate("2026-08-01");
 setMaintenanceTime("02:00");
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
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Settings" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Platform Settings"
 description="Manage platform configuration and administrator preferences."
 />

 {saveSuccess && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-accent text-sm font-bold flex items-center gap-6">
 <ShieldCheck className="w-4 h-4" />
 Platform settings updated successfully (Local state only).
 </div>
 )}

 <form onSubmit={handleSave} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 <FormLayout>
 {/* 3. General Settings */}
 <FormSection title="General Settings" description="Global platform identity and support contact paths.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <TextInput
 label="Platform Name"
 value={platformName}
 required
 onChange={(e) => setPlatformName(e.target.value)}
 />
 <TextInput
 label="Website URL"
 value={websiteUrl}
 required
 onChange={(e) => setWebsiteUrl(e.target.value)}
 />
 <TextInput
 label="Support Email Address"
 type="email"
 value={supportEmail}
 required
 onChange={(e) => setSupportEmail(e.target.value)}
 />
 <TextInput
 label="Support Phone Number"
 value={supportPhone}
 required
 onChange={(e) => setSupportPhone(e.target.value)}
 />
 <div className="sm:col-span-2">
 <TextAreaInput
 label="Platform Description"
 value={platformDesc}
 rows={3}
 onChange={(e) => setPlatformDesc(e.target.value)}
 />
 </div>
 </div>
 </FormSection>

 {/* 4. Platform Settings */}
 <FormSection title="Platform Settings" description="System regional formats and defaults.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Default Language</label>
 <SelectInput
 options={DEFAULT_LANGUAGE_OPTIONS}
 value={defaultLanguage}
 onChange={(e) => setDefaultLanguage(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Default Time Zone</label>
 <input
 type="text"
 value={timeZone}
 readOnly
 disabled
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none text-text-tertiary cursor-not-allowed select-none font-bold"
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Default Date Format</label>
 <SelectInput
 options={DEFAULT_DATE_FORMAT_OPTIONS}
 value={dateFormat}
 onChange={(e) => setDateFormat(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Default Time Format</label>
 <SelectInput
 options={DEFAULT_TIME_FORMAT_OPTIONS}
 value={timeFormat}
 onChange={(e) => setTimeFormat(e.target.value)}
 />
 </div>
 </div>
 </FormSection>

 {/* 5. Notification Settings */}
 <FormSection title="Notification Settings" description="Select channels and recipients for system actions.">
 <div className="space-y-1">
 <Switch id="emailNotif" label="Email Notifications" checked={emailNotif} onChange={setEmailNotif} />
 <Switch id="smsNotif" label="SMS Notifications" checked={smsNotif} onChange={setSmsNotif} />
 <Switch id="pushNotif" label="Push Notifications" checked={pushNotif} onChange={setPushNotif} />
 <Switch id="adminAlerts" label="Admin Alerts" checked={adminAlerts} onChange={setAdminAlerts} />
 <Switch id="bookingNotif" label="Booking Notifications" checked={bookingNotif} onChange={setBookingNotif} />
 <Switch id="agencyNotif" label="Agency Notifications" checked={agencyNotif} onChange={setAgencyNotif} />
 <Switch id="proNotif" label="Professional Notifications" checked={proNotif} onChange={setProNotif} />
 <Switch id="systemNotif" label="System Notifications" checked={systemNotif} onChange={setSystemNotif} />
 </div>
 </FormSection>

 {/* 6. Security Settings */}
 <FormSection title="Security Settings" description="Platform timeout rules and password policies.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Session Timeout</label>
 <SelectInput
 options={SESSION_TIMEOUT_OPTIONS}
 value={sessionTimeout}
 onChange={(e) => setSessionTimeout(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Password Policy</label>
 <SelectInput
 options={PASSWORD_POLICY_OPTIONS}
 value={passwordPolicy}
 onChange={(e) => setPasswordPolicy(e.target.value)}
 />
 </div>
 <div className="flex flex-col gap-1 sm:col-span-2">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Maximum Login Attempts</label>
 <SelectInput
 options={MAX_LOGIN_ATTEMPTS_OPTIONS}
 value={maxLoginAttempts}
 onChange={(e) => setMaxLoginAttempts(e.target.value)}
 />
 </div>
 <div className="sm:col-span-2 space-y-1 pt-2 border-t border-border-light">
 <Switch id="reqStrong" label="Require Strong Passwords" checked={requireStrongPass} onChange={setRequireStrongPass} />
 <Switch id="lockout" label="Enable Account Lockout" checked={enableAccountLockout} onChange={setEnableAccountLockout} />
 <Switch id="audit" label="Enable Audit Logs" checked={enableAuditLogs} onChange={setEnableAuditLogs} />
 </div>
 </div>
 </FormSection>

 {/* 8. Maintenance Mode */}
 <FormSection title="Maintenance Mode" description="Take the platform offline for system updates.">
 <div className="space-y-4">
 <Switch id="maintMode" label="Enable Maintenance Mode" checked={maintenanceMode} onChange={setMaintenanceMode} />
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <DateInput
 label="Scheduled Maintenance Date"
 value={maintenanceDate}
 disabled={!maintenanceMode}
 onChange={(e) => setMaintenanceDate(e.target.value)}
 />
 <div className="space-y-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Scheduled Maintenance Time</label>
 <input
 type="time"
 value={maintenanceTime}
 disabled={!maintenanceMode}
 onChange={(e) => setMaintenanceTime(e.target.value)}
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none focus:border-accent-light focus:ring-2 focus:ring-accent/20 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
 />
 </div>
 </div>
 <TextAreaInput
 label="Maintenance Message"
 value={maintenanceMsg}
 disabled={!maintenanceMode}
 onChange={(e) => setMaintenanceMsg(e.target.value)}
 />
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 7. Appearance */}
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
 <div className="flex flex-col gap-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider block mb-1">Accent Color</label>
 <SelectInput
 options={ACCENT_COLOR_OPTIONS}
 value={accentColor}
 onChange={(e) => setAccentColor(e.target.value)}
 />
 </div>
 </div>
 </DashboardCard>

 {/* 9. System Information */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">System Information</h3>
 <div className="space-y-2.5 text-sm font-bold">
 {[
 { label:"Application Name", value:"HomeCare Marketplace" },
 { label:"Application Version", value:"1.0.0" },
 { label:"Environment", value:"Development" },
 { label:"Database", value:"Mock Repository" },
 { label:"API Status", value:"Offline" },
 { label:"Storage", value:"Local Mock Data" },
 { label:"Platform Status", value:"Healthy" },
 ].map((item, idx) => (
 <div key={idx} className="flex justify-between py-2 border-b border-border-light last:border-0">
 <span className="text-slate-505 font-sans font-bold">{item.label}</span>
 <span className="text-primary">{item.value}</span>
 </div>
 ))}
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
 Save Settings
 </PrimaryButton>
 </div>
 </form>
 </div>
 );
}
