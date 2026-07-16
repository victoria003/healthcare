"use client";

import React from"react";
import { ShieldAlert } from"lucide-react";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { useRouter } from"next/navigation";

export default function UnauthorizedPage() {
 const router = useRouter();

 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-bg-alt [#0b0b0f] px-6 text-center">
 <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-6 border border-rose-100">
 <ShieldAlert className="w-8 h-8" />
 </div>

 <h1 className="text-3xl font-black text-primary tracking-tight">
 Access Denied
 </h1>
 <p className="text-base text-text-tertiary mt-3 max-w-md leading-relaxed">
 Your account credentials do not possess the required roles or authorization permissions to view this secure portal partition.
 </p>

 <div className="flex flex-col sm:flex-row gap-6 mt-8 select-none">
 <PrimaryButton onClick={() => router.push("/login")} className="px-6 py-2.5 text-sm font-semibold">
 Return to Login
 </PrimaryButton>
 <SecondaryButton onClick={() => router.push("/")} className="px-6 py-2.5 text-sm font-semibold">
 Back to Homepage
 </SecondaryButton>
 </div>
 </div>
 );
}
