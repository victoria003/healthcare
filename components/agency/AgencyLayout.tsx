"use client";

import React from "react";
import AgencySidebar from "./AgencySidebar";
import AgencyHeader from "./AgencyHeader";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "var(--font-sans), sans-serif",
        color: "#0F172A"
      }}
    >
      <AgencySidebar />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "auto 1fr" }}>
        <div style={{ padding: "40px 40px 0 40px", maxWidth: "1600px", width: "100%", justifySelf: "center" }}>
          <AgencyHeader />
        </div>
        <main style={{ padding: "40px", maxWidth: "1600px", width: "100%", justifySelf: "center" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
