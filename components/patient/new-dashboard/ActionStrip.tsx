import React from "react";
import { UserPlus, Stethoscope, Heart, Activity, Calendar, Upload, AlertCircle } from "lucide-react";

export default function ActionStrip() {
  const actions = [
    { label: "Book Nurse", icon: UserPlus, color: "text-[#2563EB]", bg: "bg-[#EFF6FF]" },
    { label: "Book Doctor", icon: Stethoscope, color: "text-[#10B981]", bg: "bg-[#ECFDF5]" },
    { label: "Book Caregiver", icon: Heart, color: "text-[#8B5CF6]", bg: "bg-[#F5F3FF]" },
    { label: "Book Physiotherapist", icon: Activity, color: "text-[#F59E0B]", bg: "bg-[#FFFBEB]" },
    { label: "View My Bookings", icon: Calendar, color: "text-[#3B82F6]", bg: "bg-[#EFF6FF]" },
    { label: "Upload Record", icon: Upload, color: "text-[#14B8A6]", bg: "bg-[#F0FDFA]" },
    { label: "Emergency SOS", icon: AlertCircle, color: "text-[#EF4444]", bg: "bg-[#FEF2F2]" },
  ];

  return (
    <div className="bg-white rounded-[24px] p-[32px] shadow-sm border border-[#E5E7EB]">
      <h2 className="text-[20px] font-bold text-[#111827] mb-8">Quick Actions</h2>
      <div className="flex items-center justify-between gap-4">
        {actions.map((act, idx) => (
          <button
            key={idx}
            className="flex items-center gap-4 hover:bg-[#F9FAFB] rounded-[16px] px-3 py-2 border border-transparent transition-all group shrink-0"
          >
            <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${act.bg} ${act.color} shrink-0`}>
              <act.icon size={24} strokeWidth={2} />
            </div>
            <span className="font-semibold text-[16px] text-[#111827] whitespace-nowrap">{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
