import React from "react";
import { UserCheck, FileText, FileSpreadsheet, ClipboardList, ArrowRight } from "lucide-react";

export default function ActivityTimeline() {
  const activities = [
    {
      icon: UserCheck,
      title: "Nurse Visit Completed",
      desc: "Nurse Sarah Williams",
      time: "Yesterday, 10:45 AM",
      color: "text-[#10B981]",
      bg: "bg-[#ECFDF5] border-[#D1FAE5]",
    },
    {
      icon: FileText,
      title: "Prescription Uploaded",
      desc: "Dr. Amit Verma",
      time: "Yesterday, 10:30 AM",
      color: "text-[#14B8A6]",
      bg: "bg-[#F0FDFA] border-[#CCFBF1]",
    },
    {
      icon: FileSpreadsheet,
      title: "Invoice Generated",
      desc: "Payment of ₹1,250",
      time: "Yesterday, 10:15 AM",
      color: "text-[#F59E0B]",
      bg: "bg-[#FFFBEB] border-[#FEF3C7]",
    },
    {
      icon: ClipboardList,
      title: "Care Plan Updated",
      desc: "Post Surgery Recovery",
      time: "16 Jul, 08:20 PM",
      color: "text-[#8B5CF6]",
      bg: "bg-[#F5F3FF] border-[#EDE9FE]",
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-[32px] shadow-sm border border-[#E5E7EB] flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <h2 className="text-[20px] font-bold text-[#111827] mb-10">Recent Activity</h2>

      <div className="space-y-8 flex-1">
        {activities.map((act, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 border ${act.bg} ${act.color}`}>
              <act.icon size={22} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-[#111827] leading-tight mb-1">{act.title}</h3>
              <p className="text-[14px] font-medium text-[#6B7280]">{act.desc}</p>
            </div>
            <span className="text-[14px] font-medium text-[#9CA3AF] text-right shrink-0">
              {act.time}
            </span>
          </div>
        ))}
      </div>

      <button className="flex justify-center items-center gap-2 text-[#2563EB] font-bold text-[16px] hover:text-[#1D4ED8] transition-colors mt-10 w-full">
        View All Activity <ArrowRight size={20} />
      </button>
    </div>
  );
}
