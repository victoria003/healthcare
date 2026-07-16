"use client";

import React from"react";
import { motion } from"framer-motion";
import { DashboardCardProps } from"@/types/dashboard";

export default function DashboardCard({ children, className ="", ...props }: DashboardCardProps) {
 return (
 <motion.div
 whileHover={{ y: -2 }}
 transition={{ duration: 0.2, ease:"easeOut" }}
 className={`bg-white border border-border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
 {...props}
 >
 {children}
 </motion.div>
 );
}
