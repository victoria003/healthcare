"use client";

import React, { useState } from"react";
import { ShieldCheck, Search, Filter, FolderHeart, Calendar, FileText, Activity, Upload, Paperclip } from"lucide-react";
import { PageHeader, CleanCard, EmptyState } from"@/components/DesignSystem";

export default function PatientMedicalRecordsPage() {
 const [searchQuery, setSearchQuery] = useState("");
 const [activeFilter, setActiveFilter] = useState("All");

 const filterChips = ["All","Visits","Lab Reports","Prescriptions","Documents"];

 // Mock initial medical records for Ankala Victoria Rani
 const mockRecords = [
 {
 id:"rec-1",
 title:"Tracheostomy Decannulation Protocol",
 type:"Documents",
 date:"Jul 15, 2026",
 provider:"Priya Sharma, RN (Nisarga Home Healthcare)",
 description:"Vital observations, decannulation staging parameters, and airway patency checks.",
 fileName:"decannulation_protocol_v1.pdf"
 },
 {
 id:"rec-2",
 title:"Physiotherapy Range of Motion Assessment",
 type:"Visits",
 date:"Jul 12, 2026",
 provider:"Ramesh Rao, Caregiver",
 description:"Post-stroke mobility report measuring joint articulation and walking posture stability.",
 fileName:"mobility_rom_log.pdf"
 }
 ];

 const filteredRecords = mockRecords.filter((rec) => {
 if (activeFilter !=="All" && rec.type !== activeFilter) return false;
 if (searchQuery.trim() !=="") {
 const q = searchQuery.toLowerCase();
 return rec.title.toLowerCase().includes(q) || rec.description.toLowerCase().includes(q);
 }
 return true;
 });

 return (
 <div className="w-full space-y-8">
 {/* 1. Page Header */}
 <PageHeader
 title="Medical Records"
 description="Securely store and view your personal clinical history, prescriptions, and therapist reports."
 action={
 <button
 onClick={() => alert("Upload dialog triggered.")}
 className="flex items-center gap-6 px-5 py-2 bg-primary text-white hover:bg-slate-850 :bg-bg-alt rounded-lg text-sm font-semibold shadow-sm transition-all"
 >
 <Upload className="w-3.5 h-3.5" />
 <span>Upload Record</span>
 </button>
 }
 />

 {/* 2. Search & Filters */}
 <div className="space-y-4">
 <div className="relative max-w-sm">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
 <input
 type="text"
 placeholder="Search health documents..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none focus:border-border :border-border-light text-primary transition-all"
 />
 </div>

 <div className="flex gap-6 overflow-x-auto scrollbar-none py-2 select-none">
 {filterChips.map((chip) => {
 const isActive = activeFilter === chip;
 return (
 <button
 key={chip}
 type="button"
 onClick={() => setActiveFilter(chip)}
 className={`px-3.5 py-2.5 text-sm font-semibold rounded-full border transition-all whitespace-nowrap ${
 isActive
 ?"bg-primary border-slate-900 text-white shadow-sm"
 :"bg-white border-border/50 [#12121a] text-text-tertiary hover:text-slate-850 :text-white"
 }`}
 >
 {chip}
 </button>
 );
 })}
 </div>
 </div>

 {/* 3. Document Timeline Layout */}
 <section className="space-y-6">
 {filteredRecords.length > 0 ? (
 <div className="relative pl-6 border-l border-border space-y-8 py-2">
 {filteredRecords.map((rec) => (
 <div key={rec.id} className="relative">
 {/* Timeline node icon */}
 <div className="absolute -left-[35px] top-1.5 w-[18px] h-[18px] rounded-full border-2 border-white [#07070d] bg-primary flex items-center justify-center" />

 <div className="space-y-2">
 {/* Metadata header */}
 <div className="flex items-center gap-6">
 <span className="text-base font-bold text-slate-450 uppercase tracking-widest">{rec.date}</span>
 <span className="px-3 py-2.5 rounded bg-bg-alt text-text-secondary text-sm font-bold uppercase tracking-wider">
 {rec.type}
 </span>
 </div>

 {/* Clean Content Summary */}
 <div className="space-y-1">
 <h3 className="text-base font-bold text-primary">
 {rec.title}
 </h3>
 <p className="text-sm text-text-tertiary leading-relaxed max-w-xl font-medium">
 {rec.description}
 </p>
 </div>

 {/* Document preview clip link */}
 <div className="flex items-center gap-6 pt-1">
 <Paperclip className="w-3.5 h-3.5 text-text-tertiary" />
 <span className="text-sm text-slate-450 font-semibold hover:underline cursor-pointer">
 {rec.fileName}
 </span>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <EmptyState
 title="No medical files match your search"
 description="Clear the keyword query to view all patient document logs."
 action={{ label:"Reset Search", onClick: () => setSearchQuery("") }}
 />
 )}
 </section>
 </div>
 );
}
