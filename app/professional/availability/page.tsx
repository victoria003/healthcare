"use client";

import React, { useState, useEffect } from"react";
import { Clock, Calendar, ShieldCheck, Check, AlertTriangle } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import FormLayout from"@/components/forms/FormLayout";
import FormSection from"@/components/forms/FormSection";
import TextInput from"@/components/forms/TextInput";
import DateInput from"@/components/forms/DateInput";
import TextAreaInput from"@/components/forms/TextAreaInput";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { providerService } from"@/lib/services/provider.service";

type AvailabilityStatus ="Available" |"Unavailable" |"Busy";

interface DayAvailability {
 name: string;
 enabled: boolean;
}

interface WorkingHours {
 startTime: string;
 endTime: string;
 breakStart: string;
 breakEnd: string;
}

interface LeaveStatus {
 currentlyOnLeave: boolean;
 startDate: string;
 endDate: string;
 reason: string;
}

interface UpcomingLeave {
 id: string;
 dateRange: string;
 reason: string;
 duration: string;
 status: string;
}

const DEFAULT_DAYS: DayAvailability[] = [
 { name:"Monday", enabled: true },
 { name:"Tuesday", enabled: true },
 { name:"Wednesday", enabled: true },
 { name:"Thursday", enabled: true },
 { name:"Friday", enabled: true },
 { name:"Saturday", enabled: true },
 { name:"Sunday", enabled: false },
];

const DEFAULT_HOURS: WorkingHours = {
 startTime:"09:00",
 endTime:"18:00",
 breakStart:"13:00",
 breakEnd:"14:00",
};

const DEFAULT_LEAVE: LeaveStatus = {
 currentlyOnLeave: false,
 startDate:"",
 endDate:"",
 reason:"",
};

const INITIAL_UPCOMING_LEAVES: UpcomingLeave[] = [
 {
 id:"l-1",
 dateRange:"2026-08-15 to 2026-08-16",
 reason:"Independence Day Holiday",
 duration:"2 Days",
 status:"Approved",
 },
 {
 id:"l-2",
 dateRange:"2026-09-05 to 2026-09-05",
 reason:"Personal Work",
 duration:"1 Day",
 status:"Pending Approval",
 },
];

