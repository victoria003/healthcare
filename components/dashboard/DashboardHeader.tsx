"use client";

import React from"react";
import SearchInput from"./SearchInput";
import NotificationMenu from"./NotificationMenu";
import UserMenu from"./UserMenu";
import { DashboardHeaderProps } from"@/types/dashboard";

export default function DashboardHeader({ userName, userEmail, onLogout, onNavigateToTab }: Omit<DashboardHeaderProps,"pageTitle"> & { pageTitle?: string }) {
 return (
 <header className="bg-[#FAE5D8]/95 [#2A114B]/95 backdrop-blur-[20px] border-b border-[rgba(82,41,89,.08)] [rgba(250,229,216,.12)] sticky top-0 z-30 h-14 flex items-center select-none">
 <div className="w-full px-6 flex items-center justify-between">
 {/* Left: Minimal Search Bar */}
 <div className="flex-1 max-w-sm">
 <SearchInput placeholder="Search platform..." className="w-full" />
 </div>

 {/* Right: Notifications + Profile */}
 <div className="flex items-center gap-6">
 <NotificationMenu />
 <UserMenu
 userName={userName}
 userEmail={userEmail}
 onLogout={onLogout}
 onNavigateToTab={onNavigateToTab}
 />
 </div>
 </div>
 </header>
 );
}
