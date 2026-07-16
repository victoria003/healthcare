"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Square, FileText, ClipboardList, Clock, CheckCircle2, Ticket, MessageSquare } from "lucide-react";
import { PatientTimeline } from "../../components/Timeline";

interface CarePlansProps {
  patientId: string;
}

export default function CarePlans({ patientId }: CarePlansProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>({});

  // Ticket creation
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketCat, setTicketCat] = useState("general");
  const [ticketStatus, setTicketStatus] = useState("");

  const fetchPatientData = async () => {
    try {
      const resPlan = await fetch(`/api/care-plans?patientId=${patientId}`);
      const dataPlan = await resPlan.json();
      if (dataPlan.success) setPlans(dataPlan.carePlans);

      // Simulate tickets & timeline
      const resState = await fetch("/api/snowflake/status");
      const dataState = await resState.json();
      if (dataState.success) {
        // Fetch support tickets and medical timeline from general db state
        const resBookings = await fetch("/api/bookings");
        const dataBookings = await resBookings.json();
        if (dataBookings.success) {
          // Setting demo values matching PatientTimeline signature
          setTimeline([
            {
              id: "e1",
              type: "treatment",
              title: "Tracheostomy Tube Check",
              description: "Tracheal suction performed, stable oxygen reading. Checked patient airway resistance and verified positive airflow metrics.",
              date: "July 12, 2026 09:12 AM",
              author: "Priya Sharma, RN",
              vitals: [
                { label: "SpO2", value: "98%" },
                { label: "Pulse", value: "72 bpm" }
              ]
            },
            {
              id: "e2",
              type: "treatment",
              title: "Active Gait Training Complete",
              description: "Assisted walk around ward (45 meters) achieved with stable balance. No postural hypotension reported.",
              date: "July 11, 2026 04:30 PM",
              author: "Priya Sharma, RN",
              vitals: [
                { label: "BP", value: "118/76 mmHg" }
              ]
            }
          ]);
          setTickets([
            { id: "t-1", subject: "Billing Double Charge on HDFC Card", message: "Refund pending review.", category: "billing", status: "open", createdAt: "2026-07-12" }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const toggleGoal = (goal: string) => {
    setCompletedGoals((prev) => ({ ...prev, [goal]: !prev[goal] }));
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus("submitting");
    setTimeout(() => {
      setTickets((prev) => [
        {
          id: `t-${Date.now()}`,
          subject: ticketSubject,
          message: ticketMsg,
          category: ticketCat,
          status: "open",
          createdAt: new Date().toISOString().split("T")[0]
        },
        ...prev
      ]);
      setTicketSubject("");
      setTicketMsg("");
      setTicketStatus("success");
      setTimeout(() => setTicketStatus(""), 4000);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recovery Objectives */}
      <div className="lg:col-span-2 space-y-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 rounded-2xl">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Active Recovery Care Plan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Physician Supervisor: {plan.createdBy}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 mb-6">
              <span className="text-[9px] bg-slate-900 dark:bg-slate-700 text-white font-extrabold uppercase px-2 py-0.5 rounded-full">
                Primary Diagnosis
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{plan.diagnosis}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Schedule Density: {plan.frequency}</p>
            </div>

            {/* Checklist Goals */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Daily Clinical Checklists & Milestones
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.goals?.map((goal: string, idx: number) => {
                  const isChecked = completedGoals[goal];
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 border rounded-2xl flex items-start gap-3 text-left transition-all cursor-pointer ${
                        isChecked
                          ? "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-400"
                          : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold">{goal}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                          {isChecked ? "Completed today" : "Pending checklist completion"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prescriptions */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Active Medical Prescriptions
              </h4>
              <div className="space-y-2">
                {plan.prescriptions?.map((rx: string) => (
                  <div key={rx} className="p-3 bg-teal-50/30 dark:bg-teal-500/5 border border-teal-100/50 dark:border-teal-500/10 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{rx}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Support Tickets Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-2xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Support & Escalations Center</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Log scheduling conflicts or general disputes</p>
            </div>
          </div>

          <form onSubmit={createTicket} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                  Ticket Category
                </label>
                <select
                  value={ticketCat}
                  onChange={(e) => setTicketCat(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white"
                >
                  <option value="billing">Billing Discrepancy</option>
                  <option value="clinical">Clinical Care Issue</option>
                  <option value="scheduling">Scheduling Dispute</option>
                  <option value="general">General Support</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                  Brief Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Need helper change..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                Detailed Complaint Message
              </label>
              <textarea
                required
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="Describe details for clinical coordination review..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 h-24 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={ticketStatus === "submitting"}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {ticketStatus === "submitting" ? "Filing Ticket..." : "Submit Complaint Ticket"}
            </button>

            {ticketStatus === "success" && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold rounded-xl text-xs">
                Your escalation ticket has been logged successfully. Clinical Supervisors will respond shortly.
              </div>
            )}
          </form>

          {/* Active Tickets List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              My Active Support Tickets
            </h4>
            {tickets.map((t) => (
              <div key={t.id} className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl flex justify-between items-start gap-4 bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold uppercase px-2 py-0.5 rounded">
                    {t.category}
                  </span>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-1.5">{t.subject}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.message}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30 text-[10px] font-extrabold uppercase rounded-full shrink-0">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Timeline Calendar */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-6 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Medical History Timeline
          </h3>

          <PatientTimeline logs={timeline} />
        </div>
      </div>
    </div>
  );
}

