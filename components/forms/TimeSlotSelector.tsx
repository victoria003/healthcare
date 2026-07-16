import React from"react";
import FormField from"./FormField";
import { TimeSlotSelectorProps } from"@/types/form";

export default function TimeSlotSelector({
 slots,
 selectedSlot,
 onSelectSlot,
 error,
 helperText,
}: TimeSlotSelectorProps & { label?: string }) {
 return (
 <FormField label="Available Time Slots" error={error} helpText={helperText}>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-1">
 {slots.map((slot) => {
 const isSelected = selectedSlot === slot;
 return (
 <button
 key={slot}
 type="button"
 onClick={() => onSelectSlot(slot)}
 className={`p-3 rounded-xl border text-sm font-bold text-center transition-all ${
 isSelected
 ?"bg-accent-light border-orange-600 text-white shadow-sm"
 :"bg-slate-55 border-border text-text-secondary hover:border-border :border-border-light"
 }`}
 >
 {slot}
 </button>
 );
 })}
 </div>
 </FormField>
 );
}
