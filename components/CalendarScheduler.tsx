"use client";

import React, { useState } from"react";
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle, Plus, Users, ShieldAlert, Check } from"lucide-react";
import { motion } from"motion/react";

interface Appointment {
 id: string;
 patientName: string;
 serviceName: string;
 timeSlot: string; // e.g."09:00 AM - 11:00 AM"
 date: string; //"2026-07-12"
 staffId?: string;
 staffName?: string;
 color?: string;
 isConflict?: boolean;
 recurrence?:"none" |"daily" |"weekly" |"monthly";
}

interface LeaveRecord {
 staffId: string;
 staffName: string;
 date: string;
 type: string;
}

interface CalendarSchedulerProps {
 appointments: Appointment[];
 onAddAppointment?: (appt: Omit<Appointment,"id">) => void;
 onUpdateAppointments?: (appts: Appointment[]) => void;
}

export function CalendarScheduler({ appointments, onAddAppointment, onUpdateAppointments }: CalendarSchedulerProps) {
 const [currentView, setCurrentView] = useState<"day" |"week" |"month" |"agenda">("month");
 const [selectedDate, setSelectedDate] = useState("2026-07-12");
 
 // Enterprise Filters
 const [selectedStaffId, setSelectedStaffId] = useState<string>("all");
 const [showAddModal, setShowAddModal] = useState(false);

 // Leave Records simulation
 const leaves: LeaveRecord[] = [
 { staffId:"u-3", staffName:"Priya Sharma, RN", date:"2026-07-18", type:"sick" }
 ];

 // Appointment Form States
 const [newPatient, setNewPatient] = useState("");
 const [newService, setNewService] = useState("ICU Tracheostomy Nursing Setup");
 const [newTimeSlot, setNewTimeSlot] = useState("09:00 AM - 01:00 PM");
 const [newStaffId, setNewStaffId] = useState("u-3");
 const [newRecurrence, setNewRecurrence] = useState<"none" |"daily" |"weekly">("none");

 const staffOptions = [
 { id:"u-3", name:"Priya Sharma, RN" },
 { id:"u-4", name:"Ramesh Rao" },
 ];

 // Static list of July 2026 dates
 const daysInJuly = Array.from({ length: 31 }, (_, i) => {
 const day = i + 1;
 return`2026-07-${day.toString().padStart(2,"0")}`;
 });

 const handleDayClick = (dateStr: string) => {
 setSelectedDate(dateStr);
 };

 // Helper to identify double-bookings / shift conflict detection
 const checkConflicts = (apptsList: Appointment[]) => {
 return apptsList.map((appt, idx) => {
 const hasConflict = apptsList.some((other, oIdx) => {
 if (idx === oIdx) return false;
 return (
 other.date === appt.date &&
 other.timeSlot === appt.timeSlot &&
 other.staffId === appt.staffId &&
 appt.staffId !== undefined
 );
 });
 return { ...appt, isConflict: hasConflict };
 });
 };

 const processedAppointments = checkConflicts(appointments);

 // Apply filters
 const filteredAppointments = processedAppointments.filter((appt) => {
 if (selectedStaffId !=="all" && appt.staffId !== selectedStaffId) {
 return false;
 }
 return true;
 });

 const dayAppointments = filteredAppointments.filter((appt) => appt.date === selectedDate);

 const handleAddSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newPatient || !onAddAppointment) return;

 const matchedStaff = staffOptions.find(s => s.id === newStaffId);
 onAddAppointment({
 patientName: newPatient,
 serviceName: newService,
 timeSlot: newTimeSlot,
 date: selectedDate,
 staffId: newStaffId,
 staffName: matchedStaff ? matchedStaff.name :"Unassigned",
 recurrence: newRecurrence
 });

 setNewPatient("");
 setShowAddModal(false);
 };

 return (
 <div className="bg-white border border-border rounded-3xl p-6 shadow-sm space-y-6">
 
 {/* Calendar Header */}
 <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
 <div className="flex items-center gap-6">
 <div className="p-2 bg-accent-light text-accent rounded-xl">
 <Calendar className="w-5 h-5" />
 </div>
 <div>
 <h3 className="font-extrabold text-primary text-base tracking-tight">Clinical Companion Scheduler</h3>
 <p className="text-base text-text-tertiary font-bold uppercase tracking-wider">July 2026</p>
 </div>
 </div>

 {/* Filters and Switches */}
 <div className="flex flex-wrap items-center gap-6">
 {/* Staff Filter */}
 <select
 value={selectedStaffId}
 onChange={(e) => setSelectedStaffId(e.target.value)}
 className="px-3 py-2.5 bg-bg-alt border border-border rounded-xl text-base font-bold uppercase tracking-wider text-text-secondary focus:outline-none"
 >
 <option value="all">All Companions</option>
 {staffOptions.map(st => (
 <option key={st.id} value={st.id}>{st.name}</option>
 ))}
 </select>

 {/* View Toggler */}
 <div className="flex items-center gap-1.5 p-1 bg-bg-alt rounded-2xl border border-border-light">
 {(["day","week","month","agenda"] as const).map((view) => (
 <button
 key={view}
 onClick={() => setCurrentView(view)}
 className={`px-3 py-2.5 rounded-xl text-base font-bold uppercase tracking-wider transition-all cursor-pointer ${
 currentView === view
 ?"bg-primary text-white shadow-xs"
 :"text-text-tertiary hover:text-primary :text-white"
 }`}
 >
 {view}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Main Grid Views */}
 {currentView ==="month" && (
 <div className="space-y-4">
 <div className="grid grid-cols-7 gap-6 text-center text-base font-bold text-text-tertiary uppercase tracking-widest">
 <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
 </div>

 <div className="grid grid-cols-7 gap-6">
 {/* Wednesday July 1 offset */}
 {Array.from({ length: 3 }).map((_, idx) => (
 <div key={idx} className="h-16 bg-bg-alt/50 rounded-2xl opacity-40" />
 ))}

 {daysInJuly.map((dateStr) => {
 const dayNum = parseInt(dateStr.split("-")[2], 10);
 const isSelected = dateStr === selectedDate;
 
 const dayAppts = filteredAppointments.filter((a) => a.date === dateStr);
 const hasConflict = dayAppts.some((a) => a.isConflict);
 const hasLeave = leaves.some(l => l.date === dateStr && (selectedStaffId ==="all" || l.staffId === selectedStaffId));

 return (
 <button
 key={dateStr}
 onClick={() => handleDayClick(dateStr)}
 className={`h-16 p-2 rounded-2xl border flex flex-col justify-between items-start transition-all cursor-pointer group text-left ${
 isSelected
 ?"bg-primary border-slate-950 text-white shadow-md"
 :"bg-white border-border hover:border-border :border-border-light"
 }`}
 >
 <span className="text-base font-extrabold">{dayNum}</span>

 <div className="flex flex-wrap items-center gap-1 w-full justify-between">
 {hasLeave && (
 <span className="text-[8px] bg-accent-light text-primary px-1 rounded font-black uppercase leading-none">
 Leave
 </span>
 )}
 {dayAppts.length > 0 && (
 <span className={`w-1.5 h-1.5 rounded-full ${
 hasConflict
 ?"bg-rose-500 animate-ping"
 : isSelected
 ?"bg-teal-400"
 :"bg-accent"
 }`} />
 )}
 {dayAppts.length > 1 && (
 <span className="text-[8px] font-extrabold leading-none opacity-80 ml-auto">
 {dayAppts.length}x
 </span>
 )}
 </div>
 </button>
 );
 })}
 </div>
 </div>
 )}

 {currentView ==="day" && (
 <div className="space-y-4">
 <div className="flex justify-between items-center bg-bg-alt p-3 rounded-2xl">
 <span className="text-sm font-bold text-text-secondary">
 Schedule for {selectedDate}
 </span>
 {onAddAppointment && (
 <button
 onClick={() => setShowAddModal(true)}
 className="px-3.5 py-2 bg-primary text-white rounded-xl text-base font-bold uppercase flex items-center gap-1 cursor-pointer"
 >
 <Plus className="w-3 h-3" />
 Add Duty Slot
 </button>
 )}
 </div>

 <div className="space-y-3">
 {dayAppointments.length === 0 ? (
 <div className="text-center py-10 border-2 border-dashed border-border-light rounded-2xl">
 <p className="text-sm text-text-tertiary">No care activities scheduled on this day.</p>
 </div>
 ) : (
 dayAppointments.map((appt) => (
 <div
 key={appt.id}
 className={`p-6 rounded-2xl border flex flex-col sm:flex-row gap-6 justify-between items-stretch sm:items-center ${
 appt.isConflict
 ?"bg-rose-50/50 border-rose-200 text-rose-900"
 :"bg-accent-light/40 border-teal-100 text-primary"
 }`}
 >
 <div className="space-y-1">
 <div className="flex items-center gap-6">
 <span className="text-sm font-bold text-primary leading-none">
 {appt.serviceName}
 </span>
 {appt.isConflict && (
 <span className="inline-flex items-center gap-1 px-1.5 py-2.5 bg-rose-100 text-rose-700 rounded text-[8px] font-extrabold uppercase">
 <AlertCircle className="w-2.5 h-2.5" />
 Double Booked
 </span>
 )}
 {appt.recurrence && appt.recurrence !=="none" && (
 <span className="px-1.5 py-2.5 bg-accent-light text-teal-800 rounded text-[8px] font-bold">
 {appt.recurrence}
 </span>
 )}
 </div>
 <p className="text-base font-medium opacity-80">Patient: {appt.patientName}</p>
 </div>

 <div className="flex flex-wrap items-center gap-6 text-base font-bold">
 <span className="flex items-center gap-1">
 <Clock className="w-3.5 h-3.5 opacity-60" />
 {appt.timeSlot}
 </span>
 {appt.staffName && (
 <span className="flex items-center gap-1 bg-slate-150/40 px-3 py-2.5 rounded-full">
 <Users className="w-3.5 h-3.5 opacity-60" />
 {appt.staffName}
 </span>
 )}
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 )}

 {(currentView ==="week" || currentView ==="agenda") && (
 <div className="space-y-4">
 <span className="text-base font-bold text-text-tertiary uppercase tracking-widest block">
 Upcoming Activity Timeline
 </span>

 <div className="space-y-3">
 {filteredAppointments.slice(0, 5).map((appt) => (
 <div
 key={appt.id}
 className={`p-6 border rounded-2xl flex items-center justify-between ${
 appt.isConflict ?"bg-rose-500/5 border-rose-200" :"bg-bg-alt border-border-light"
 }`}
 >
 <div className="space-y-1">
 <span className="text-sm font-extrabold text-accent uppercase tracking-wider block">
 {appt.date}
 </span>
 <h5 className="font-bold text-primary text-sm">{appt.serviceName}</h5>
 <p className="text-base text-text-tertiary">Patient: {appt.patientName}</p>
 </div>

 <div className="flex gap-6 items-center">
 {appt.isConflict && (
 <span className="text-[8px] bg-rose-500 text-white font-extrabold px-1.5 py-2.5 rounded uppercase mr-2 flex items-center gap-0.5">
 <AlertCircle className="w-3 h-3" /> Conflict
 </span>
 )}
 <span className="text-base font-bold text-text-secondary bg-white border border-slate-150 px-3.5 py-2 rounded-xl">
 {appt.timeSlot}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Add Appointment Modal */}
 {showAddModal && (
 <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
 <div className="bg-white rounded-3xl max-w-md w-full border border-border shadow-2xl p-6 space-y-4">
 <div>
 <h3 className="font-bold text-primary text-base">Book Clinical Duty Slot</h3>
 <p className="text-sm text-text-tertiary">Plan shifts and map availabilities on date: {selectedDate}</p>
 </div>

 <form onSubmit={handleAddSubmit} className="space-y-3">
 <div>
 <label className="block text-base font-bold text-text-tertiary uppercase tracking-widest mb-1">Patient Name</label>
 <input
 type="text"
 required
 value={newPatient}
 onChange={(e) => setNewPatient(e.target.value)}
 placeholder="e.g. Ankala Victoria Rani"
 className="w-full px-3 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-base font-bold text-text-tertiary uppercase tracking-widest mb-1">Service Type</label>
 <select
 value={newService}
 onChange={(e) => setNewService(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none"
 >
 <option value="ICU Tracheostomy Nursing Setup">ICU Tracheostomy Nursing Setup</option>
 <option value="Post-Stroke Physiotherapy Session">Post-Stroke Physiotherapy Session</option>
 <option value="24/7 Companion Elderly Care">24/7 Companion Elderly Care</option>
 </select>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div>
 <label className="block text-base font-bold text-text-tertiary uppercase tracking-widest mb-1">Assign Companion</label>
 <select
 value={newStaffId}
 onChange={(e) => setNewStaffId(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none"
 >
 {staffOptions.map(st => (
 <option key={st.id} value={st.id}>{st.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-base font-bold text-text-tertiary uppercase tracking-widest mb-1">Recurrence</label>
 <select
 value={newRecurrence}
 onChange={(e) => setNewRecurrence(e.target.value as any)}
 className="w-full px-3 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none"
 >
 <option value="none">One-time</option>
 <option value="daily">Daily</option>
 <option value="weekly">Weekly</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-base font-bold text-text-tertiary uppercase tracking-widest mb-1">Shift Time Slot</label>
 <select
 value={newTimeSlot}
 onChange={(e) => setNewTimeSlot(e.target.value)}
 className="w-full px-3 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none"
 >
 <option value="09:00 AM - 01:00 PM">Morning (09:00 AM - 01:00 PM)</option>
 <option value="02:00 PM - 06:00 PM">Afternoon (02:00 PM - 06:00 PM)</option>
 <option value="08:00 PM - 08:00 AM">Night Shift (08:00 PM - 08:00 AM)</option>
 </select>
 </div>

 <div className="flex gap-6 pt-3">
 <button
 type="button"
 onClick={() => setShowAddModal(false)}
 className="flex-1 py-2 border border-border rounded-xl text-sm font-bold text-text-tertiary"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-bold uppercase"
 >
 Create Shift
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
