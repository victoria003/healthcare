"use client";

import React from"react";
import { Info, HelpCircle, FileText, Calendar, Inbox } from"lucide-react";

// ==========================================
// 1. PAGE HEADER
// ==========================================
interface PageHeaderProps {
 title: string;
 description?: string;
 action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
 return (
 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
 <div className="space-y-1">
 <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
 {title}
 </h1>
 {description && (
 <p className="text-base text-[var(--text-tertiary)] max-w-2xl leading-relaxed font-medium">
 {description}
 </p>
 )}
 </div>
 {action && <div className="shrink-0">{action}</div>}
 </div>
 );
}

// ==========================================
// 2. CLEAN CARD
// ==========================================
interface CleanCardProps extends React.HTMLAttributes<HTMLDivElement> {
 children: React.ReactNode;
}

export function CleanCard({ children, className ="", ...props }: CleanCardProps) {
 return (
 <div 
 className={`bg-white border border-[var(--border)] rounded-[var(--radius)] shadow-md p-6 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
 {...props}
 >
 {children}
 </div>
 );
}

// ==========================================
// 3. SAAS DATA TABLE
// ==========================================
interface SaaSDataTableProps<T> {
 headers: string[];
 data: T[];
 renderRow: (item: T, index: number) => React.ReactNode;
 emptyState?: React.ReactNode;
}

export function SaaSDataTable<T>({ headers, data, renderRow, emptyState }: SaaSDataTableProps<T>) {
 if (data.length === 0) {
 return <div className="py-12">{emptyState || <EmptyState title="No data available" description="There are no items to show at the moment." />}</div>;
 }

 return (
 <div className="w-full overflow-x-auto border border-[var(--border)] rounded-[var(--radius)] bg-white shadow-sm">
 <table className="w-full border-collapse text-left text-sm">
 <thead className="bg-white border-b border-[var(--border)] text-base font-bold uppercase tracking-wider text-[var(--text-tertiary)] select-none">
 <tr>
 {headers.map((header, idx) => (
 <th key={idx} className="px-6 py-4.5 font-bold">
 {header}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--border)] text-[var(--text-secondary)]">
 {data.map((item, idx) => renderRow(item, idx))}
 </tbody>
 </table>
 </div>
 );
}

// ==========================================
// 4. EMPTY STATE
// ==========================================
interface EmptyStateProps {
 title: string;
 description: string;
 icon?: React.ReactNode;
 action?: {
 label: string;
 onClick: () => void;
 };
}

export function EmptyState({ title, description, icon = <Inbox className="w-5 h-5 text-[var(--primary)]" />, action }: EmptyStateProps) {
 return (
 <div className="flex flex-col items-center justify-center text-center p-12 bg-[var(--bg-alt)]/20 border border-dashed border-[var(--border)] rounded-[var(--radius)] max-w-md mx-auto">
 <div className="w-10 h-10 bg-[var(--bg-alt)] border border-[var(--border)] rounded-lg flex items-center justify-center mb-4 text-[var(--primary)]">
 {icon}
 </div>
 <h3 className="text-base font-semibold text-[var(--text)] tracking-tight">
 {title}
 </h3>
 <p className="text-sm text-[var(--text-tertiary)] mt-1 max-w-sm leading-relaxed font-medium">
 {description}
 </p>
 {action && (
 <button
 onClick={action.onClick}
 className="mt-5 px-5 py-2 text-sm font-semibold text-[var(--bg)] bg-[var(--primary)] hover:bg-[var(--primary-light)] rounded-[var(--radius-md)] shadow-sm transition-all"
 >
 {action.label}
 </button>
 )}
 </div>
 );
}

// ==========================================
// 5. STATUS BADGE
// ==========================================
interface StatusBadgeProps {
 status: string;
 type?:"success" |"warning" |"error" |"info" |"neutral";
}

export function StatusBadge({ status, type ="neutral" }: StatusBadgeProps) {
 const styles = {
 success:"bg-[#3FAE5A]/10 text-[#3FAE5A] border-[#3FAE5A]/20",
 warning:"bg-[#F4A300]/10 text-[#F4A300] border-[#F4A300]/20",
 error:"bg-[#D64550]/10 text-[#D64550] border-[#D64550]/20",
 info:"bg-[#522959]/10 text-[#522959] border-[#522959]/20",
 neutral:"bg-[#824D69]/10 text-[#824D69] border-[#824D69]/20",
 };

 return (
 <span className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-base font-semibold tracking-wide uppercase leading-none ${styles[type]}`}>
 <span className={`w-1 h-1 rounded-full ${
 type ==="success" ?"bg-[#3FAE5A]" :
 type ==="warning" ?"bg-[#F4A300]" :
 type ==="error" ?"bg-[#D64550]" :
 type ==="info" ?"bg-[#522959]" :"bg-[#824D69]"
 }`} />
 {status}
 </span>
 );
}

// ==========================================
// 6. TABS
// ==========================================
interface TabsProps {
 tabs: { id: string; label: string }[];
 activeTab: string;
 onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
 return (
 <div className="flex border-b border-[var(--border)] select-none overflow-x-auto scrollbar-none mb-6">
 <div className="flex gap-6">
 {tabs.map((tab) => {
 const isActive = tab.id === activeTab;
 return (
 <button
 key={tab.id}
 onClick={() => onChange(tab.id)}
 className={`py-4 text-sm font-semibold relative whitespace-nowrap transition-colors ${
 isActive 
 ?"text-[var(--text)]" 
 :"text-[var(--text-tertiary)] hover:text-[var(--text)]"
 }`}
 >
 {tab.label}
 {isActive && (
 <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full" />
 )}
 </button>
 );
 })}
 </div>
 </div>
 );
}

