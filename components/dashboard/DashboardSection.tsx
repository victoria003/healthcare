"use client";

import React from"react";
import { DashboardSectionProps } from"@/types/dashboard";

export default function DashboardSection({ children, className ="", ...props }: DashboardSectionProps) {
 return (
 <section className={`space-y-4 ${className}`} {...props}>
 {children}
 </section>
 );
}
