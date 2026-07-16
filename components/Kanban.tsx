"use client";

import React, { useState } from"react";
import { motion, AnimatePresence } from"motion/react";
import { 
 ArrowRight, User, Calendar, CheckSquare, Clock, 
 MapPin, MoreVertical, Search, Filter, AlertCircle, Plus 
} from"lucide-react";

interface Booking {
 id: string;
 patientName: string;
 serviceName: string;
 timeSlot: string;
 status: string;
 amount: number;
 agencyName?: string;
 priority?:"high" |"medium" |"low";
 dueDate?: string;
 assignedStaffId?: string;
 assignedStaffName?: string;
}

interface KanbanProps {
 bookings: Booking[];
 onStatusChange: (bookingId: string, nextStatus: string) => void;
 onAssignStaff?: (bookingId: string, staffId: string, staffName: string) => void;
}

const COLUMNS = [
 { id:"New", title:"New Requests", color:"border-accent bg-primary/5 text-secondary" },
 { id:"Pending", title:"Pending", color:"border-accent-light bg-accent-light/5 text-accent-light" },
 { id:"Accepted", title:"Accepted", color:"border-indigo-500 bg-primary/5 text-secondary" },
 { id:"Assigned", title:"Assigned", color:"border-purple-500 bg-purple-500/5 text-secondary" },
 { id:"Travelling", title:"Travelling", color:"border-sky-500 bg-sky-500/5 text-sky-600" },
 { id:"Check-In", title:"Checked In", color:"border-accent bg-accent/5 text-accent" },
 { id:"In Progress", title:"In Progress", color:"border-accent bg-accent/5 text-accent" },
 { id:"Completed", title:"Completed", color:"border-slate-500 bg-slate-500/5 text-text-secondary" },
 { id:"Cancelled", title:"Cancelled", color:"border-rose-500 bg-rose-500/5 text-rose-600" },
];

