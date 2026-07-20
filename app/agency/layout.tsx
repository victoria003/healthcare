"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AgencyLayout from "@/components/agency/AgencyLayout";

export default function AppAgencyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/agency/login" || pathname === "/agency/register" || pathname === "/agency/forgot-password";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AgencyLayout>
      {children}
    </AgencyLayout>
  );
}
