"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SearchInput from "@/components/dashboard/SearchInput";
import NotificationMenu from "@/components/dashboard/NotificationMenu";
import UserMenu from "@/components/dashboard/UserMenu";
import { Heart, MessageSquare } from "lucide-react";

interface PatientLayoutEngineProps {
  children: React.ReactNode;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/patient/dashboard" },
  { id: "explore", label: "Explore Care", href: "/patient/explore" },
  { id: "bookings", label: "My Bookings", href: "/patient/bookings" },
  { id: "care-team", label: "Care Team", href: "/patient/care-team" },
  { id: "medical-records", label: "Medical Records", href: "/patient/medical-records" },
  { id: "prescriptions", label: "Prescriptions", href: "/patient/prescriptions" },
  { id: "payments", label: "Payments", href: "/patient/payments" },
  { id: "messages", label: "Messages", href: "/patient/dashboard?view=messages" },
  { id: "profile", label: "Profile", href: "/patient/dashboard?view=profile" },
];

export default function PatientLayoutEngine({ children }: PatientLayoutEngineProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser({ fullName: "Victoria Rani", email: "patient@homecare.in" });
        }
      })
      .catch(() => {
        setUser({ fullName: "Victoria Rani", email: "patient@homecare.in" });
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    router.push("/login");
  };

  const isNavItemActive = (href: string) => {
    if (href === "/patient/dashboard" && pathname === "/patient/dashboard") return true;
    if (href !== "/patient/dashboard" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans flex flex-col">
      {/* HEADER: Exactly 78px height */}
      <header className="bg-white border-b border-[#E5E7EB] h-[78px] flex items-center px-[32px] shrink-0">
        
        {/* LOGO: Left aligned */}
        <div 
          className="flex items-center gap-3 cursor-pointer shrink-0 w-[240px]" 
          onClick={() => router.push("/patient/dashboard")}
        >
          <div className="w-[36px] h-[36px] bg-[#2563EB] rounded-[10px] flex items-center justify-center text-white">
            <Heart size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-bold text-[#111827] leading-tight">HomeCare</span>
            <span className="text-[11px] font-bold text-[#2563EB] tracking-wider leading-none">MARKETPLACE</span>
          </div>
        </div>

        {/* SEARCH: Centered via flex-1 + flex-center */}
        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-[560px]">
            <SearchInput 
              placeholder="Search for nurses, doctors, caregivers, physiotherapists..." 
              className="w-full h-[48px] bg-[#F8FAFC] border-[#E5E7EB] rounded-full text-[16px] px-5" 
            />
          </div>
        </div>

        {/* NOTIFICATIONS & AVATAR: Right aligned */}
        <div className="flex items-center justify-end gap-5 shrink-0 w-[240px]">
          <NotificationMenu />
          <button className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6] transition-colors relative">
            <MessageSquare size={20} strokeWidth={1.5} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-[#E5E7EB] mx-2" />
          
          <UserMenu
            userName={user?.fullName || "Victoria Rani"}
            userEmail={user?.email || "Patient"}
            onLogout={handleLogout}
            onNavigateToTab={(tab) => router.push(`/patient/dashboard?view=${tab}`)}
          />
        </div>
      </header>

      {/* NAVIGATION: Spacing identical to reference */}
      <nav className="bg-white border-b border-[#E5E7EB] px-[32px] flex items-center overflow-x-auto hide-scrollbar shrink-0">
        <div className="flex items-center gap-[48px]">
          {navItems.map((item) => {
            const active = isNavItemActive(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
                className={`whitespace-nowrap h-[64px] flex items-center text-[16px] font-semibold border-b-[3px] transition-colors ${
                  active
                    ? "border-[#2563EB] text-[#2563EB]"
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* MAIN CONTAINER: Exactly constrained to 1440px with specific paddings */}
      <main className="flex-1 overflow-y-auto">
        <div 
          className="max-w-[1440px] mx-auto w-full"
          style={{
            paddingLeft: '32px',
            paddingRight: '32px',
            paddingTop: '28px',
            paddingBottom: '40px'
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
