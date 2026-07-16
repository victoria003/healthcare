import React from"react";
import FormField from"./FormField";
import { TextAreaInputProps } from"@/types/form";

export default function TextAreaInput({
 label,
 rows = 4,
 placeholder,
 value,
 disabled,
 required,
 error,
 helperText,
 className ="",
 ...props
}: TextAreaInputProps & { label?: string; disabled?: boolean; required?: boolean }) {
 return (
 <FormField label={label} required={required} error={error} helpText={helperText}>
 <textarea
 rows={rows}
 placeholder={placeholder}
 value={value}
 disabled={disabled}
 required={required}
 className={`w-full px-5 py-2.5 text-sm bg-slate-55 border rounded-xl outline-none transition-all resize-y ${
 error
 ?"border-rose-500 focus:ring-2 focus:ring-rose-500/20"
 :"border-border focus:border-accent-light focus:ring-2 focus:ring-accent/20"
 } ${className}`}
 {...props}
 />
 </FormField>
 );
}
