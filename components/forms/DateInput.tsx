import React from"react";
import FormField from"./FormField";
import { DateInputProps } from"@/types/form";

export default function DateInput({
 label,
 value,
 onChange,
 disabled,
 required,
 error,
 helperText,
 className ="",
 ...props
}: DateInputProps) {
 return (
 <FormField label={label} required={required} error={error} helpText={helperText}>
 <input
 type="date"
 value={value}
 onChange={onChange}
 disabled={disabled}
 required={required}
 className={`w-full px-5 py-2.5 text-sm bg-slate-55 border rounded-xl outline-none transition-all ${
 error
 ?"border-rose-500 focus:ring-2 focus:ring-rose-500/20"
 :"border-border focus:border-accent-light focus:ring-2 focus:ring-accent/20"
 } ${className}`}
 {...props}
 />
 </FormField>
 );
}
