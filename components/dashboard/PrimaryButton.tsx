"use client";

import React from"react";
import { PrimaryButtonProps } from"@/types/dashboard";

export default function PrimaryButton({ children, className ="", ...props }: PrimaryButtonProps) {
 return (
 <button
 className={`px-5 py-2.5 bg-primary hover:bg-primary-hover active:scale-95 text-white font-semibold text-sm tracking-wide rounded-xl transition-all shadow-sm ${className}`}
 {...props}
 >
 {children}
 </button>
 );
}
