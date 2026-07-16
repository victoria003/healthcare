"use client";

import React from"react";
import { usePathname } from"next/navigation";
import DashboardLayout from"@/components/dashboard/DashboardLayout";
import { professionalDashboardConfig } from"@/config/dashboard/professional";

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLoginPage = pathname ==="/professional/login";

 if (isLoginPage) {
 return <>{children}</>;
 }

 return (
 <DashboardLayout config={professionalDashboardConfig}>
 {children}
 </DashboardLayout>
 );
}
