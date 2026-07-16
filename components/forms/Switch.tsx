"use client";

import React from"react";

interface SwitchProps {
 id: string;
 label: string;
 checked: boolean;
 onChange: (value: boolean) => void;
 disabled?: boolean;
}

export default function Switch({
 id,
 label,
 checked,
 onChange,
 disabled = false,
}: SwitchProps) {
 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (disabled) return;
 if (e.key ==="" || e.key ==="Enter") {
 e.preventDefault();
 onChange(!checked);
 }
 };

 return (
 <div className="flex items-center justify-between py-2 gap-6 select-none">
 <label
 htmlFor={id}
 className={`text-sm font-bold transition-colors ${
 disabled
 ?"text-text-tertiary"
 :"text-text-secondary"
 }`}
 >
 {label}
 </label>
 <button
 id={id}
 type="button"
 role="switch"
 aria-checked={checked}
 disabled={disabled}
 onClick={() => onChange(!checked)}
 onKeyDown={handleKeyDown}
 className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0 cursor-pointer ${
 checked ?"bg-accent-light" :"bg-slate-200"
 } ${disabled ?"opacity-50 cursor-not-allowed" :""}`}
 >
 <span
 className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
 checked ?"translate-x-5" :"translate-x-0"
 }`}
 />
 </button>
 </div>
 );
}
