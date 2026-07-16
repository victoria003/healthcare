"use client";

import React from"react";
import { usePathname, useSearchParams } from"next/navigation";
import { ChevronLeft, ChevronRight } from"lucide-react";
import { DashboardNavigationItem, DashboardSidebarProps } from"@/types/dashboard";

export default function DashboardSidebar({ navigation, isCollapsed, onToggleCollapse, onItemClick }: DashboardSidebarProps) {
 const pathname = usePathname() ||"";
 const searchParams = useSearchParams();
 const activeView = searchParams ? searchParams.get("view") ||"" :"";

 const isItemActive = (item: DashboardNavigationItem) => {
 if (item.href.includes("?view=")) {
 const viewName = item.href.split("?view=")[1];
 return pathname === item.href.split("?")[0] && activeView === viewName;
 }
 if (item.id ==="dashboard" && pathname === item.href) {
 return activeView ==="";
 }
 return pathname === item.href;
 };

 return (
 <aside
 className={`hidden md:flex flex-col bg-primary text-white border-r border-primary-hover transition-all duration-200 ease-in-out relative shrink-0 z-20 ${
 isCollapsed ?"w-[72px]" :"w-[240px]"
 }`}
 >
 {/* Brand Header */}
 <div className="h-14 flex items-center border-b border-white/10 px-6 shrink-0">
 <a href="/" className="flex items-center gap-6 hover:opacity-85 transition-opacity select-none">
 <span className="w-5 h-5 rounded-md bg-primary-hover text-white flex items-center justify-center text-base font-black">
 H
 </span>
 {!isCollapsed && (
 <span className="font-bold text-sm tracking-tight text-white">
 HomeCare
 </span>
 )}
 </a>
 </div>

 {/* Navigation list */}
 <nav className="flex-1 py-6 px-5 space-y-1 overflow-y-auto scrollbar-none">
 {navigation.map((item) => {
 const isActive = isItemActive(item);
 const IconComponent = item.icon;

 return (
 <button
 key={item.id}
 onClick={() => onItemClick(item)}
 className={`w-full flex items-center gap-6 h-9 rounded-lg transition-colors text-sm font-semibold relative group ${
 isCollapsed ?"justify-center px-0" :"px-3"
 } ${
 isActive
 ?"bg-primary-hover text-white"
 :"text-white/70 hover:bg-white/10 hover:text-white"
 }`}
 >
 <span className={`shrink-0 transition-colors ${isActive ?"text-white" :"text-white/70 group-hover:text-white"}`}>
 <IconComponent className="w-4 h-4" />
 </span>

 {!isCollapsed && (
 <span className="truncate">{item.label}</span>
 )}
 </button>
 );
 })}
 </nav>

 {/* Sidebar toggle control */}
 <div className="p-6 border-t border-white/10 shrink-0">
 <button
 onClick={onToggleCollapse}
 className="w-full flex items-center justify-center h-8 rounded-lg border border-white/10 bg-transparent text-white/70 hover:text-white hover:bg-white/10 transition-colors"
 aria-label={isCollapsed ?"Expand Sidebar" :"Collapse Sidebar"}
 >
 {isCollapsed ? (
 <ChevronRight className="w-3.5 h-3.5" />
 ) : (
 <div className="flex items-center gap-6 text-base font-bold uppercase tracking-wider">
 <ChevronLeft className="w-3.5 h-3.5" />
 <span>Collapse</span>
 </div>
 )}
 </button>
 </div>
 </aside>
 );
}
