"use client";

import React from"react";
import { Compass, Activity, FileText, Globe, User, ShieldCheck } from"lucide-react";

interface TabItem {
 id: string;
 label: string;
 icon: React.ReactNode;
 badgeCount?: number;
}

interface MobileBottomNavProps {
 activeTab: string;
 onTabChange: (tabId: string) => void;
 userRole?: string;
}

export function MobileBottomNav({ activeTab, onTabChange, userRole ="Patient" }: MobileBottomNavProps) {
 const allTabs: TabItem[] = [
 {
 id:"marketplace",
 label:"Explore Care",
 icon: <Compass className="w-5 h-5" />,
 },
 {
 id:"booking_engine",
 label:"Bookings",
 icon: <Activity className="w-5 h-5" />,
 },
 {
 id:"care_plans",
 label:"Care Plan",
 icon: <FileText className="w-5 h-5" />,
 },
 {
 id:"agency_desk",
 label:"Agency Desk",
 icon: <Globe className="w-5 h-5" />,
 },
 {
 id:"staff_roster",
 label:"Companion Desk",
 icon: <User className="w-5 h-5" />,
 },
 {
 id:"compliance",
 label:"Compliance",
 icon: <ShieldCheck className="w-5 h-5" />,
 },
 ];

 // Filter tabs dynamically based on login state and roles
 const filteredTabs = allTabs.filter((tab) => {
 if (tab.id ==="marketplace" || tab.id ==="booking_engine") return true;
 if (tab.id ==="care_plans") return ["Patient","Family Member"].includes(userRole);
 if (tab.id ==="agency_desk") return ["Home Healthcare Agency","Agency Admin","Agency Owner"].includes(userRole);
 if (tab.id ==="staff_roster") return ["Nurse","Caregiver","Physiotherapist","Doctor"].includes(userRole);
 if (tab.id ==="compliance") return userRole ==="Platform Admin";
 return false;
 });

 return (
 <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border py-2.5 px-5 z-40 flex items-center justify-around shadow-lg pb-safe">
 {filteredTabs.map((tab) => {
 const isActive = activeTab === tab.id;

 return (
 <button
 key={tab.id}
 onClick={() => onTabChange(tab.id)}
 className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
 isActive
 ?"text-accent scale-105 font-bold"
 :"text-text-tertiary hover:text-text-secondary"
 }`}
 >
 <div className="relative">
 {tab.icon}
 {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full text-[8px] px-1 font-bold">
 {tab.badgeCount}
 </span>
 )}
 </div>
 <span className="text-sm uppercase tracking-wider leading-none">
 {tab.label}
 </span>
 </button>
 );
 })}
 </div>
 );
}
