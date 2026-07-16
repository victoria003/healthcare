import React from"react";
import { motion } from"framer-motion";

interface PageLayoutProps {
 title: string;
 description?: string;
 actionButton?: React.ReactNode;
 children: React.ReactNode;
 secondaryInformation?: React.ReactNode;
 supportingInformation?: React.ReactNode;
}

export default function PageLayout({
 title,
 description,
 actionButton,
 children,
 secondaryInformation,
 supportingInformation,
}: PageLayoutProps) {
 return (
 <div className="w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
 {/* 1. Header Section */}
 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border">
 <div className="max-w-2xl">
 <h1 className="text-3xl font-bold text-primary tracking-tight">
 {title}
 </h1>
 {description && (
 <p className="mt-3 text-base text-text-tertiary leading-relaxed">
 {description}
 </p>
 )}
 </div>
 {actionButton && (
 <div className="flex items-center gap-3 shrink-0">{actionButton}</div>
 )}
 </div>

 {/* 2. Main Content Section */}
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 className="w-full"
 >
 {children}
 </motion.div>

 {/* 3. Secondary Information */}
 {secondaryInformation && (
 <div className="pt-8 border-t border-border">
 {secondaryInformation}
 </div>
 )}

 {/* 4. Supporting Information */}
 {supportingInformation && (
 <div className="pt-8 mt-8 border-t border-border opacity-80">
 {supportingInformation}
 </div>
 )}
 </div>
 );
}
