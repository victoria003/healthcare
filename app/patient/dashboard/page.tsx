"use client";

import React, { useState, useEffect } from "react";
import WelcomeHeader from "@/components/patient/new-dashboard/WelcomeHeader";
import HeroVisitCard from "@/components/patient/new-dashboard/HeroVisitCard";
import CarePlanWidget from "@/components/patient/new-dashboard/CarePlanWidget";
import NextApptWidget from "@/components/patient/new-dashboard/NextApptWidget";
import ActionStrip from "@/components/patient/new-dashboard/ActionStrip";
import UpcomingWidget from "@/components/patient/new-dashboard/UpcomingWidget";
import ActivityTimeline from "@/components/patient/new-dashboard/ActivityTimeline";
import RemindersWidget from "@/components/patient/new-dashboard/RemindersWidget";
import SupportBanner from "@/components/patient/new-dashboard/SupportBanner";

export default function PatientDashboardPage() {
  const [user, setUser] = useState<{ fullName: string; id: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser({ fullName: "Victoria Rani", id: "u-1", email: "patient@homecare.in" });
        }
      })
      .catch(() => {
        setUser({ fullName: "Victoria Rani", id: "u-1", email: "patient@homecare.in" });
      });
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || "Victoria";

  return (
    <div className="w-full flex flex-col gap-[32px]">
      <WelcomeHeader patientName={firstName} />

      {/* Row 1: Grid ratio 2fr 1fr 1fr, Gap 24px */}
      <div 
        className="grid gap-[24px] items-stretch" 
        style={{ gridTemplateColumns: '2fr 1fr 1fr' }}
      >
        <HeroVisitCard />
        <CarePlanWidget />
        <NextApptWidget />
      </div>

      {/* Row 2: Action Strip */}
      <ActionStrip />

      {/* Row 3: 3 equal-width cards, 24px gap */}
      <div 
        className="grid gap-[24px] items-stretch" 
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        <UpcomingWidget />
        <ActivityTimeline />
        <RemindersWidget />
      </div>

      {/* Row 4: Support Section */}
      <SupportBanner />
    </div>
  );
}
