"use client";

import React, { useState } from"react";
import { Check, Clock, User, Heart, ShieldCheck, FileText, ChevronDown, ChevronUp, DollarSign, Key } from"lucide-react";
import { motion } from"motion/react";

export interface TimelineEvent {
 id: string;
 title: string;
 description: string;
 timestamp: string;
 status?:"completed" |"current" |"upcoming" |"approved" |"rejected" |"pending";
 actor?: string;
 vitals?: { label: string; value: string }[];
 amount?: number;
 ip?: string;
}

interface TimelineProps {
 type:"patient" |"booking" |"visit" |"audit" |"payment" |"document";
 events: TimelineEvent[];
}

export function Timeline({ type, events }: TimelineProps) {
 const [expandedId, setExpandedId] = useState<string | null>(null);

 const getIcon = (evt: TimelineEvent) => {
 switch (type) {
 case"patient":
 return <Heart className="w-4 h-4 text-rose-500" />;
 case"booking":
 return <Clock className="w-4 h-4 text-text-tertiary" />;
 case"visit":
 return <User className="w-4 h-4 text-accent" />;
 case"audit":
 return <Key className="w-4 h-4 text-accent-light" />;
 case"payment":
 return <DollarSign className="w-4 h-4 text-accent" />;
 case"document":
 return <FileText className="w-4 h-4 text-secondary" />;
 default:
 return <ShieldCheck className="w-4 h-4 text-text-tertiary" />;
 }
 };

 return (
 <div className="space-y-6">
 <div className="relative pl-6 space-y-6 border-l border-border">
 {events.map((evt, idx) => {
 const isCompleted = evt.status ==="completed" || evt.status ==="approved";
 const isCurrent = evt.status ==="current" || evt.status ==="pending";
 const isExpanded = expandedId === evt.id;

 return (
 <div key={evt.id || idx} className="relative">
 {/* Bullet Node Indicator */}
 <span className={`absolute -left-10 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
 isCompleted
 ?"bg-accent border-accent text-white"
 : isCurrent
 ?"bg-white border-slate-900 text-primary ring-4 ring-slate-100"
 :"bg-white border-border text-white"
 }`}>
 {isCompleted ? (
 <Check className="w-3.5 h-3.5 stroke-[3]" />
 ) : (
 getIcon(evt)
 )}
 </span>

 {/* Card Container */}
 <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-2 hover:shadow-md transition-shadow">
 <div className="flex justify-between items-start gap-6">
 <div className="space-y-1">
 <div className="flex flex-wrap items-center gap-6">
 <h4 className={`text-sm font-bold leading-none ${
 isCurrent ?"text-primary" :"text-text-secondary"
 }`}>
 {evt.title}
 </h4>
 <span className="text-sm font-mono font-bold text-text-tertiary">
 {evt.timestamp}
 </span>
 </div>
 {evt.actor && (
 <p className="text-sm font-bold text-text-tertiary">Triggered by: {evt.actor}</p>
 )}
 </div>

 <button
 onClick={() => setExpandedId(isExpanded ? null : evt.id)}
 className="p-1 text-text-tertiary hover:text-text-secondary :text-white rounded-lg"
 >
 {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
 </button>
 </div>

 <p className="text-base text-text-tertiary leading-normal font-medium">
 {evt.description}
 </p>

 {/* Vitals indicators */}
 {evt.vitals && evt.vitals.length > 0 && (
 <div className="grid grid-cols-3 gap-6 pt-2 border-t border-border-light">
 {evt.vitals.map((v, vIdx) => (
 <div key={vIdx} className="bg-bg-alt p-2 rounded-lg text-center border border-border-light">
 <span className="block text-[8px] font-bold text-text-tertiary uppercase tracking-widest">{v.label}</span>
 <span className="text-base font-extrabold text-primary">{v.value}</span>
 </div>
 ))}
 </div>
 )}

 {/* Payment specific details */}
 {type ==="payment" && evt.amount !== undefined && (
 <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-border-light text-primary">
 <span>Transacted Total:</span>
 <span className="text-accent">INR {evt.amount.toLocaleString()}</span>
 </div>
 )}

 {/* Collapsible expanded metadata */}
 {isExpanded && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height:"auto" }}
 className="pt-2 border-t border-border-light text-base text-text-tertiary space-y-1.5 font-medium"
 >
 <p className="font-semibold text-text-secondary">Transaction ID Trace:</p>
 <p className="font-mono bg-bg-alt p-1.5 rounded text-sm break-all border border-border-light">
 ref-hash-{evt.id ||"default"}
 </p>
 {evt.ip && (
 <p className="text-sm">Logged IP Address: <span className="font-mono">{evt.ip}</span></p>
 )}
 </motion.div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}

// Preserve existing legacy exports to prevent breaking other files
interface BookingStep {
 id: string;
 title: string;
 description: string;
 timestamp?: string;
 status:"completed" |"current" |"upcoming";
}
interface BookingTimelineProps {
 steps: BookingStep[];
}
export function BookingTimeline({ steps }: BookingTimelineProps) {
 const converted = steps.map((s) => ({
 id: s.id,
 title: s.title,
 description: s.description,
 timestamp: s.timestamp ||"",
 status: s.status
 }));
 return <Timeline type="booking" events={converted} />;
}

interface MedicalLog {
 id: string;
 type:"vital" |"treatment" |"document" |"note";
 title: string;
 description: string;
 date: string;
 author: string;
 vitals?: { label: string; value: string }[];
 attachmentName?: string;
}
interface PatientTimelineProps {
 logs: MedicalLog[];
}
export function PatientTimeline({ logs }: PatientTimelineProps) {
 const converted = logs.map((l) => ({
 id: l.id,
 title: l.title,
 description: l.description,
 timestamp: l.date,
 actor: l.author,
 vitals: l.vitals
 }));
 return <Timeline type="patient" events={converted} />;
}
