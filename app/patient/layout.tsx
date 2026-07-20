"use client";

import React from"react";
import { usePathname } from"next/navigation";
import PatientLayoutEngine from "@/components/patient/layout/PatientLayoutEngine";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/patient/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <PatientLayoutEngine>
      {children}
    </PatientLayoutEngine>
  );
}
