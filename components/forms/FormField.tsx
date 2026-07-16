import React from"react";
import { FormFieldProps } from"@/types/form";

export default function FormField({ label, required, error, helpText, children }: FormFieldProps) {
 return (
 <div className="flex flex-col gap-1.5 w-full">
 {label && (
 <label className="text-base uppercase tracking-wider font-extrabold text-text-tertiary flex items-center gap-1 select-none">
 {label}
 {required && <span className="text-rose-600 font-extrabold" title="Required">*</span>}
 </label>
 )}
 <div className="relative">
 {children}
 </div>
 {error ? (
 <p className="text-base font-bold text-rose-600 tracking-wide mt-0.5">{error}</p>
 ) : (
 helpText && (
 <p className="text-base text-text-tertiary font-medium leading-normal mt-0.5">{helpText}</p>
 )
 )}
 </div>
 );
}
