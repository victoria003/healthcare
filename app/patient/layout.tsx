"use client";

import React from"react";
import { usePathname } from"next/navigation";
import DashboardLayout from"@/components/dashboard/DashboardLayout";
import { patientDashboardConfig } from"@/config/dashboard/patient";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname();
 const isLoginPage = pathname ==="/patient/login";

 if (isLoginPage) {
 return <>{children}</>;
 }

 return (
 <DashboardLayout config={patientDashboardConfig}>
 {children}
 </DashboardLayout>
 );
}
