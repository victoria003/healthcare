import React from"react";
import FormField from"./FormField";
import { SelectInputProps } from"@/types/form";

export default function SelectInput({
 options,
 placeholder,
 value,
 disabled,
 required,
 error,
 helperText,
 className ="",
 ...props
}: SelectInputProps) {
 return (
 <FormField required={required} error={error} helpText={helperText}>
 <select
 value={value}
 disabled={disabled}
 required={required}
 className={`w-full px-5 py-2.5 text-sm bg-slate-55 border rounded-xl outline-none transition-all ${
 error
 ?"border-rose-500 focus:ring-2 focus:ring-rose-500/20"
 :"border-border focus:border-accent-light focus:ring-2 focus:ring-accent/20"
 } ${className}`}
 {...props}
 >
 {placeholder && (
 <option value="" disabled>
 {placeholder}
 </option>
 )}
 {options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </FormField>
 );
}
