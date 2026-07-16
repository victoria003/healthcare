import React from"react";
import DashboardCard from"../dashboard/DashboardCard";

interface FormSectionProps {
 title: string;
 description?: string;
 children: React.ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
 return (
 <DashboardCard className="p-6 sm:p-8 space-y-6">
 <div className="space-y-2 border-b border-border pb-5">
 <h2 className="text-xl font-bold text-primary">{title}</h2>
 {description && (
 <p className="text-base text-text-tertiary leading-relaxed max-w-2xl">{description}</p>
 )}
 </div>
 <div className="space-y-4 pt-2">
 {children}
 </div>
 </DashboardCard>
 );
}
