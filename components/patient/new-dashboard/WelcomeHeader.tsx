import React from "react";

interface WelcomeHeaderProps {
  patientName: string;
}

export default function WelcomeHeader({ patientName }: WelcomeHeaderProps) {
  return (
    <div className="mb-[32px]">
      <h1 className="text-[52px] font-bold text-[#111827] leading-tight mb-2">
        Good Morning, {patientName}! <span className="inline-block">👋</span>
      </h1>
      <p className="text-[18px] text-[#6B7280]">
        Here's what's happening with your care today.
      </p>
    </div>
  );
}
