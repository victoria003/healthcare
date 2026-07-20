import React from "react";
import { Pill, Droplet, Activity, ArrowRight } from "lucide-react";

export default function RemindersWidget() {
  const reminders = [
    {
      icon: Pill,
      title: "Medicine Reminder",
      desc: "2 medicines pending",
      time: "12:00 PM",
      color: "text-[#F59E0B]",
      bg: "bg-[#FFFBEB]",
    },
    {
      icon: Droplet,
      title: "Stay Hydrated",
      desc: "Drink at least 2 litres of water today",
      time: "All Day",
      color: "text-[#3B82F6]",
      bg: "bg-[#EFF6FF]",
    },
    {
      icon: Activity,
      title: "Physiotherapy",
      desc: "Do your exercises as advised",
      time: "6:00 PM",
      color: "text-[#10B981]",
      bg: "bg-[#ECFDF5]",
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-[32px] shadow-sm border border-[#E5E7EB] flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <h2 className="text-[20px] font-bold text-[#111827] mb-10">Important Reminders</h2>

      <div className="space-y-8 flex-1">
        {reminders.map((rem, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 ${rem.bg} ${rem.color}`}>
              <rem.icon size={22} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-[#111827] leading-tight mb-1">{rem.title}</h3>
              <p className="text-[14px] font-medium text-[#6B7280]">{rem.desc}</p>
            </div>
            <span className="text-[14px] font-medium text-[#9CA3AF] text-right shrink-0">
              {rem.time}
            </span>
          </div>
        ))}
      </div>

      <button className="flex justify-center items-center gap-2 text-[#2563EB] font-bold text-[16px] hover:text-[#1D4ED8] transition-colors mt-10 w-full">
        View All Reminders <ArrowRight size={20} />
      </button>
    </div>
  );
}
