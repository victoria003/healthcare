"use client";

import React, { useState } from"react";
import { Bell } from"lucide-react";
import { NotificationMenuProps } from"@/types/dashboard";

export default function NotificationMenu(props: NotificationMenuProps) {
 const [open, setOpen] = useState(false);

 return (
 <div className="relative">
 <button
 onClick={() => setOpen(!open)}
 className="p-2 hover:bg-bg-alt :bg-slate-805 rounded-xl relative transition-all"
 aria-label="Notifications"
 >
 <Bell className="w-4 h-4 text-text-secondary" />
 <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-light rounded-full" />
 </button>

 {open && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
 <div className="absolute right-0 mt-2 w-72 bg-white border border-border rounded-2xl p-6 shadow-lg z-50 text-sm">
 <h4 className="font-extrabold text-primary mb-2 pb-2 border-b border-slate-150">
 Notifications
 </h4>
 <div className="space-y-2 text-text-tertiary">
 <div className="p-2.5 bg-slate-55 rounded-xl">
 <span className="font-extrabold text-primary block">System Update</span>
 Welcome to the unified HomeCare Marketplace Dashboard!
 </div>
 <div className="p-2.5 bg-slate-55 rounded-xl">
 <span className="font-extrabold text-primary block">Verification Logs</span>
 Secure connection to the workspace initialized.
 </div>
 </div>
 </div>
 </>
 )}
 </div>
 );
}
