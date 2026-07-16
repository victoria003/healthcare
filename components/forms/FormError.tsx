"use client";

import React from"react";
import { AlertCircle } from"lucide-react";

interface FormErrorProps {
 message?: string;
 className?: string;
}

export default function FormError({ message, className ="" }: FormErrorProps) {
 if (!message) return null;

 return (
 <div
 role="alert"
 className={`flex items-center gap-6 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-bold ${className}`}
 >
 <AlertCircle className="w-4 h-4 shrink-0" />
 <span>{message}</span>
 </div>
 );
}