// ==========================================
// 8. STATS CARD (RESTORED LEGACY COMPONENT)
// ==========================================
interface StatsCardProps {
 title: string;
 value: string | number;
 trend?: number;
 trendLabel?: string;
 icon: React.ReactNode;
 sparklineData?: number[];
 color?:"teal" |"blue" |"indigo" |"rose" |"amber";
 isLoading?: boolean;
}

export function StatsCard({
 title,
 value,
 trend,
 trendLabel ="vs last week",
 icon,
 sparklineData = [10, 15, 8, 22, 14, 25, 18, 30],
 color ="teal",
 isLoading = false,
}: StatsCardProps) {
 if (isLoading) {
 return <StatsCardSkeleton />;
 }

 const isPositive = trend === undefined ? true : trend >= 0;

 const minVal = Math.min(...sparklineData);
 const maxVal = Math.max(...sparklineData);
 const range = maxVal - minVal || 1;
 const width = 100;
 const height = 30;
 const points = sparklineData
 .map((val, idx) => {
 const x = (idx / (sparklineData.length - 1)) * width;
 const y = height - ((val - minVal) / range) * height;
 return`${x},${y}`;
 })
 .join("");

 return (
 <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius)] shadow-md transition-all flex flex-col justify-between h-full hover:-translate-y-0.5">
 <div className="flex justify-between items-start">
 <span className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
 {title}
 </span>
 <div className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)]/30 text-[var(--primary)]">{icon}</div>
 </div>

 <div className="mt-4 flex items-baseline justify-between">
 <div>
 <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--text)] leading-none">
 {value}
 </h3>
 {trend !== undefined && (
 <div className="flex items-center gap-1.5 mt-2.5">
 <span
 className={`text-sm font-extrabold px-3 py-2.5 rounded-full ${
 isPositive
 ?"bg-[#3FAE5A]/10 text-[#3FAE5A]"
 :"bg-[#D64550]/10 text-[#D64550]"
 }`}
 >
 {isPositive ?"+" :""}
 {trend}%
 </span>
 <span className="text-base font-medium text-[var(--text-tertiary)]">
 {trendLabel}
 </span>
 </div>
 )}
 </div>

 <div className="w-24 h-10 self-end opacity-85 hover:opacity-100 transition-opacity">
 <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
 <polyline
 fill="none"
 stroke="#522959"
 strokeWidth="2.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 points={points}
 />
 </svg>
 </div>
 </div>
 </div>
 );
}

// ==========================================
// 9. SKELETON LOADERS
// ==========================================
export function StatsCardSkeleton() {
 return (
 <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius)] space-y-4 animate-pulse">
 <div className="flex justify-between">
 <div className="h-3.5 bg-[var(--bg-alt)] w-1/3 rounded" />
 <div className="w-6 h-6 bg-[var(--bg-alt)] rounded-md" />
 </div>
 <div className="h-6 bg-[var(--bg-alt)] w-1/2 rounded" />
 </div>
 );
}

export function TableSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
 return (
 <div className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden shadow-sm animate-pulse">
 <div className="h-10 bg-[var(--bg-alt)]/65 border-b border-[var(--border)] flex items-center px-6 gap-6">
 {Array.from({ length: cols }).map((_, i) => (
 <div key={i} className="h-3 bg-[var(--border)] w-1/4 rounded" />
 ))}
 </div>
 <div className="p-6 space-y-4">
 {Array.from({ length: rows }).map((_, r) => (
 <div key={r} className="flex gap-6">
 {Array.from({ length: cols }).map((_, c) => (
 <div key={c} className="h-3.5 bg-[var(--bg-alt)]/30 w-1/4 rounded" />
 ))}
 </div>
 ))}
 </div>
 </div>
 );
}

export function CardSkeleton() {
 return (
 <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius)] p-6 space-y-4 shadow-sm animate-pulse">
 <div className="flex justify-between items-center">
 <div className="h-4 bg-[var(--bg-alt)] rounded w-1/3" />
 <div className="h-5 bg-[var(--bg-alt)] rounded-full w-14" />
 </div>
 <div className="h-3 bg-[var(--bg-alt)]/50 rounded w-5/6" />
 <div className="h-3 bg-[var(--bg-alt)]/50 rounded w-full" />
 </div>
 );
}

export function DashboardSkeleton() {
 return (
 <div className="space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {Array.from({ length: 4 }).map((_, i) => (
 <StatsCardSkeleton key={i} />
 ))}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-4">
 <div className="h-6 bg-[var(--bg-alt)] rounded w-1/4 animate-pulse" />
 <TableSkeleton rows={4} cols={4} />
 </div>
 <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius)] space-y-4 animate-pulse">
 <div className="h-5 bg-[var(--bg-alt)] rounded w-1/2" />
 <div className="h-32 bg-[var(--bg-alt)]/50 rounded" />
 <div className="space-y-2">
 <div className="h-4 bg-[var(--bg-alt)]/50 rounded w-full" />
 <div className="h-4 bg-[var(--bg-alt)]/50 rounded w-5/6" />
 </div>
 </div>
 </div>
 </div>
 );
}
