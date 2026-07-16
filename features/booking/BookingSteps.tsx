"use client";

import React, { useState, useEffect } from "react";
import {
  Clock, MapPin, CheckCircle2, ChevronRight, Activity, PenTool,
  Heart, Star, AlertTriangle, MessageSquare, Compass, ClipboardList, ShieldAlert
} from "lucide-react";

import { BookingTimeline } from "../../components/Timeline";


interface Booking {
  id: string;
  agencyId: string;
  agencyName: string;
  patientId: string;
  patientName: string;
  serviceCategory: string;
  serviceName: string;
  status: string;
  date: string;
  timeSlot: string;
  amount: number;
  paymentStatus: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  assignedStaffAvatar?: string;
  liveLocation?: { lat: number; lng: number };
  etaMinutes?: number;
  vitals?: { bloodPressure: string; pulseRate: number; spo2: number };
  careNotes?: string;
  signatureUrl?: string;
  rating?: number;
  reviewText?: string;
}

interface BookingStepsProps {
  booking: Booking;
  userRole: string; // Patient, Agency Admin, Nurse, Caregiver, Platform Admin
  onUpdate: () => void;
}

// 15-Step Booking State Machine
const STATE_STEPS = [
  "booking_created",
  "payment_pending",
  "agency_accepted",
  "assign_staff",
  "staff_accepted",
  "travel_started",
  "arrived",
  "check_in",
  "vitals",
  "care",
  "patient_signature",
  "check_out",
  "invoice",
  "payment",
  "review",
  "completed"
];

const STEP_LABELS: Record<string, string> = {
  booking_created: "Created",
  payment_pending: "Payment Pending",
  agency_accepted: "Agency Accepted",
  assign_staff: "Assign Staff",
  staff_accepted: "Staff Assigned",
  travel_started: "On the Way",
  arrived: "Staff Arrived",
  check_in: "Check In Completed",
  vitals: "Vitals Captured",
  care: "Care Administered",
  patient_signature: "Patient Signed",
  check_out: "Check Out Completed",
  invoice: "Invoice Generated",
  payment: "Settled",
  review: "Reviewed",
  completed: "Completed"
};

