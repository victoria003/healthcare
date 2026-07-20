import React from "react";
import { Calendar, Navigation } from "lucide-react";

export default function HeroVisitCard() {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4A7AFF] to-[#2563EB] text-white p-[32px] flex flex-col justify-between h-full shadow-sm">
      <div className="absolute inset-0 opacity-[0.05] bg-center bg-cover" style={{ backgroundImage: "url('/images/hero-bg.png')" }} />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white/20 p-2.5 rounded-[12px] backdrop-blur-sm">
            <Calendar size={20} className="text-white" />
          </div>
          <span className="font-semibold text-[18px] text-white">Today's Visit</span>
        </div>

        {/* Content Section */}
        <div className="flex items-center gap-8 mb-10 flex-1">
          <img 
            src="https://i.pravatar.cc/150?img=9" 
            alt="Nurse Sarah" 
            className="w-[120px] h-[120px] rounded-full border-[6px] border-white/20 object-cover shadow-lg shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-[40px] font-bold mb-2 leading-none">10:30 AM</h2>
            <h3 className="text-[20px] font-semibold text-blue-50 mb-1">Home Nursing Visit</h3>
            <p className="text-[18px] text-blue-200 mb-4">Nurse Sarah Williams</p>
            <div className="inline-flex px-3 py-1 rounded-[6px] bg-[#10B981] text-white text-[14px] font-bold tracking-wide w-max">
              Confirmed
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-auto">
          <button className="h-[48px] px-8 bg-white text-[#2563EB] hover:bg-blue-50 rounded-[12px] font-bold text-[16px] transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
            <Navigation size={18} />
            Track Live
          </button>
          <button className="h-[48px] px-8 bg-transparent hover:bg-white/10 border border-white/40 text-white rounded-[12px] font-bold text-[16px] transition-colors shrink-0">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
