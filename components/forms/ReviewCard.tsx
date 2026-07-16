import React from"react";
import DashboardCard from"../dashboard/DashboardCard";
import { ReviewCardProps } from"@/types/form";

export default function ReviewCard({ title, items }: ReviewCardProps) {
 return (
 <DashboardCard className="p-8 space-y-4">
 <h3 className="font-extrabold text-sm text-primary border-b border-border-light pb-2">
 {title}
 </h3>
 <div className="space-y-2 text-sm">
 {items.map((item) => (
 <div key={item.label} className="flex justify-between py-2.5">
 <span className="font-bold text-text-tertiary">{item.label}</span>
 <span className="font-bold text-primary">{item.value}</span>
 </div>
 ))}
 </div>
 </DashboardCard>
 );
}
