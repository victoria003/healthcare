"use client";

import React, { useState } from"react";
import { User, Settings, HelpCircle, LogOut, ChevronDown } from"lucide-react";
import { UserMenuProps } from"@/types/dashboard";

export default function UserMenu({ userName, userEmail, onLogout, onNavigateToTab }: UserMenuProps) {
 const [open, setOpen] = useState(false);

 return (
 <div className="relative">
 <button
 onClick={() => setOpen(!open)}
 className="flex items-center gap-6 p-1.5 hover:bg-bg-alt :bg-slate-805 rounded-xl transition-all text-left"
 >
 <div className="w-7 h-7 rounded-xl bg-accent-light text-white font-black text-sm flex items-center justify-center">
 {userName ? userName.charAt(0).toUpperCase() :"U"}
 </div>
 <div className="hidden sm:block">
 <p className="text-sm font-bold text-primary leading-tight">
 {userName ||"User"}
 </p>
 </div>
 <ChevronDown className="w-3 h-3 text-text-tertiary hidden sm:block" />
 </button>

 {open && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
 <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-2xl p-2 shadow-lg z-50 text-sm">
 <div className="px-3 py-2 border-b border-slate-150">
 <p className="font-extrabold text-primary">{userName}</p>
 <p className="text-base text-text-tertiary mt-0.5">{userEmail}</p>
 </div>
 <div className="py-2">
 <button
 onClick={() => {
 setOpen(false);
 if (onNavigateToTab) onNavigateToTab("profile");
 }}
 className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-slate-55 :bg-slate-850 rounded-xl transition-colors font-semibold text-text-secondary"
 >
 <User className="w-3.5 h-3.5" />
 Profile
 </button>
 <button
 onClick={() => {
 setOpen(false);
 if (onNavigateToTab) onNavigateToTab("settings");
 }}
 className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-slate-55 :bg-slate-850 rounded-xl transition-colors font-semibold text-text-secondary"
 >
 <Settings className="w-3.5 h-3.5" />
 Settings
 </button>
 <button
 onClick={() => {
 setOpen(false);
 if (onNavigateToTab) onNavigateToTab("support");
 }}
 className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-slate-55 :bg-slate-850 rounded-xl transition-colors font-semibold text-text-secondary"
 >
 <HelpCircle className="w-3.5 h-3.5" />
 Support
 </button>
 <button
 onClick={() => {
 setOpen(false);
 onLogout();
 }}
 className="w-full flex items-center gap-6 px-3 py-2.5 hover:bg-rose-50 :bg-rose-950/20 text-rose-600 rounded-xl transition-colors font-bold"
 >
 <LogOut className="w-3.5 h-3.5" />
 Sign Out
 </button>
 </div>
 </div>
 </>
 )}
 </div>
 );
}
