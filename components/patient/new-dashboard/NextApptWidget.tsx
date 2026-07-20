import React from "react";
import { CalendarPlus, ArrowRight } from "lucide-react";

export default function NextApptWidget() {
  return (
    <div className="bg-white rounded-[24px] p-[32px] shadow-sm border border-[#E5E7EB] flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#D1FAE5] p-3 rounded-[12px] text-[#059669]">
          <CalendarPlus size={24} strokeWidth={2} />
        </div>
        <span className="font-bold text-[#111827] text-[18px]">Next Appointment</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[20px] font-bold text-[#111827] mb-2">Tomorrow, 2:00 PM</h3>
        <p className="text-[#111827] font-semibold text-[18px] mb-2">Physiotherapy Session</p>
        <p className="text-[#6B7280] text-[18px]">John Mathew</p>
      </div>

      <button className="flex items-center gap-2 text-[#2563EB] font-bold text-[16px] hover:text-[#1D4ED8] transition-colors mt-auto w-max">
        View All Appointments <ArrowRight size={20} />
      </button>
    </div>
  );
}
