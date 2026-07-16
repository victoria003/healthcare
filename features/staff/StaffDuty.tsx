"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, ShieldCheck, Plus, ListTodo, Clipboard, HelpCircle, FileCheck } from "lucide-react";

export default function StaffDuty() {
  const [activeTab, setActiveTab] = useState<"duty" | "leave" | "credentials">("duty");
  
  // Attendance & schedules
  const [clockedIn, setClockedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);

  // Leaves
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveType, setLeaveType] = useState("sick");

  // Certificates
  const [certs, setCerts] = useState<any[]>([]);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/bookings?staffId=u-3");
      const data = await res.json();
      if (data.success) {
        setSchedules(data.bookings);
      }
      setLeaves([
        { id: "l-1", date: "2026-07-20", type: "casual", status: "approved" }
      ]);
      setCerts([
        { id: "c-1", title: "Advance Cardiovascular Life Support (ACLS)", issuer: "Apollo Hospitals", issueDate: "2025-01-10", expiryDate: "2027-01-10" }
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClockToggle = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setClockedIn(false);
      setCheckInTime("");
    }
  };

  const submitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate) return;
    const newL = {
      id: `l-${Date.now()}`,
      date: leaveDate,
      type: leaveType,
      status: "pending"
    };
    setLeaves((prev) => [newL, ...prev]);
    setLeaveDate("");
  };

  const uploadCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle) return;
    const newC = {
      id: `c-${Date.now()}`,
      title: certTitle,
      issuer: certIssuer || "American Heart Association",
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "2028-07-12"
    };
    setCerts((prev) => [...prev, newC]);
    setCertTitle("");
    setCertIssuer("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Caregiver Duty Companion</h3>
          <p className="text-xs text-slate-400">Priya Sharma, RN • Nisarga ICU Nursing Staff</p>
        </div>

        <button
          onClick={handleClockToggle}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            clockedIn
              ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-100"
              : "bg-teal-500 text-slate-900 shadow-md hover:bg-teal-400"
          }`}
        >
          {clockedIn ? `Clocked In (${checkInTime}) • Clock Out` : "Clock In Daily Attendance"}
        </button>
      </div>

      <div className="flex border-b border-slate-100 bg-slate-50">
        <button
          onClick={() => setActiveTab("duty")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "duty" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clipboard className="w-4 h-4 inline-block mr-1.5" />
          Active Patient Duties
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "leave" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4 inline-block mr-1.5" />
          Leaves & Time-off
        </button>
        <button
          onClick={() => setActiveTab("credentials")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "credentials" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck className="w-4 h-4 inline-block mr-1.5" />
          Certified Records
        </button>
      </div>

      <div className="p-6">
        {activeTab === "duty" ? (
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">
              Allocated Homecare Visits Today
            </h4>

            {schedules.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No patient homecare treatments scheduled on your active roster.
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((s) => (
                  <div key={s.id} className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] bg-teal-50 text-teal-700 border border-teal-100 font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                          {s.serviceCategory}
                        </span>
                        <h5 className="font-bold text-slate-900 text-sm mt-1">{s.patientName}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">{s.address.addressLine}</p>
                      </div>

                      <span className="text-[10px] bg-slate-900 text-white font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0">
                        {s.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{s.timeSlot} ({s.durationHours} hrs)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "leave" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form */}
            <form onSubmit={submitLeave} className="md:col-span-1 space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Submit Time-off Request
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Selected Leave Date
                </label>
                <input
                  type="date"
                  required
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Leave Allocation Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="sick">Medical / Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="annual">Annual Leave</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                File Request
              </button>
            </form>

            {/* List */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Leave Calendar Status
              </h4>
              {leaves.map((l) => (
                <div key={l.id} className="p-4 border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-900 capitalize">{l.type} Leave</p>
                    <p className="text-slate-400 font-mono text-[10px] mt-0.5">{l.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${
                    l.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upload Cert Form */}
            <form onSubmit={uploadCert} className="md:col-span-1 space-y-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Add Professional Certified Records
              </h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Certificate Title Name
                </label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="ACLS Training..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Issuing Medical Authority
                </label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="Apollo / AHA..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Register Record
              </button>
            </form>

            {/* Credentials List */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Active Verified Credentials
              </h4>
              {certs.map((c) => (
                <div key={c.id} className="p-4 border border-slate-150 rounded-xl flex items-start gap-3 bg-slate-50/40">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{c.title}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Issuer: {c.issuer}</p>
                    <p className="text-[9px] text-slate-400 mt-1 font-mono">Expires: {c.expiryDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
