"use client";

import React from"react";
import { House, Compass, CalendarDays, User, MoreHorizontal } from"lucide-react";

interface MobileNavProps {
 activeTab: string;
 onTabChange: (tabId: string) => void;
}

export default function DashboardMobileNavigation({ activeTab, onTabChange }: MobileNavProps) {
 const tabs = [
 { id:"dashboard", label:"Dashboard", icon: <House className="w-4.5 h-4.5" /> },
 { id:"explore", label:"Explore Care", icon: <Compass className="w-4.5 h-4.5" /> },
 { id:"bookings", label:"Bookings", icon: <CalendarDays className="w-4.5 h-4.5" /> },
 { id:"profile", label:"Profile", icon: <User className="w-4.5 h-4.5" /> },
 { id:"more", label:"More", icon: <MoreHorizontal className="w-4.5 h-4.5" /> },
 ];

 return (
 <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around px-3 z-30 shadow-lg">
 {tabs.map((tab) => {
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 onClick={() => onTabChange(tab.id)}
 className={`flex flex-col items-center gap-1 text-sm font-bold transition-colors ${
 isActive ?"text-accent-light" :"text-text-tertiary"
 }`}
 >
 {tab.icon}
 {tab.label}
 </button>
 );
 })}
 </nav>
 );
}
