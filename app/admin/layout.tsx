"use client";

import React from"react";
import { usePathname } from"next/navigation";
import DashboardLayout from"@/components/dashboard/DashboardLayout";
import { adminDashboardConfig } from"@/config/dashboard/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLoginPage = pathname ==="/admin/login";

 if (isLoginPage) {
 return <>{children}</>;
 }

 return (
 <DashboardLayout config={adminDashboardConfig}>
 {children}
 </DashboardLayout>
 );
}
