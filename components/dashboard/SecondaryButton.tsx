"use client";

import React from"react";
import { SecondaryButtonProps } from"@/types/dashboard";

export default function SecondaryButton({ children, className ="", ...props }: SecondaryButtonProps) {
 return (
 <button
 className={`px-5 py-2.5 bg-white border border-text-tertiary hover:bg-accent-light/20 active:scale-95 text-secondary font-semibold text-sm tracking-wide rounded-xl transition-all shadow-sm ${className}`}
 {...props}
 >
 {children}
 </button>
 );
}
