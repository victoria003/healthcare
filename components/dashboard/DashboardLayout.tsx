"use client";

import React, { useState, useEffect } from"react";
import { useRouter, usePathname, useSearchParams } from"next/navigation";
import DashboardHeader from"./DashboardHeader";
import DashboardSidebar from"./DashboardSidebar";
import DashboardMobileNavigation from"./DashboardMobileNavigation";
import { DashboardConfiguration, DashboardNavigationItem } from"@/types/dashboard";

interface LayoutProps {
 children: React.ReactNode;
 config: DashboardConfiguration;
}

export default function DashboardLayout({ children, config }: LayoutProps) {
 const router = useRouter();
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

 // Persistence of sidebar state
 useEffect(() => {
 const saved = localStorage.getItem("hc_sidebar_collapsed");
 if (saved !== null) {
 setSidebarCollapsed(saved ==="true");
 }
 }, []);

 const handleToggleCollapse = () => {
 const nextState = !sidebarCollapsed;
 setSidebarCollapsed(nextState);
 localStorage.setItem("hc_sidebar_collapsed", String(nextState));
 };

 useEffect(() => {
 fetch("/api/auth/me")
 .then((res) => res.json())
 .then((data) => {
 if (data.success && data.user) {
 setUser(data.user);
 } else {
 setUser({
 fullName:`Demo ${config.role}`,
 email:`${config.role.toLowerCase()}@homecare.in`,
 });
 }
 })
 .catch(() => {
 setUser({
 fullName:`Demo ${config.role}`,
 email:`${config.role.toLowerCase()}@homecare.in`,
 });
 });
 }, [config.role]);

 const handleLogout = async () => {
 try {
 await fetch("/api/auth/me"); // Simple call before clearing
 await fetch("/api/auth/logout", { method:"POST" });
 } catch (err) {
 console.error("Error during logout call:", err);
 }
 router.push("/login");
 };

 const handleItemClick = (item: DashboardNavigationItem) => {
 if (item.id ==="logout") {
 handleLogout();
 } else {
 router.push(item.href);
 }
 };

 const handleMobileNavChange = (tabId: string) => {
 if (tabId ==="more") {
 const supportItem = config.navigation.find((item) => item.id ==="support");
 router.push(supportItem ? supportItem.href :`${config.defaultRoute}?view=support`);
 return;
 }
 
 if (tabId ==="profile") {
 const profileItem = config.navigation.find((item) => item.id ==="profile");
 router.push(profileItem ? profileItem.href :`${config.defaultRoute}?view=profile`);
 return;
 }

 const matched = config.navigation.find((item) => item.id === tabId);
 if (matched) {
 router.push(matched.href);
 } else {
 router.push(config.defaultRoute);
 }
 };

 const pathname = usePathname() ||"";
 const searchParams = useSearchParams();
 const activeView = searchParams ? searchParams.get("view") ||"" :"";

 const getActiveMobileTab = () => {
 if (pathname.includes("/explore")) return"explore";
 if (pathname.includes("/bookings")) return"bookings";
 if (activeView ==="profile") return"profile";
 if (pathname.includes("/dashboard") && activeView ==="") return"dashboard";
 return"more";
 };

 return (
 <div className="min-h-screen bg-[#fafafa] [#07070d] text-primary flex font-sans antialiased">
 {/* 1. Left Collapsible Sidebar */}
 <DashboardSidebar
 navigation={config.navigation}
 isCollapsed={sidebarCollapsed}
 onToggleCollapse={handleToggleCollapse}
 onItemClick={handleItemClick}
 />

 {/* 2. Right Layout Area */}
 <div className="flex-1 flex flex-col min-w-0">
 {/* Top Navbar */}
 <DashboardHeader
 userName={user?.fullName ||"Loading..."}
 userEmail={user?.email ||""}
 onLogout={handleLogout}
 onNavigateToTab={(tab) => router.push(`${config.defaultRoute}?view=${tab}`)}
 />

 {/* Main Content: Max-widthCentered */}
 <main className="flex-1 overflow-y-auto px-6 py-10 pb-24 md:pb-10 flex flex-col items-center">
 <div className="max-w-[960px] w-full space-y-8">
 {children}
 </div>
 </main>
 </div>

 {/* 3. Mobile Navigation */}
 <DashboardMobileNavigation
 activeTab={getActiveMobileTab()}
 onTabChange={handleMobileNavChange}
 />
 </div>
 );
}
