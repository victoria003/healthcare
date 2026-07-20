"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  UserPlus,
  Briefcase,
  MessageSquare,
  DollarSign,
  FileText,
  Settings,
  Heart
} from "lucide-react";

export default function AgencySidebar() {
  const pathname = usePathname() || "";

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/agency/dashboard" },
    { name: "Bookings", icon: Calendar, href: "/agency/bookings" },
    { name: "Patients", icon: Users, href: "/agency/patients" },
    { name: "Caregivers", icon: UserPlus, href: "/agency/professionals" },
    { name: "Services", icon: Briefcase, href: "/agency/services" },
    { name: "Messages", icon: MessageSquare, href: "/agency/messages" },
    { name: "Finance", icon: DollarSign, href: "/agency/reports" },
    { name: "Documents", icon: FileText, href: "/agency/documents" },
    { name: "Settings", icon: Settings, href: "/agency/settings" },
  ];

  return (
    <aside 
      style={{
        background: "#FFFFFF",
        borderTopRightRadius: "32px",
        borderBottomRightRadius: "32px",
        boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "24px"
      }}
    >
      {/* Logo */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px", alignItems: "center", marginBottom: "40px" }}>
        <div style={{ width: "32px", height: "32px", background: "#2563EB", borderRadius: "8px", display: "grid", placeItems: "center", color: "#FFF" }}>
          <Heart size={18} fill="currentColor" />
        </div>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", margin: 0, lineHeight: 1.2 }}>HomeCare</h1>
          <p style={{ fontSize: "10px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Marketplace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: "grid", gap: "6px", overflowY: "auto" }}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== "/agency" || pathname === "/agency");
          return (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "14px",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "12px",
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#2563EB" : "#64748B",
                textDecoration: "none",
                fontWeight: isActive ? 600 : 500,
                fontSize: "15px",
                transition: "all 0.2s"
              }}
            >
              <item.icon size={20} color={isActive ? "#2563EB" : "#94A3B8"} />
              <span>{item.name}</span>
              {item.name === "Messages" && (
                <span style={{ 
                  background: "#FEF3C7", 
                  color: "#D97706", 
                  fontSize: "11px", 
                  fontWeight: 700, 
                  padding: "2px 6px", 
                  borderRadius: "10px" 
                }}>
                  4
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Promotional Card */}
      <div style={{
        background: "#F8FAFC",
        borderRadius: "20px",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #E5E7EB",
        marginTop: "20px"
      }}>
        <div style={{ width: "48px", height: "48px", background: "#DBEAFE", color: "#2563EB", borderRadius: "24px", display: "grid", placeItems: "center", margin: "0 auto 12px auto" }}>
          <Users size={24} />
        </div>
        <h4 style={{ color: "#0F172A", fontWeight: 600, fontSize: "15px", margin: "0 0 4px 0" }}>Grow your agency</h4>
        <p style={{ color: "#64748B", fontSize: "13px", margin: "0 0 16px 0", lineHeight: 1.4 }}>
          Invite qualified caregivers and increase your bookings.
        </p>
        <button style={{
          width: "100%",
          background: "#2563EB",
          color: "#FFF",
          border: "none",
          padding: "10px",
          borderRadius: "12px",
          fontWeight: 500,
          fontSize: "14px",
          cursor: "pointer"
        }}>
          Invite Caregivers
        </button>
      </div>
    </aside>
  );
}
