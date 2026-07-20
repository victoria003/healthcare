"use client";

import React from "react";
import { Search, Plus, Bell, MessageSquare, ChevronDown, Heart } from "lucide-react";

export default function AgencyHeader() {
  return (
    <header 
      style={{
        height: "72px",
        background: "#FFFFFF",
        borderRadius: "24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        padding: "0 24px",
        gap: "24px"
      }}
    >
      
      {/* Search Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "12px", background: "#F8FAFC", borderRadius: "100px", padding: "10px 16px", maxWidth: "400px" }}>
        <Search size={16} color="#94A3B8" />
        <input 
          type="text" 
          placeholder="Search patients, bookings, caregivers..."
          style={{ background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#0F172A", width: "100%" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "4px" }}>
          <span style={{ fontSize: "12px", color: "#94A3B8", border: "1px solid #E5E7EB", borderRadius: "4px", padding: "2px 6px" }}>⌘</span>
          <span style={{ fontSize: "12px", color: "#94A3B8", border: "1px solid #E5E7EB", borderRadius: "4px", padding: "2px 6px" }}>K</span>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "auto auto auto auto auto", alignItems: "center", gap: "24px" }}>
        
        {/* Create Booking Button */}
        <button style={{ 
          background: "#2563EB", 
          color: "#FFFFFF", 
          border: "none", 
          padding: "10px 20px", 
          borderRadius: "100px", 
          fontSize: "14px", 
          fontWeight: 500, 
          display: "grid", 
          gridTemplateColumns: "auto auto", 
          gap: "8px", 
          alignItems: "center",
          cursor: "pointer"
        }}>
          <Plus size={16} />
          Create Booking
        </button>

        <div style={{ width: "1px", height: "32px", background: "#E5E7EB" }}></div>

        {/* Notifications */}
        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "16px" }}>
          <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <Bell size={22} />
            <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#EF4444", color: "#FFF", fontSize: "10px", fontWeight: 700, width: "16px", height: "16px", borderRadius: "8px", display: "grid", placeItems: "center", border: "2px solid #FFF" }}>7</span>
          </button>
          <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <MessageSquare size={22} />
            <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#2563EB", color: "#FFF", fontSize: "10px", fontWeight: 700, width: "16px", height: "16px", borderRadius: "8px", display: "grid", placeItems: "center", border: "2px solid #FFF" }}>3</span>
          </button>
        </div>

        <div style={{ width: "1px", height: "32px", background: "#E5E7EB" }}></div>

        {/* Profile */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "12px", alignItems: "center", cursor: "pointer" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#DBEAFE", color: "#2563EB", display: "grid", placeItems: "center", border: "1px solid #BFDBFE" }}>
            <Heart size={20} fill="currentColor" />
          </div>
          <div style={{ display: "grid", gap: "2px" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>HopeCare Agency</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>Agency Admin</p>
          </div>
          <ChevronDown size={16} color="#94A3B8" />
        </div>

      </div>

    </header>
  );
}
