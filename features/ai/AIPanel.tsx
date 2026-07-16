"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, ShieldAlert, Heart, UserCheck, Star, HelpCircle } from "lucide-react";

export default function AIPanel() {
  const [activeTab, setActiveTab] = useState<"advisor" | "matching" | "risk">("advisor");
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", text: "Hello! I am your AI Clinical Advisor. Ask me anything regarding suctioning, tracheostomy sanitization, wound dressing, or patient vitals logs." }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Match states
  const [patientNeeds, setPatientNeeds] = useState("ICU support with tracheostomy decannulation maintenance");
  const [matchResult, setMatchResult] = useState("");
  const [matchLoading, setMatchLoading] = useState(false);

  // Risk summary states
  const [vitalsSummary, setVitalsSummary] = useState("");
  const [riskLoading, setRiskLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userM = { role: "user", text: inputMsg };
    setMessages((prev) => [...prev, userM]);
    setInputMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userM],
          context: { diagnosis: "Post-Tracheostomy Recovery", age: 64 }
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executeMatch = async () => {
    setMatchLoading(true);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientNeeds })
      });
      const data = await res.json();
      if (data.success) {
        setMatchResult(data.matchAnalysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  const evaluateRisks = async () => {
    setRiskLoading(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vitalsLog: [
            { bp: "120/80", pulse: 72, spo2: 98, date: "2026-07-12" },
            { bp: "145/95", pulse: 88, spo2: 91, date: "2026-07-11" } // abnormal spikes
          ]
        })
      });
      const data = await res.json();
      if (data.success) {
        setVitalsSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRiskLoading(false);
    }
  };

  useEffect(() => {
    executeMatch();
    evaluateRisks();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-900 text-white flex items-center gap-3">
        <div className="p-2.5 bg-teal-500 rounded-2xl">
          <Sparkles className="w-6 h-6 text-slate-900 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Nisarga AI Clinical Supervisor Desk</h3>
          <p className="text-xs text-slate-400">Powered by Gemini 3.5 Flash Client</p>
        </div>
      </div>

      <div className="flex border-b border-slate-100 bg-slate-50">
        <button
          onClick={() => setActiveTab("advisor")}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "advisor" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 inline-block mr-1.5" />
          Clinical AI Chatbot
        </button>
        <button
          onClick={() => setActiveTab("matching")}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "matching" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4 inline-block mr-1.5" />
          AI Staff Matching
        </button>
        <button
          onClick={() => setActiveTab("risk")}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "risk" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4 inline-block mr-1.5" />
          AI Vitals Risk Review
        </button>
      </div>

      <div className="p-6">
        {activeTab === "advisor" ? (
          <div className="space-y-4">
            <div className="h-72 border border-slate-150 rounded-2xl p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 max-w-sm rounded-2xl text-xs font-medium leading-relaxed ${
                    m.role === "assistant"
                      ? "bg-white border border-slate-200 text-slate-800 mr-auto"
                      : "bg-slate-900 text-white ml-auto"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="p-3 bg-slate-100 text-slate-400 text-xs italic rounded-2xl w-32 animate-pulse">
                  Gemini analyzing...
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask e.g., 'How should I sanitize tracheostomy tubes?'"
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        ) : activeTab === "matching" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Primary Patient Clinical Roster Needs
              </label>
              <textarea
                value={patientNeeds}
                onChange={(e) => setPatientNeeds(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none"
              />
            </div>

            <button
              onClick={executeMatch}
              disabled={matchLoading}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
            >
              {matchLoading ? "Running Matching Algorithm..." : "Evaluate matching staff"}
            </button>

            {matchResult && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl mt-4 text-xs font-semibold leading-relaxed text-slate-800">
                {matchResult}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              Anomalous Spikes & Vitals Synthesis
            </h4>

            <button
              onClick={evaluateRisks}
              disabled={riskLoading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
            >
              {riskLoading ? "Synthesizing Vitals History..." : "Run Risk Evaluation Engine"}
            </button>

            {vitalsSummary && (
              <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl mt-4 text-xs font-semibold leading-relaxed text-slate-800">
                {vitalsSummary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
