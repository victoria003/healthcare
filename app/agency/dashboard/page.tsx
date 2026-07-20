"use client";

import React from "react";
import { 
  Calendar, 
  FileText, 
  Users, 
  Wallet, 
  ChevronRight, 
  MapPin,
  Star,
  Phone,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronLeft
} from "lucide-react";

export default function AgencyDashboardPage() {
  
  const mockSchedule = [
    { time: "09:00 AM", patient: "Mrs. Lakshmi Devi", service: "Nursing Visit", status: "Completed", statusColor: "#16A34A", statusBg: "#DCFCE7", circleColor: "#2563EB" },
    { time: "10:30 AM", patient: "Mr. Ramesh Kumar", service: "Physiotherapy", status: "Ongoing", statusColor: "#2563EB", statusBg: "#DBEAFE", circleColor: "#2563EB" },
    { time: "12:00 PM", patient: "Medication Visit", service: "John Doe", status: "Pending", statusColor: "#EA580C", statusBg: "#FFEDD5", circleColor: "#F97316" },
    { time: "02:30 PM", patient: "Elder Care", service: "Mrs. Saraswathi", status: "Upcoming", statusColor: "#9333EA", statusBg: "#F3E8FF", circleColor: "#A855F7" },
  ];

  const mockRequests = [
    { name: "Mrs. Devi Lakshmi", role: "Registered Nurse", date: "Today, 11:30 AM", distance: "4.2 km away", priority: "Urgent", priorityColor: "#DC2626", priorityBg: "#FEE2E2", initials: "DL" },
    { name: "Mr. Rao Srinivas", role: "Physiotherapist", date: "Tomorrow, 09:00 AM", distance: "6.1 km away", priority: "Normal", priorityColor: "#D97706", priorityBg: "#FEF3C7", initials: "RS" },
  ];

  const mockCaregivers = [
    { name: "Sarah Johnson", role: "Registered Nurse", rating: "4.8 (126)", status: "Available", initials: "SJ" },
    { name: "Rahul Verma", role: "Patient Attender", rating: "4.6 (98)", status: "Available", initials: "RV" },
    { name: "Priya Nair", role: "Elder Care", rating: "4.7 (76)", status: "Available", initials: "PN" },
  ];

  const mockLiveVisits = [
    { caregiver: "Nurse Sarah", patient: "Visiting Mr. Kumar", status: "On the way", time: "", icon: "phone" },
    { caregiver: "David", patient: "Visiting Mrs. Anita", status: "Ongoing", time: "Started 10:20 AM", icon: "phone" },
    { caregiver: "Mary", patient: "Visiting Mr. Iqbal", status: "Completed", time: "Today, 09:15 AM", icon: "check" },
  ];

  const cardStyle = {
    background: "#FFFFFF",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    border: "1px solid #E5E7EB",
    padding: "28px"
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px", paddingBottom: "40px" }}>
      
      {/* HERO SECTION */}
      <section style={{
        height: "320px",
        borderRadius: "32px",
        background: "linear-gradient(90deg, #F0F7FF 0%, #E0EFFF 100%)",
        border: "1px solid rgba(255,255,255,0.5)",
        display: "grid",
        gridTemplateColumns: "1fr 40%",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Left Side */}
        <div style={{ padding: "40px", display: "grid", gridTemplateRows: "auto auto auto", gap: "24px", zIndex: 10 }}>
          
          <div style={{ display: "grid", gap: "8px" }}>
            <h1 style={{ margin: 0, fontSize: "48px", fontWeight: 700, color: "#0F172A", lineHeight: 1.1 }}>
              <span style={{ fontSize: "28px", display: "block", marginBottom: "4px" }}>Good morning, 👋</span>
              HopeCare Agency
            </h1>
            <p style={{ margin: 0, fontSize: "16px", color: "#64748B" }}>Here's what's happening with your agency today.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: "16px" }}>
            
            {/* KPI 1 */}
            <div style={{ background: "#FFF", borderRadius: "20px", padding: "16px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center", border: "1px solid #FFF", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "48px", height: "48px", background: "#EFF6FF", borderRadius: "12px", display: "grid", placeItems: "center", color: "#2563EB" }}>
                <Calendar size={24} />
              </div>
              <div style={{ display: "grid", gap: "2px" }}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>14</p>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>Visits Today</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>Scheduled</p>
              </div>
            </div>

            {/* KPI 2 */}
            <div style={{ background: "#FFF", borderRadius: "20px", padding: "16px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center", border: "1px solid #FFF", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "48px", height: "48px", background: "#F5F3FF", borderRadius: "12px", display: "grid", placeItems: "center", color: "#9333EA" }}>
                <FileText size={24} />
              </div>
              <div style={{ display: "grid", gap: "2px" }}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>6</p>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>New Requests</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>Pending</p>
              </div>
            </div>

            {/* KPI 3 */}
            <div style={{ background: "#FFF", borderRadius: "20px", padding: "16px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center", border: "1px solid #FFF", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "48px", height: "48px", background: "#ECFDF5", borderRadius: "12px", display: "grid", placeItems: "center", color: "#10B981" }}>
                <Users size={24} />
              </div>
              <div style={{ display: "grid", gap: "2px" }}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>4</p>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>Available Caregivers</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>Right now</p>
              </div>
            </div>

            {/* KPI 4 */}
            <div style={{ background: "#FFF", borderRadius: "20px", padding: "16px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center", border: "1px solid #FFF", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "48px", height: "48px", background: "#FFF7ED", borderRadius: "12px", display: "grid", placeItems: "center", color: "#EA580C" }}>
                <Wallet size={24} />
              </div>
              <div style={{ display: "grid", gap: "2px" }}>
                <p style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>₹18,400</p>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>Today's Revenue</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>From 11 bookings</p>
              </div>
            </div>
            
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "16px", justifyContent: "start", marginTop: "auto" }}>
            <button style={{ background: "#2563EB", color: "#FFF", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: 600, display: "grid", gridTemplateColumns: "auto auto", gap: "12px", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.2)" }}>
              Review Requests
              <span style={{ width: "20px", height: "20px", background: "#EF4444", borderRadius: "10px", display: "grid", placeItems: "center", fontSize: "11px" }}>6</span>
            </button>
            <button style={{ background: "#FFF", color: "#2563EB", border: "1px solid #FFF", padding: "12px 24px", borderRadius: "100px", fontSize: "14px", fontWeight: 600, display: "grid", gridTemplateColumns: "auto auto", gap: "12px", alignItems: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              Create Booking
              <Plus size={16} />
            </button>
          </div>

        </div>

        {/* Right Illustration */}
        <div style={{ position: "relative", display: "grid", placeItems: "end", height: "100%" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "150%", background: "rgba(37,99,235,0.05)", borderTopLeftRadius: "100%", zIndex: 1 }}></div>
          <div style={{ width: "320px", height: "320px", background: "linear-gradient(45deg, #BFDBFE, #DBEAFE)", borderTopLeftRadius: "50%", borderTopRightRadius: "50%", position: "absolute", right: "40px", bottom: 0, zIndex: 2, display: "grid", placeItems: "center", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
             <Users size={120} color="#2563EB" opacity={0.2} />
             <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "160px", background: "linear-gradient(to top, rgba(37,99,235,0.1), transparent)" }}></div>
          </div>
        </div>
      </section>

      {/* ROW 2 */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Today's Schedule */}
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>Today's Schedule</h2>
            <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>View Full Schedule</button>
          </div>

          <div style={{ position: "relative", display: "grid", gap: "32px", paddingLeft: "100px", minHeight: "260px" }}>
            {/* Connector Line */}
            <div style={{ position: "absolute", left: "70px", top: "10px", bottom: "10px", width: "1px", background: "#E5E7EB" }}></div>

            {mockSchedule.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", position: "relative" }}>
                
                {/* Time & Node */}
                <div style={{ position: "absolute", left: "-100px", width: "70px", textAlign: "right" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#64748B" }}>{item.time}</span>
                </div>
                <div style={{ position: "absolute", left: "-35px", width: "12px", height: "12px", background: "#FFF", border: `2px solid ${item.circleColor}`, borderRadius: "6px", zIndex: 2 }}></div>
                
                {/* Content */}
                <div style={{ display: "grid", gap: "2px" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{item.patient}</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>{item.service}</p>
                </div>

                <span style={{ background: item.statusBg, color: item.statusColor, fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "100px" }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "32px", display: "grid", placeItems: "center" }}>
             <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "grid", gridTemplateColumns: "auto auto", gap: "4px", alignItems: "center" }}>
               View Full Schedule <ChevronRight size={16} />
             </button>
          </div>
        </div>

        {/* New Patient Requests */}
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>New Patient Requests</h2>
            <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>View All</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {mockRequests.map((req, idx) => (
              <div key={idx} style={{ padding: "20px", borderRadius: "16px", border: "1px solid #E5E7EB", background: "#FAFAFA", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "26px", background: "#E5E7EB", display: "grid", placeItems: "center", color: "#64748B", fontSize: "18px", fontWeight: 700 }}>
                  {req.initials}
                </div>
                
                <div style={{ display: "grid", gap: "12px" }}>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "8px", alignItems: "start" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{req.name}</h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>{req.role}</p>
                    </div>
                    <span style={{ background: req.priorityBg, color: req.priorityColor, fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", display: "grid", gridTemplateColumns: "auto auto", gap: "4px", alignItems: "center" }}>
                      <MapPin size={12} /> {req.priority}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "16px", justifyContent: "start" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "6px", alignItems: "center", fontSize: "12px", color: "#64748B" }}>
                      <Calendar size={14} /> {req.date}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "6px", alignItems: "center", fontSize: "12px", color: "#64748B" }}>
                      <MapPin size={14} /> {req.distance}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button style={{ background: "#2563EB", color: "#FFF", border: "none", padding: "8px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Accept</button>
                    <button style={{ background: "#FFF", color: "#0F172A", border: "1px solid #E5E7EB", padding: "8px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>View</button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ROW 3 */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Available Caregivers */}
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>Available Caregivers</h2>
            <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>View All</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "16px", alignItems: "center" }}>
            <button style={{ width: "32px", height: "32px", borderRadius: "16px", border: "1px solid #E5E7EB", background: "#FFF", display: "grid", placeItems: "center", color: "#94A3B8", cursor: "pointer" }}>
              <ChevronLeft size={16} />
            </button>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {mockCaregivers.map((cg, idx) => (
                <div key={idx} style={{ padding: "16px", borderRadius: "16px", border: "1px solid #E5E7EB", background: "#FFF", display: "grid", gap: "8px", justifyItems: "center", textAlign: "center" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "26px", background: "#DBEAFE", color: "#2563EB", display: "grid", placeItems: "center", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                    {cg.initials}
                  </div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{cg.name}</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>{cg.role}</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "4px", alignItems: "center", fontSize: "12px", fontWeight: 600, color: "#64748B", marginBottom: "4px" }}>
                    <Star size={14} color="#FBBF24" fill="#FBBF24" /> {cg.rating}
                  </div>
                  
                  <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", marginBottom: "16px" }}>
                    {cg.status}
                  </span>
                  
                  <button style={{ width: "100%", background: "#FFF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "6px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    Assign
                  </button>
                </div>
              ))}
            </div>

            <button style={{ width: "32px", height: "32px", borderRadius: "16px", border: "1px solid #E5E7EB", background: "#FFF", display: "grid", placeItems: "center", color: "#94A3B8", cursor: "pointer" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Live Visits */}
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>Live Visits</h2>
            <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>View All</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            {mockLiveVisits.map((visit, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#DBEAFE", color: "#2563EB", display: "grid", placeItems: "center", fontSize: "14px", fontWeight: 700 }}>
                  {visit.caregiver.charAt(0)}
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>{visit.caregiver}</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748B" }}>{visit.patient}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "24px", alignItems: "center" }}>
                  <div style={{ display: "grid", justifyItems: "end", gap: "4px" }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#16A34A", display: "grid", gridTemplateColumns: "auto auto", gap: "6px", alignItems: "center" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "3px", background: "#22C55E" }}></span>
                      {visit.status}
                    </p>
                    {visit.time && <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>{visit.time}</p>}
                  </div>
                  
                  <button style={{ width: "32px", height: "32px", borderRadius: "16px", border: "1px solid #E5E7EB", background: "#FFF", display: "grid", placeItems: "center", color: "#94A3B8", cursor: "pointer" }}>
                    {visit.icon === 'phone' ? <Phone size={16} /> : <CheckCircle2 size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ROW 4: Recent Activity */}
      <section style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", marginBottom: "32px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>Recent Activity</h2>
          <button style={{ background: "none", border: "none", color: "#2563EB", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>View All</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr auto 1fr", gap: "16px", alignItems: "start" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#DCFCE7", color: "#16A34A", display: "grid", placeItems: "center" }}>
              <CheckCircle2 size={20} />
            </div>
            <div style={{ display: "grid", gap: "4px" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>Visit completed for<br/>Mr. Kumar</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>5 mins ago</p>
            </div>
          </div>
          
          <div style={{ width: "1px", height: "40px", background: "#E5E7EB", marginTop: "4px" }}></div>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#DBEAFE", color: "#2563EB", display: "grid", placeItems: "center" }}>
              <FileText size={20} />
            </div>
            <div style={{ display: "grid", gap: "4px" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>Invoice #INV-2024-125<br/>paid by Mrs. Devi</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>20 mins ago</p>
            </div>
          </div>
          
          <div style={{ width: "1px", height: "40px", background: "#E5E7EB", marginTop: "4px" }}></div>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#FEF3C7", color: "#D97706", display: "grid", placeItems: "center" }}>
              <Star size={20} fill="currentColor" />
            </div>
            <div style={{ display: "grid", gap: "4px" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>New review received<br/>for Sarah Johnson</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>1 hour ago</p>
                <div style={{ display: "grid", gridTemplateColumns: "auto auto auto auto auto", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={10} color="#FBBF24" fill="#FBBF24" />)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "1px", height: "40px", background: "#E5E7EB", marginTop: "4px" }}></div>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#F3E8FF", color: "#9333EA", display: "grid", placeItems: "center" }}>
              <FileText size={20} />
            </div>
            <div style={{ display: "grid", gap: "4px" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>New booking request<br/>received</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>2 hours ago</p>
            </div>
          </div>

          <div style={{ width: "1px", height: "40px", background: "#E5E7EB", marginTop: "4px" }}></div>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#FEE2E2", color: "#DC2626", display: "grid", placeItems: "center" }}>
              <XCircle size={20} />
            </div>
            <div style={{ display: "grid", gap: "4px" }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>Booking cancelled for<br/>tomorrow 10:00 AM</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8" }}>3 hours ago</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