export function Kanban({ bookings, onStatusChange, onAssignStaff }: KanbanProps) {
 const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [priorityFilter, setPriorityFilter] = useState<string>("all");
 const [assigningId, setAssigningId] = useState<string | null>(null);

 const mockStaffOptions = [
 { id:"u-3", name:"Priya Sharma, RN" },
 { id:"u-4", name:"Ramesh Rao" },
 { id:"u-12", name:"Dr. Venkata Raman" }
 ];

 const handleDragStart = (e: React.DragEvent, id: string) => {
 e.dataTransfer.setData("bookingId", id);
 };

 const handleDragOver = (e: React.DragEvent) => {
 e.preventDefault();
 };

 const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
 e.preventDefault();
 const id = e.dataTransfer.getData("bookingId");
 if (id) {
 onStatusChange(id, targetColumnId);
 }
 };

 // Filter bookings locally by search query and priority tag
 const filteredBookings = bookings.filter((b) => {
 const textMatch = b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
 b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
 const prioMatch = priorityFilter ==="all" || (b.priority ||"medium") === priorityFilter;
 return textMatch && prioMatch;
 });

 return (
 <div className="w-full space-y-4">
 {/* Search and filter toolbar */}
 <div className="flex flex-col sm:flex-row gap-6 justify-between items-stretch sm:items-center bg-white p-6 border border-border rounded-3xl shadow-xs">
 <div className="flex flex-1 gap-6 items-center">
 <div className="relative flex-1 max-w-xs">
 <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
 <input
 type="text"
 placeholder="Search patients or treatments..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-9 pr-3 py-2 bg-bg-alt border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-primary"
 />
 </div>

 <select
 value={priorityFilter}
 onChange={(e) => setPriorityFilter(e.target.value)}
 className="px-3 py-2 bg-bg-alt border border-border rounded-xl text-sm font-bold text-text-secondary focus:outline-none"
 >
 <option value="all">All Priorities</option>
 <option value="high">High Priority</option>
 <option value="medium">Medium Priority</option>
 <option value="low">Low Priority</option>
 </select>
 </div>
 <div className="text-base text-text-tertiary font-bold uppercase tracking-wider">
 Drag cards to move dispatch pipeline
 </div>
 </div>

 {/* Scrollable Column container */}
 <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x select-none">
 {COLUMNS.map((col) => {
 const colBookings = filteredBookings.filter(
 (b) => (b.status ||"New").toLowerCase() === col.id.toLowerCase()
 );

 return (
 <div
 key={col.id}
 onDragOver={handleDragOver}
 onDrop={(e) => handleDrop(e, col.id)}
 className="w-72 shrink-0 bg-bg-alt border border-border rounded-3xl p-6 flex flex-col max-h-[640px] snap-center"
 >
 {/* Column Header */}
 <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
 <div className="flex items-center gap-6">
 <span className={`w-2.5 h-2.5 rounded-full border-2 ${col.color.split("")[0]}`} />
 <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
 {col.title}
 </h4>
 </div>
 <span className="px-3 py-2.5 bg-slate-200/50 text-text-tertiary text-base font-extrabold rounded-full">
 {colBookings.length}
 </span>
 </div>

 {/* Booking Cards container */}
 <div className="flex-1 space-y-3 overflow-y-auto pr-1">
 <AnimatePresence initial={false}>
 {colBookings.length === 0 ? (
 <div className="py-8 text-center text-base text-text-tertiary border-2 border-dashed border-border rounded-2xl">
 Drop elements here
 </div>
 ) : (
 colBookings.map((b) => (
 <motion.div
 key={b.id}
 layout
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 draggable
 onDragStart={(e: any) => handleDragStart(e, b.id)}
 className="p-6 bg-white border border-slate-150 rounded-2xl shadow-xs cursor-grab active:cursor-grabbing hover:shadow-md transition-all relative group"
 >
 {/* Quick action menu */}
 <div className="absolute top-3 right-3">
 <button
 onClick={() => setActiveMenuId(activeMenuId === b.id ? null : b.id)}
 className="p-1 text-text-tertiary hover:text-text-secondary rounded-lg hover:bg-bg-alt :bg-primary"
 >
 <MoreVertical className="w-3.5 h-3.5" />
 </button>
 {activeMenuId === b.id && (
 <div className="absolute right-0 mt-1 bg-white border border-border rounded-xl shadow-xl py-2 z-35 min-w-[140px] text-left">
 <span className="block px-3.5 py-2 text-sm font-bold text-text-tertiary uppercase">
 Move status:
 </span>
 {COLUMNS.filter((c) => c.id.toLowerCase() !== (b.status ||"New").toLowerCase()).map((c) => (
 <button
 key={c.id}
 onClick={() => {
 onStatusChange(b.id, c.id);
 setActiveMenuId(null);
 }}
 className="w-full px-3.5 py-2.5 hover:bg-bg-alt :bg-slate-850 text-base font-medium text-text-secondary flex items-center justify-between"
 >
 {c.title}
 <ArrowRight className="w-3 h-3 text-text-tertiary" />
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Card Meta */}
 <div className="space-y-2.5">
 <div>
 <div className="flex items-center gap-1.5">
 <span className="text-base font-extrabold text-accent tracking-wider uppercase block">
 {b.serviceName}
 </span>
 {/* Priority Tag */}
 <span className={`px-1.5 py-2.5 rounded text-[8px] font-black uppercase ${
 (b.priority ||"medium") ==="high" 
 ?"bg-rose-50 text-rose-700"
 : (b.priority ||"medium") ==="low"
 ?"bg-bg-alt text-text-tertiary"
 :"bg-bg text-accent-light"
 }`}>
 {b.priority ||"medium"}
 </span>
 </div>
 <h5 className="font-bold text-primary text-sm mt-0.5">
 {b.patientName}
 </h5>
 </div>

 <div className="space-y-1.5 border-t border-border-light pt-2.5 text-base text-text-tertiary font-medium">
 <div className="flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-text-tertiary" />
 <span>{b.timeSlot}</span>
 </div>
 {b.dueDate && (
 <div className="flex items-center gap-1.5 text-rose-600">
 <Calendar className="w-3.5 h-3.5 text-rose-400" />
 <span>Due: {b.dueDate}</span>
 </div>
 )}
 
 {/* Staff Assignment */}
 <div className="flex items-center justify-between border-t border-border-light pt-2 mt-1">
 {assigningId === b.id ? (
 <select
 onChange={(e) => {
 const opt = mockStaffOptions.find(o => o.id === e.target.value);
 if (opt && onAssignStaff) {
 onAssignStaff(b.id, opt.id, opt.name);
 }
 setAssigningId(null);
 }}
 defaultValue=""
 className="w-full px-3 py-2 bg-bg-alt border border-border rounded text-sm text-text-secondary focus:outline-none"
 >
 <option value="" disabled>Choose specialist...</option>
 {mockStaffOptions.map(opt => (
 <option key={opt.id} value={opt.id}>{opt.name}</option>
 ))}
 </select>
 ) : (
 <div className="flex items-center justify-between w-full">
 <span className="text-sm text-text-tertiary">Specialist Assigned:</span>
 <button
 onClick={() => setAssigningId(b.id)}
 className="text-sm font-bold text-accent hover:underline"
 >
 {b.assignedStaffName ||"Assign companion"}
 </button>
 </div>
 )}
 </div>
 </div>

 <div className="flex justify-between items-center pt-2 border-t border-border-light text-base font-bold">
 <span className="text-text-tertiary">Total Settlement</span>
 <span className="text-primary">
 INR {b.amount.toLocaleString()}
 </span>
 </div>
 </div>
 </motion.div>
 ))
 )}
 </AnimatePresence>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}
