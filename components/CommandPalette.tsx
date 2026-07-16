"use client";

import React, { useState, useEffect, useRef } from"react";
import { motion, AnimatePresence } from"motion/react";
import { 
 Search, Compass, Activity, FileText, Globe, User, 
 DollarSign, Award, Settings, ShieldCheck, CornerDownLeft, 
 Sparkles, X, Star, Clock, Pin 
} from"lucide-react";

interface CommandItem {
 id: string;
 title: string;
 category:"Navigation" |"Quick Actions" |"Patients" |"Bookings" |"Agencies" |"Staff" |"Reports" |"Settings" |"Pinned Actions" |"Recent Searches";
 icon: React.ReactNode;
 shortcut?: string;
 action: () => void;
}

interface CommandPaletteProps {
 isOpen: boolean;
 onClose: () => void;
 onNavigate: (tabId: string) => void;
 onTriggerAction: (actionId: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate, onTriggerAction }: CommandPaletteProps) {
 const [search, setSearch] = useState("");
 const [selectedIndex, setSelectedIndex] = useState(0);
 const containerRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);
 
 // Local state for recent searches and pinned actions
 const [recentSearches, setRecentSearches] = useState<string[]>([]);
 const [pinnedActions, setPinnedActions] = useState<string[]>([]);

 // Load from local storage
 useEffect(() => {
 if (isOpen) {
 setSearch("");
 setSelectedIndex(0);
 setTimeout(() => inputRef.current?.focus(), 100);
 document.body.style.overflow ="hidden";
 
 const savedSearches = localStorage.getItem("hc_recent_searches");
 if (savedSearches) {
 try { setRecentSearches(JSON.parse(savedSearches)); } catch(e) {}
 }
 const savedPins = localStorage.getItem("hc_pinned_actions");
 if (savedPins) {
 try { setPinnedActions(JSON.parse(savedPins)); } catch(e) {}
 }
 } else {
 document.body.style.overflow ="";
 }
 return () => {
 document.body.style.overflow ="";
 };
 }, [isOpen]);

 const recordSearch = (title: string) => {
 const updated = [title, ...recentSearches.filter(s => s !== title)].slice(0, 5);
 setRecentSearches(updated);
 localStorage.setItem("hc_recent_searches", JSON.stringify(updated));
 };

 const togglePin = (e: React.MouseEvent, title: string) => {
 e.stopPropagation();
 let updated;
 if (pinnedActions.includes(title)) {
 updated = pinnedActions.filter(x => x !== title);
 } else {
 updated = [...pinnedActions, title];
 }
 setPinnedActions(updated);
 localStorage.setItem("hc_pinned_actions", JSON.stringify(updated));
 };

 // Build items array dynamically
 const items: CommandItem[] = [
 // 1. Navigation Pages
 {
 id:"nav-dashboard",
 title:"Go to Personalized Dashboard",
 category:"Navigation",
 icon: <Activity className="w-4 h-4 text-accent" />,
 action: () => { recordSearch("Personalized Dashboard"); onNavigate("dashboard"); onClose(); }
 },
 {
 id:"nav-marketplace",
 title:"Go to Agency Marketplace",
 category:"Navigation",
 icon: <Compass className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Agency Marketplace"); onNavigate("marketplace"); onClose(); }
 },
 {
 id:"nav-booking",
 title:"Open 15-Step Booking State Machine",
 category:"Navigation",
 icon: <Activity className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Booking State Machine"); onNavigate("booking_engine"); onClose(); }
 },
 {
 id:"nav-careplans",
 title:"View Clinical Care Plans",
 category:"Navigation",
 icon: <FileText className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Clinical Care Plans"); onNavigate("care_plans"); onClose(); }
 },
 {
 id:"nav-agency",
 title:"Open Agency Workspaces",
 category:"Navigation",
 icon: <Globe className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Agency Workspace"); onNavigate("agency_desk"); onClose(); }
 },
 {
 id:"nav-staff",
 title:"View Companion Duty Rosters",
 category:"Navigation",
 icon: <User className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Duty Roster"); onNavigate("staff_roster"); onClose(); }
 },
 {
 id:"nav-billing",
 title:"View Settlement Invoices",
 category:"Navigation",
 icon: <DollarSign className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Invoices"); onNavigate("billing_invoices"); onClose(); }
 },
 {
 id:"nav-compliance",
 title:"Check Onboarding Compliance approvals",
 category:"Navigation",
 icon: <ShieldCheck className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Compliance"); onNavigate("compliance"); onClose(); }
 },
 {
 id:"nav-reports",
 title:"Open Snowflake Relational Reports",
 category:"Navigation",
 icon: <FileText className="w-4 h-4 text-accent-light" />,
 action: () => { recordSearch("Snowflake Reports"); onNavigate("reports"); onClose(); }
 },
 {
 id:"nav-audit",
 title:"View Immutable Audit Trails",
 category:"Navigation",
 icon: <ShieldCheck className="w-4 h-4 text-rose-500" />,
 action: () => { recordSearch("Audit Logs"); onNavigate("audit"); onClose(); }
 },
 {
 id:"nav-settings",
 title:"Open Settings and Customizations",
 category:"Navigation",
 icon: <Settings className="w-4 h-4 text-secondary" />,
 action: () => { recordSearch("Settings Console"); onNavigate("settings"); onClose(); }
 },

 // 2. Quick Actions
 {
 id:"act-create-booking",
 title:"Quick Action: Schedule New Booking",
 category:"Quick Actions",
 icon: <Sparkles className="w-4 h-4 text-accent-light" />,
 shortcut:"N",
 action: () => { recordSearch("Schedule New Booking"); onTriggerAction("open-booking-flow"); onClose(); }
 },
 {
 id:"act-trigger-login",
 title:"Access Console Secure Login",
 category:"Quick Actions",
 icon: <User className="w-4 h-4 text-secondary" />,
 shortcut:"L",
 action: () => { recordSearch("Secure Login"); onTriggerAction("open-login-modal"); onClose(); }
 },

 // 3. Patients
 {
 id:"p-vic",
 title:"Patient: Ankala Victoria Rani (DLF Cybercity)",
 category:"Patients",
 icon: <User className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Ankala Victoria Rani"); onNavigate("dashboard"); onClose(); }
 },

 // 4. Staff
 {
 id:"s-priya",
 title:"Nurse: Priya Sharma, RN (ICU Care Expert)",
 category:"Staff",
 icon: <User className="w-4 h-4 text-secondary" />,
 action: () => { recordSearch("Priya Sharma RN"); onNavigate("staff_roster"); onClose(); }
 },
 {
 id:"s-ram",
 title:"Caregiver: Ramesh Rao (Elderly Companion)",
 category:"Staff",
 icon: <User className="w-4 h-4 text-secondary" />,
 action: () => { recordSearch("Ramesh Rao"); onNavigate("staff_roster"); onClose(); }
 },

 // 5. Agencies
 {
 id:"a-nis",
 title:"Agency: Nisarga Home Healthcare Services",
 category:"Agencies",
 icon: <Globe className="w-4 h-4 text-accent" />,
 action: () => { recordSearch("Nisarga Healthcare"); onNavigate("marketplace"); onClose(); }
 },

 // 6. Reports Categories
 {
 id:"rep-rev",
 title:"Report: Weekly Revenue Ledger Summary",
 category:"Reports",
 icon: <FileText className="w-4 h-4 text-accent" />,
 action: () => { recordSearch("Revenue Report"); onNavigate("reports"); onClose(); }
 },
 {
 id:"rep-comp",
 title:"Report: Compliance Performance Tracing Log",
 category:"Reports",
 icon: <FileText className="w-4 h-4 text-rose-500" />,
 action: () => { recordSearch("Compliance Report"); onNavigate("reports"); onClose(); }
 },

 // 7. Settings subcategories
 {
 id:"set-profile",
 title:"Settings: Profile & Account Settings",
 category:"Settings",
 icon: <Settings className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Profile Settings"); onNavigate("settings"); onClose(); }
 },
 {
 id:"set-theme",
 title:"Settings: Theme preferences",
 category:"Settings",
 icon: <Settings className="w-4 h-4 text-text-tertiary" />,
 action: () => { recordSearch("Theme Preferences"); onNavigate("settings"); onClose(); }
 }
 ];

 // Append recent searches categories dynamically
 const dynamicItems = [...items];
 
 recentSearches.forEach((rec, idx) => {
 dynamicItems.push({
 id:`recent-${idx}`,
 title:`Search: ${rec}`,
 category:"Recent Searches",
 icon: <Clock className="w-4 h-4 text-text-tertiary" />,
 action: () => {
 // Re-execute navigation or match keywords to navigate
 if (rec.includes("Dashboard")) onNavigate("dashboard");
 else if (rec.includes("Marketplace")) onNavigate("marketplace");
 else if (rec.includes("Invoices")) onNavigate("billing_invoices");
 else if (rec.includes("Reports")) onNavigate("reports");
 else if (rec.includes("Audit")) onNavigate("audit");
 else onNavigate("dashboard");
 onClose();
 }
 });
 });

 // Append pinned actions dynamically
 pinnedActions.forEach((pinName, idx) => {
 dynamicItems.push({
 id:`pinned-${idx}`,
 title:`Pinned: ${pinName}`,
 category:"Pinned Actions",
 icon: <Pin className="w-4 h-4 text-accent" />,
 action: () => {
 if (pinName.includes("Dashboard")) onNavigate("dashboard");
 else if (pinName.includes("Marketplace")) onNavigate("marketplace");
 else if (pinName.includes("Reports")) onNavigate("reports");
 else onNavigate("dashboard");
 onClose();
 }
 });
 });

 // Fuzzy match search queries
 const filteredItems = dynamicItems.filter((item) => {
 if (!search) {
 // If search is empty, don't show dynamic Patient/Staff/Agency/Reports nodes to avoid clutter
 return ["Navigation","Quick Actions","Pinned Actions","Recent Searches"].includes(item.category);
 }
 const fuzzy = search.toLowerCase();
 return (
 item.title.toLowerCase().includes(fuzzy) ||
 item.category.toLowerCase().includes(fuzzy)
 );
 });

 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (!isOpen) return;

 if (e.key ==="ArrowDown") {
 e.preventDefault();
 setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
 } else if (e.key ==="ArrowUp") {
 e.preventDefault();
 setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
 } else if (e.key ==="Enter") {
 e.preventDefault();
 if (filteredItems[selectedIndex]) {
 filteredItems[selectedIndex].action();
 }
 } else if (e.key ==="Escape") {
 e.preventDefault();
 onClose();
 }
 };

 window.addEventListener("keydown", handleKeyDown);
 return () => window.removeEventListener("keydown", handleKeyDown);
 }, [isOpen, filteredItems, selectedIndex, onClose]);

 const handleBackdropClick = (e: React.MouseEvent) => {
 if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
 onClose();
 }
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <div
 onClick={handleBackdropClick}
 className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] p-6"
 >
 <motion.div
 ref={containerRef}
 initial={{ opacity: 0, scale: 0.95, y: -20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: -20 }}
 transition={{ duration: 0.15 }}
 className="bg-white border border-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[70vh]"
 >
 {/* Search Header */}
 <div className="flex items-center gap-6 px-5 py-4 border-b border-border-light">
 <Search className="w-5 h-5 text-text-tertiary shrink-0" />
 <input
 ref={inputRef}
 type="text"
 placeholder="Search Patients, Bookings, Staff, Reports, Settings or navigation..."
 value={search}
 onChange={(e) => {
 setSearch(e.target.value);
 setSelectedIndex(0);
 }}
 className="w-full bg-transparent border-none text-primary text-base focus:outline-none placeholder:text-text-tertiary :text-text-tertiary"
 />
 <span className="hidden sm:inline px-3 py-2.5 bg-bg-alt text-text-tertiary text-base font-bold rounded-lg uppercase tracking-wider">
 ESC
 </span>
 <button
 onClick={onClose}
 className="text-text-tertiary hover:text-text-secondary :text-white p-1 rounded-lg"
 >
 <X className="w-4 h-4" />
 </button>
 </div>

 {/* Results Roster */}
 <div className="flex-1 overflow-y-auto p-3">
 {filteredItems.length === 0 ? (
 <div className="text-center py-12">
 <p className="text-base text-text-tertiary">No matching search query found.</p>
 </div>
 ) : (
 <div className="space-y-4">
 {/* Categorize and Group results */}
 {[
"Navigation","Quick Actions","Patients","Bookings", 
"Agencies","Staff","Reports","Settings", 
"Pinned Actions","Recent Searches"
 ].map((category) => {
 const catItems = filteredItems.filter((i) => i.category === category);
 if (catItems.length === 0) return null;

 return (
 <div key={category} className="space-y-1">
 <span className="block px-3 text-base font-bold text-text-tertiary uppercase tracking-widest mb-1.5">
 {category}
 </span>
 {catItems.map((item) => {
 const overallIndex = filteredItems.indexOf(item);
 const isSelected = overallIndex === selectedIndex;
 const isPinned = pinnedActions.includes(item.title);

 return (
 <div
 key={item.id}
 onClick={item.action}
 onMouseEnter={() => setSelectedIndex(overallIndex)}
 className={`flex items-center justify-between px-3 py-2.5 rounded-2xl cursor-pointer transition-all ${
 isSelected
 ?"bg-primary text-white"
 :"text-text-secondary hover:bg-bg-alt :bg-primary/50"
 }`}
 >
 <div className="flex items-center gap-6">
 <span className={isSelected ?"text-white" :"text-text-tertiary"}>
 {item.icon}
 </span>
 <span className="text-sm font-bold leading-none">{item.title}</span>
 </div>
 <div className="flex items-center gap-1.5">
 {/* Toggle Pin Button */}
 {["Navigation","Quick Actions"].includes(item.category) && (
 <button
 onClick={(e) => togglePin(e, item.title)}
 className={`p-1 rounded hover:bg-slate-200 :bg-primary-hover ${
 isPinned ?"text-teal-400" :"text-text-tertiary"
 }`}
 >
 <Pin className="w-3 h-3" />
 </button>
 )}
 {item.shortcut && (
 <span className={`px-1.5 py-2.5 rounded text-sm font-extrabold ${
 isSelected
 ?"bg-white/20 text-white"
 :"bg-bg-alt text-text-tertiary"
 }`}>
 {item.shortcut}
 </span>
 )}
 {isSelected && (
 <CornerDownLeft className="w-3.5 h-3.5 opacity-60 animate-pulse" />
 )}
 </div>
 </div>
 );
 })}
 </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Footer tips */}
 <div className="bg-bg-alt px-5 py-4 border-t border-border-light flex items-center justify-between text-base text-text-tertiary">
 <div className="flex gap-6">
 <span>↑↓ to navigate</span>
 <span>↵ to select</span>
 </div>
 <span>HomeCare Enterprise Search</span>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
