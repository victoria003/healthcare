"use client";

import React from"react";
import { Search } from"lucide-react";
import { SearchInputProps } from"@/types/dashboard";

export default function SearchInput({ placeholder ="Search for services, bookings...", className ="", onChange, value }: SearchInputProps) {
 return (
 <div className={`relative ${className}`}>
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
 <input
 type="text"
 placeholder={placeholder}
 value={value}
 onChange={onChange}
 className="pl-9 pr-4 py-2 text-sm bg-[var(--bg-alt)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-tertiary)] outline-none w-full transition-all focus:border-[var(--primary)]"
 />
 </div>
 );
}
