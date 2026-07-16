"use client";

import React from"react";
import { usePathname } from"next/navigation";
import DashboardLayout from"@/components/dashboard/DashboardLayout";
import { agencyDashboardConfig } from"@/config/dashboard/agency";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLoginPage = pathname ==="/agency/login";

 if (isLoginPage) {
 return <>{children}</>;
 }

 return (
 <DashboardLayout config={agencyDashboardConfig}>
 {children}
 </DashboardLayout>
 );
}
