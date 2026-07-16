"use client";

import React from"react";
import Link from"next/link";
import { ChevronRight } from"lucide-react";
import { BreadcrumbProps } from"@/types/dashboard";

export default function Breadcrumb({ items }: BreadcrumbProps) {
 return (
 <nav className="flex items-center gap-1.5 text-base font-bold text-text-tertiary uppercase tracking-widest" aria-label="Breadcrumb">
 {items.map((item, idx) => {
 const isLast = idx === items.length - 1;
 return (
 <React.Fragment key={item.label}>
 {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-355" />}
 {isLast || !item.href ? (
 <span className="text-text-tertiary font-extrabold">{item.label}</span>
 ) : (
 <Link href={item.href} className="hover:text-accent-light transition-colors">
 {item.label}
 </Link>
 )}
 </React.Fragment>
 );
 })}
 </nav>
 );
}
