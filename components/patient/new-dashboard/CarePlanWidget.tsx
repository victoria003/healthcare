import React from "react";
import { ClipboardList, ArrowRight } from "lucide-react";

export default function CarePlanWidget() {
  return (
    <div className="bg-white rounded-[24px] p-[32px] shadow-sm border border-[#E5E7EB] flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-[#F3E8FF] p-3 rounded-[12px] text-[#7C3AED]">
          <ClipboardList size={24} strokeWidth={2} />
        </div>
        <span className="font-bold text-[#111827] text-[18px]">Care Plan Progress</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[20px] font-bold text-[#111827] mb-2">Post Surgery Recovery</h3>
        <p className="text-[#6B7280] text-[18px] mb-8">Day 12 of 45</p>

        <div className="space-y-3 mb-8">
          <div className="w-full bg-[#F3F4F6] rounded-full h-[10px] overflow-hidden">
            <div className="bg-[#7C3AED] h-[10px] rounded-full" style={{ width: '26%' }}></div>
          </div>
          <div className="text-right text-[16px] font-bold text-[#4B5563]">
            26%
          </div>
        </div>
      </div>

      <button className="flex items-center gap-2 text-[#2563EB] font-bold text-[16px] hover:text-[#1D4ED8] transition-colors mt-auto w-max">
        View Care Plan <ArrowRight size={20} />
      </button>
    </div>
  );
}
