import React from "react";
import { Phone, MessageSquare, ArrowRight } from "lucide-react";

export default function UpcomingWidget() {
  const appointments = [
    {
      date: "Today",
      time: "10:30 AM",
      title: "Home Nursing Visit",
      provider: "Nurse Sarah Williams",
      status: "Confirmed",
      statusColor: "text-[#10B981] bg-[#ECFDF5]",
      dateColor: "text-[#10B981]",
    },
    {
      date: "Tomorrow",
      time: "2:00 PM",
      title: "Physiotherapy Session",
      provider: "John Mathew",
      status: "Upcoming",
      statusColor: "text-[#2563EB] bg-[#EFF6FF]",
      dateColor: "text-[#7C3AED]",
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-[32px] shadow-sm border border-[#E5E7EB] flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[20px] font-bold text-[#111827]">Upcoming Appointment</h2>
        <button className="text-[16px] font-bold text-[#2563EB] hover:text-[#1D4ED8]">View All</button>
      </div>

      <div className="space-y-8 flex-1">
        {appointments.map((apt, idx) => (
          <div key={idx} className="flex gap-6 items-start">
            <div className="w-[80px] shrink-0 flex flex-col pt-1">
              <span className={`text-[16px] font-bold ${apt.dateColor}`}>{apt.date}</span>
              <span className={`text-[16px] font-bold ${apt.dateColor}`}>{apt.time}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-[#111827] leading-tight mb-2">{apt.title}</h3>
              <p className="text-[16px] font-medium text-[#6B7280] mb-3">{apt.provider}</p>
              <div className={`inline-flex px-3 py-1 rounded-[6px] text-[12px] font-bold ${apt.statusColor}`}>
                {apt.status}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button className="w-[44px] h-[44px] rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#2563EB] hover:bg-[#F9FAFB] transition-colors">
                <Phone size={20} strokeWidth={2} />
              </button>
              <button className="w-[44px] h-[44px] rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#2563EB] hover:bg-[#F9FAFB] transition-colors">
                <MessageSquare size={20} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 text-[#2563EB] font-bold text-[16px] hover:text-[#1D4ED8] transition-colors mt-10 w-max">
        View All Appointments <ArrowRight size={20} />
      </button>
    </div>
  );
}
