import React from "react";
import { Headphones, PhoneCall, MessageSquareText, Mail, AlertTriangle } from "lucide-react";

export default function SupportBanner() {
  return (
    <div className="bg-[#FFF1F2] rounded-[24px] p-[32px] shadow-sm border border-[#FFE4E6] flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="bg-[#EF4444] text-white w-[56px] h-[56px] rounded-full flex items-center justify-center shrink-0 shadow-md">
          <Headphones size={28} />
        </div>
        <div>
          <h2 className="text-[20px] font-bold text-[#111827] mb-1">Need Help?</h2>
          <p className="text-[16px] font-medium text-[#4B5563]">Our support team is here for you 24/7</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 h-[48px] px-6 rounded-[12px] bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] font-semibold text-[16px] transition-colors">
          <PhoneCall size={20} strokeWidth={2} />
          Call Support
        </button>
        <button className="flex items-center gap-2 h-[48px] px-6 rounded-[12px] bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] font-semibold text-[16px] transition-colors">
          <MessageSquareText size={20} strokeWidth={2} />
          Live Chat
        </button>
        <button className="flex items-center gap-2 h-[48px] px-6 rounded-[12px] bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] font-semibold text-[16px] transition-colors">
          <Mail size={20} strokeWidth={2} />
          Email Us
        </button>
        <button className="flex items-center gap-2 h-[48px] px-6 rounded-[12px] bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white font-semibold text-[16px] transition-colors ml-2">
          <AlertTriangle size={20} strokeWidth={2} />
          Emergency SOS
        </button>
      </div>
    </div>
  );
}
