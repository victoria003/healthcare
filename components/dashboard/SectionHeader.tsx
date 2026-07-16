"use client";

import React from"react";

interface SectionHeaderProps {
 title: string;
 description?: string;
 actionButton?: React.ReactNode;
 className?: string;
}

export default function SectionHeader({ title, description, actionButton, className ="" }: SectionHeaderProps) {
 return (
 <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-border pb-4 ${className}`}>
 <div>
 <h3 className="text-2xl font-bold text-primary tracking-tight">
 {title}
 </h3>
 {description && (
 <p className="text-base text-text-tertiary mt-2 leading-relaxed max-w-2xl">
 {description}
 </p>
 )}
 </div>
 {actionButton && <div className="flex items-center gap-6 shrink-0">{actionButton}</div>}
 </div>
 );
}