export default function ProfessionalAvailabilityPage() {
 const [loading, setLoading] = useState(true);
 const [saveSuccess, setSaveSuccess] = useState(false);

 // Availability state
 const [currentStatus, setCurrentStatus] = useState<AvailabilityStatus>("Available");
 const [workingDays, setWorkingDays] = useState<DayAvailability[]>(DEFAULT_DAYS);
 const [workingHours, setWorkingHours] = useState<WorkingHours>(DEFAULT_HOURS);
 const [leaveStatus, setLeaveStatus] = useState<LeaveStatus>(DEFAULT_LEAVE);
 const [upcomingLeaves, setUpcomingLeaves] = useState<UpcomingLeave[]>(INITIAL_UPCOMING_LEAVES);

 useEffect(() => {
 // Call service to simulate fetching settings/provider details
 providerService.getProviders()
 .then(() => {
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error fetching provider data", err);
 setLoading(false);
 });
 }, []);

 // Reset or cancel changes
 const handleCancel = () => {
 setCurrentStatus("Available");
 setWorkingDays(JSON.parse(JSON.stringify(DEFAULT_DAYS)));
 setWorkingHours({ ...DEFAULT_HOURS });
 setLeaveStatus({ ...DEFAULT_LEAVE });
 setUpcomingLeaves(INITIAL_UPCOMING_LEAVES);
 };

 // Save changes (local state only)
 const handleSave = (e: React.FormEvent) => {
 e.preventDefault();
 setSaveSuccess(true);
 setTimeout(() => {
 setSaveSuccess(false);
 }, 3000);
 };

 const toggleDay = (index: number, enabled: boolean) => {
 const updated = [...workingDays];
 updated[index].enabled = enabled;
 setWorkingDays(updated);
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 // Derived summaries for Summary Cards
 const activeWorkingDaysCount = workingDays.filter(d => d.enabled).length;
 const activeWorkingDaysLabel = activeWorkingDaysCount === 7 ?"Everyday" : activeWorkingDaysCount === 6 && !workingDays[6].enabled ?"Mon - Sat" :`${activeWorkingDaysCount} Days`;
 const isAvailableToday = currentStatus ==="Available" && !leaveStatus.currentlyOnLeave ?"Yes" :"No";
 const upcomingLeaveCount = upcomingLeaves.length;
 const totalWeeklyHours = activeWorkingDaysCount * 8; // Assumed 8 working hours per active day after breaks

 return (
 <div className="space-y-6 max-w-7xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/professional/dashboard" },
 { label:"Availability" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Availability"
 description="Manage your working schedule and availability preferences."
 />

 {saveSuccess && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-xl text-accent text-sm font-bold flex items-center gap-6">
 <ShieldCheck className="w-4 h-4" />
 Availability updated successfully (Local state only).
 </div>
 )}

 {/* 3. Availability Summary Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 <DashboardCard className="p-8 flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-accent bg-accent-light">
 <Check className="w-5 h-5" />
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{isAvailableToday}</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">Available Today</p>
 </div>
 </DashboardCard>

 <DashboardCard className="p-8 flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-secondary bg-bg">
 <Calendar className="w-5 h-5" />
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{activeWorkingDaysLabel}</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">Working Days</p>
 </div>
 </DashboardCard>

 <DashboardCard className="p-8 flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-accent-light bg-bg">
 <AlertTriangle className="w-5 h-5" />
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{upcomingLeaveCount} Event(s)</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">Upcoming Leave</p>
 </div>
 </DashboardCard>

 <DashboardCard className="p-8 flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-secondary bg-purple-50">
 <Clock className="w-5 h-5" />
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{totalWeeklyHours} Hours</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">Weekly Hours</p>
 </div>
 </DashboardCard>
 </div>

 <form onSubmit={handleSave} className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left Column (8-span) */}
 <div className="lg:col-span-8 space-y-6">
 <FormLayout>
 {/* 4. Current Availability Status */}
 <FormSection
 title="Current Availability Status"
 description="Set your instant availability status for new marketplace bookings."
 >
 <div className="grid grid-cols-3 gap-6">
 {(["Available","Unavailable","Busy"] as AvailabilityStatus[]).map((status) => {
 const isSelected = currentStatus === status;
 let colorClass ="border-border text-text-secondary hover:bg-bg-alt/50 :bg-primary/30";
 if (isSelected) {
 if (status ==="Available") colorClass ="border-accent bg-accent-light/20 text-accent";
 else if (status ==="Unavailable") colorClass ="border-rose-500 bg-rose-50/20 text-rose-600";
 else colorClass ="border-accent-light bg-bg/20 text-accent-light";
 }

 return (
 <button
 key={status}
 type="button"
 onClick={() => setCurrentStatus(status)}
 className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all cursor-pointer ${colorClass}`}
 >
 <span className="text-sm font-black uppercase tracking-wider">{status}</span>
 </button>
 );
 })}
 </div>
 </FormSection>

 {/* 5. Working Days */}
 <FormSection
 title="Working Days"
 description="Choose the days you are active and open to receive booking slots."
 >
 <div className="space-y-3">
 {workingDays.map((day, index) => (
 <div key={day.name} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
 <span className="text-sm font-bold text-text-secondary">{day.name}</span>
 <div className="flex items-center gap-6">
 <button
 type="button"
 onClick={() => toggleDay(index, true)}
 className={`px-3 py-2 rounded-xl text-base font-extrabold uppercase transition-all ${
 day.enabled
 ?"bg-accent-light text-white"
 :"bg-bg-alt text-text-tertiary"
 }`}
 >
 Enabled
 </button>
 <button
 type="button"
 onClick={() => toggleDay(index, false)}
 className={`px-3 py-2 rounded-xl text-base font-extrabold uppercase transition-all ${
 !day.enabled
 ?"bg-rose-500 text-white"
 :"bg-bg-alt text-text-tertiary"
 }`}
 >
 Disabled
 </button>
 </div>
 </div>
 ))}
 </div>
 </FormSection>

 {/* 6. Working Hours */}
 <FormSection
 title="Working Hours"
 description="Specify your standard daily working shifts and lunch breaks."
 >
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider">Start Time</label>
 <input
 type="time"
 value={workingHours.startTime}
 onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none focus:border-accent-light focus:ring-2 focus:ring-accent/20 text-primary"
 />
 </div>
 <div className="space-y-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider">End Time</label>
 <input
 type="time"
 value={workingHours.endTime}
 onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none focus:border-accent-light focus:ring-2 focus:ring-accent/20 text-primary"
 />
 </div>
 <div className="space-y-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider">Break Start</label>
 <input
 type="time"
 value={workingHours.breakStart}
 onChange={(e) => setWorkingHours({ ...workingHours, breakStart: e.target.value })}
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none focus:border-accent-light focus:ring-2 focus:ring-accent/20 text-primary"
 />
 </div>
 <div className="space-y-1">
 <label className="text-base font-extrabold text-text-tertiary uppercase tracking-wider">Break End</label>
 <input
 type="time"
 value={workingHours.breakEnd}
 onChange={(e) => setWorkingHours({ ...workingHours, breakEnd: e.target.value })}
 className="w-full px-5 py-2.5 text-sm bg-bg-alt border border-border rounded-xl outline-none focus:border-accent-light focus:ring-2 focus:ring-accent/20 text-primary"
 />
 </div>
 </div>
 </FormSection>

 {/* 7. Leave Status */}
 <FormSection
 title="Leave Status"
 description="Manage blockout times when you are completely unavailable for bookings."
 >
 <div className="space-y-4">
 <div className="flex items-center justify-between py-2">
 <span className="text-sm font-bold text-text-secondary">Currently On Leave</span>
 <button
 type="button"
 role="switch"
 aria-checked={leaveStatus.currentlyOnLeave}
 onClick={() => setLeaveStatus({ ...leaveStatus, currentlyOnLeave: !leaveStatus.currentlyOnLeave })}
 className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${
 leaveStatus.currentlyOnLeave ?"bg-accent-light" :"bg-slate-200"
 }`}
 >
 <span
 className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
 leaveStatus.currentlyOnLeave ?"translate-x-5" :"translate-x-0"
 }`}
 />
 </button>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <DateInput
 label="Leave Start Date"
 value={leaveStatus.startDate}
 disabled={!leaveStatus.currentlyOnLeave}
 onChange={(e) => setLeaveStatus({ ...leaveStatus, startDate: e.target.value })}
 />
 <DateInput
 label="Leave End Date"
 value={leaveStatus.endDate}
 disabled={!leaveStatus.currentlyOnLeave}
 onChange={(e) => setLeaveStatus({ ...leaveStatus, endDate: e.target.value })}
 />
 </div>

 <TextAreaInput
 label="Leave Reason"
 value={leaveStatus.reason}
 disabled={!leaveStatus.currentlyOnLeave}
 placeholder="Enter reason for leave..."
 onChange={(e) => setLeaveStatus({ ...leaveStatus, reason: e.target.value })}
 />
 </div>
 </FormSection>
 </FormLayout>
 </div>

 {/* Right Column (4-span) */}
 <div className="lg:col-span-4 space-y-6">
 {/* 8. Upcoming Time Off */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary">Upcoming Time Off</h3>
 <div className="space-y-4">
 {upcomingLeaves.map((leave) => (
 <div key={leave.id} className="p-3 border border-border-light rounded-2xl space-y-2">
 <div className="flex items-center justify-between gap-6">
 <span className="text-base font-extrabold text-accent-light font-mono">{leave.duration}</span>
 <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase ${
 leave.status ==="Approved"
 ?"bg-accent-light text-accent border border-emerald-100"
 :"bg-bg text-accent-light border border-amber-100"
 }`}>
 {leave.status}
 </span>
 </div>
 <p className="text-sm font-bold text-primary">{leave.reason}</p>
 <p className="text-base text-text-tertiary font-semibold">{leave.dateRange}</p>
 </div>
 ))}
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
 Save Availability
 </PrimaryButton>
 </div>
 </form>
 </div>
 );
}