export default function BookingSteps({ booking, userRole, onUpdate }: BookingStepsProps) {
  const [activeTab, setActiveTab] = useState<"track" | "clinical">("track");
  const [bp, setBp] = useState("120/80");
  const [pulse, setPulse] = useState(72);
  const [oxygen, setOxygen] = useState(98);
  const [notes, setNotes] = useState("");
  const [typedSign, setTypedSign] = useState("");
  const [starCount, setStarCount] = useState(5);
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);
  const [sosStatus, setSosStatus] = useState("");

  const currentIdx = STATE_STEPS.indexOf(booking.status);

  const bookingStepsTimelineData = STATE_STEPS.map((step, idx) => {
    let status: "completed" | "current" | "upcoming" = "upcoming";
    if (idx < currentIdx) {
      status = "completed";
    } else if (idx === currentIdx) {
      status = "current";
    }

    return {
      id: step,
      title: STEP_LABELS[step],
      description: idx === currentIdx ? "Active stage. Actions are required to advance clinical workflow." : idx < currentIdx ? "Verified and logged in central compliance repository." : "Upcoming care pathway milestone.",
      status,
    };
  });


  // Auto increment simulated countdown
  const [simEta, setSimEta] = useState(booking.etaMinutes || 15);
  useEffect(() => {
    if (booking.status === "travel_started" && simEta > 1) {
      const timer = setInterval(() => setSimEta((prev) => prev - 1), 20000);
      return () => clearInterval(timer);
    }
  }, [booking.status, simEta]);

  const advanceState = async (nextStatus: string, payload: any = {}) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          actorId: "u-3", // Simulated actor
          ...payload
        }),
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const triggerSOS = async () => {
    setSosStatus("dispatching");
    try {
      const res = await fetch("/api/sos/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          patientId: booking.patientId,
          patientName: booking.patientName,
          message: "Triggered from core Treatment view tracking."
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSosStatus("active");
        setTimeout(() => setSosStatus(""), 6000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Upper Status strip */}
      <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] bg-teal-500 text-slate-900 font-extrabold uppercase px-2.5 py-1 rounded-full">
            State ID: {booking.id}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight mt-2">{booking.serviceName}</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wide">
            Assigned to: {booking.assignedStaffName || "Unassigned"} ({booking.agencyName})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerSOS}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              sosStatus === "active"
                ? "bg-emerald-600 text-white animate-pulse"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {sosStatus === "dispatching" ? "Broadcasting..." : sosStatus === "active" ? "SOS Active" : "Trigger SOS"}
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="border-b border-slate-100 bg-slate-50 p-4 overflow-x-auto flex items-center gap-2">
        {STATE_STEPS.map((step, idx) => {
          const isPassed = idx <= currentIdx;
          const isActive = idx === currentIdx;
          return (
            <div key={step} className="flex items-center gap-1 shrink-0">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-100"
                    : isPassed
                    ? "bg-slate-200 text-slate-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {STEP_LABELS[step]}
              </span>
              {idx < STATE_STEPS.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
            </div>
          );
        })}
      </div>

      {/* Segment Navigation */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab("track")}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "track" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass className="w-4 h-4 inline-block mr-1.5" />
          Live Progress Tracker
        </button>
        <button
          onClick={() => setActiveTab("clinical")}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "clinical" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="w-4 h-4 inline-block mr-1.5" />
          Clinical Care Logs
        </button>
      </div>

      {/* Segment Content */}
      <div className="p-6">
        {activeTab === "track" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telemetry Column */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Caregiver Dispatch Telemetry
                </h4>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={booking.assignedStaffAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      {booking.assignedStaffName || "Clinical Team Allocating..."}
                    </h5>
                    <p className="text-xs text-slate-500">
                      {booking.assignedStaffPhone || "MCH Nursing Desk"}
                    </p>
                  </div>
                </div>

                {/* Simulated Maps Iframe Container */}
                <div className="relative w-full h-44 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

                  {/* Marker representation */}
                  <div className="relative z-10 flex justify-between items-center h-full">
                    <div className="p-2 bg-teal-100 border border-teal-300 rounded-full">
                      <MapPin className="w-6 h-6 text-teal-600 animate-bounce" />
                    </div>
                    <div className="flex-1 h-0.5 border-t-2 border-dashed border-teal-300 mx-4" />
                    <div className="p-2 bg-slate-100 border border-slate-300 rounded-full">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                  </div>

                  <div className="relative z-10 bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-between w-full">
                    <span>Active ETA Route</span>
                    <span className="text-teal-400 font-mono text-xs">{simEta} Minutes left</span>
                  </div>
                </div>
              </div>

              {/* Action State Progression Controller */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                  Workflow Dispatch Desk
                </h4>

                <div className="p-4 bg-white border border-slate-100 rounded-xl mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Workflow Node
                  </p>
                  <p className="font-extrabold text-slate-900 text-base mt-0.5">
                    {STEP_LABELS[booking.status]}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Step 2: Payment simulation */}
                  {booking.status === "payment_pending" && (
                    <button
                      onClick={() => advanceState("agency_accepted")}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Process Dummy Payment (INR {booking.amount})
                    </button>
                  )}

                  {/* Step 3: Agency Accept */}
                  {booking.status === "agency_accepted" && (
                    <button
                      onClick={() => advanceState("assign_staff")}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Confirm Booking & Dispatch Coordinator
                    </button>
                  )}

                  {/* Step 4: Assign staff */}
                  {booking.status === "assign_staff" && (
                    <button
                      onClick={() => advanceState("staff_accepted", {
                        assignedStaffId: "u-3",
                        assignedStaffName: "Priya Sharma, RN",
                        assignedStaffPhone: "+91 9848012345"
                      })}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Assign Priya Sharma, RN
                    </button>
                  )}

                  {/* Step 5: Staff accept */}
                  {booking.status === "staff_accepted" && (
                    <button
                      onClick={() => advanceState("travel_started")}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Caregiver: Start Travel Route
                    </button>
                  )}

                  {/* Step 6: Travel Started */}
                  {booking.status === "travel_started" && (
                    <button
                      onClick={() => advanceState("arrived")}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Caregiver: Register Arrival at Site
                    </button>
                  )}

                  {/* Step 7: Arrived */}
                  {booking.status === "arrived" && (
                    <button
                      onClick={() => advanceState("check_in")}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Perform Check In Protocol
                    </button>
                  )}

                  {/* Step 8: Check in done, go to vitals */}
                  {booking.status === "check_in" && (
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed text-center py-4 bg-white rounded-xl border border-dashed border-slate-200">
                      Please navigate to the <b>Clinical Care Logs</b> tab to capture vitals and document treatments.
                    </p>
                  )}

                  {/* Step 11: Patient sign */}
                  {booking.status === "patient_signature" && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Verify Patient Signature (Type name)
                      </label>
                      <input
                        type="text"
                        value={typedSign}
                        onChange={(e) => setTypedSign(e.target.value)}
                        placeholder="Ankala Victoria Rani"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 bg-white"
                      />
                      <button
                        onClick={() => advanceState("check_out", { signatureUrl: `/signatures/${typedSign || "sign"}.png` })}
                        disabled={!typedSign}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer disabled:opacity-50"
                      >
                        Capture Signature & Check Out
                      </button>
                    </div>
                  )}

                  {/* Step 12: Checkout */}
                  {booking.status === "check_out" && (
                    <button
                      onClick={() => advanceState("invoice")}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Generate Post-Visit Invoice
                    </button>
                  )}

                  {/* Step 13: Invoice */}
                  {booking.status === "invoice" && (
                    <button
                      onClick={() => advanceState("payment")}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Mark Invoice as Paid/Settled
                    </button>
                  )}

                  {/* Step 14: Payment */}
                  {booking.status === "payment" && (
                    <button
                      onClick={() => advanceState("review")}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Go to Patient Feedback Form
                    </button>
                  )}

                  {/* Step 15: Review */}
                  {booking.status === "review" && (
                    <div className="space-y-3">
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} onClick={() => setStarCount(s)}>
                            <Star
                              className={`w-6 h-6 ${
                                s <= starCount ? "text-amber-400 fill-amber-400" : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your clinical visit experience..."
                        className="w-full p-2 border border-slate-200 text-xs rounded-xl focus:outline-none focus:border-teal-500 bg-white"
                      />
                      <button
                        onClick={() => advanceState("completed", { rating: starCount, reviewText: review })}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                  {/* Step 16: Completed */}
                  {booking.status === "completed" && (
                    <div className="text-center py-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h5 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider">
                        Treatment Completed
                      </h5>
                      <p className="text-[11px] text-emerald-700 px-3">
                        Visit audit logs, vitals trajectory, and clinical invoice reports have been archived securely in the patient's medical timeline.
                      </p>
                    </div>
                  )}

                  {/* Default pending state */}
                  {!["payment_pending", "agency_accepted", "assign_staff", "staff_accepted", "travel_started", "arrived", "check_in", "patient_signature", "check_out", "invoice", "payment", "review", "completed"].includes(booking.status) && (
                    <button
                      onClick={() => advanceState("payment_pending")}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                    >
                      Authorize Treatment
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded 15-Stage Care Progression Timeline */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6">
              <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
                Full 15-Stage Care Progression Timeline
              </h4>
              <div className="max-h-96 overflow-y-auto pr-2">
                <BookingTimeline steps={bookingStepsTimelineData} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Clinical Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Vitals & Diagnostics Input
                </h4>

                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      placeholder="120/80"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Pulse Rate (bpm)
                      </label>
                      <input
                        type="number"
                        value={pulse}
                        onChange={(e) => setPulse(Number(e.target.value))}
                        placeholder="72"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Oxygen SpO2 (%)
                      </label>
                      <input
                        type="number"
                        value={oxygen}
                        onChange={(e) => setOxygen(Number(e.target.value))}
                        placeholder="98"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  {booking.status === "check_in" ? (
                    <button
                      onClick={() => advanceState("vitals", { vitals: { bloodPressure: bp, pulseRate: pulse, spo2: oxygen } })}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Record Vitals & Advance
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-200 text-slate-400 text-xs font-bold uppercase rounded-xl cursor-not-allowed"
                    >
                      Vitals Logged / Locked
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Care Administration & Nursing Notes
                </h4>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Clinical Activity Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Cleaned tracheostomy tube, cleared airways with suctioning. Administered sub-q medication feeds, patient rested comfortably."
                      className="w-full p-3 border border-slate-200 text-xs rounded-xl bg-white focus:outline-none focus:border-teal-500 h-28"
                    />
                  </div>

                  {booking.status === "vitals" ? (
                    <button
                      onClick={() => advanceState("care", { careNotes: notes })}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Document Care & Complete Visit
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-200 text-slate-400 text-xs font-bold uppercase rounded-xl cursor-not-allowed"
                    >
                      {booking.status === "check_in" ? "Awaiting Vitals Entry First" : "Care Activities Logged / Saved"}
                    </button>
                  )}

                  {booking.status === "care" && (
                    <button
                      onClick={() => advanceState("patient_signature")}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Proceed to Patient Signature Verification
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Display logged details */}
            {(booking.vitals || booking.careNotes) && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2 mt-4 text-xs">
                <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Logged Clinical Diagnostics Record
                </h5>
                {booking.vitals && (
                  <p className="text-slate-700 font-medium">
                    • **Vitals**: BP={booking.vitals.bloodPressure} mmHg, Pulse={booking.vitals.pulseRate} bpm, SpO2={booking.vitals.spo2}%
                  </p>
                )}
                {booking.careNotes && (
                  <p className="text-slate-700 font-medium">
                    • **Clinical Activity Log**: "{booking.careNotes}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
