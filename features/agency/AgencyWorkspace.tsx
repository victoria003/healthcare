"use client";

import React, { useState, useEffect } from "react";
import { Settings, Key, Globe, Plus, ToggleLeft, ToggleRight, Check, Send } from "lucide-react";

export default function AgencyWorkspace() {
  const [activeTab, setActiveTab] = useState<"tenant" | "api">("tenant");
  const [settings, setSettings] = useState({
    autoAssignStaff: false,
    commissionRate: 12,
    customDomain: "nisarga.homecare.in",
    logoUrl: ""
  });

  // API configuration states
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/snowflake/status");
      const data = await res.json();
      if (data.success) {
        setApiKeys([
          { id: "k-1", keyName: "Nisarga Integration App", maskedKey: "hc_prod_live_******a9b8", status: "active" }
        ]);
        setWebhooks([
          { id: "w-1", url: "https://nisarga.care/api/v2/homecare-callback", events: ["booking.created", "visit.vitals_logged"] }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("Settings saved successfully.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const createApiKey = () => {
    if (!newKeyName) return;
    const newKey = {
      id: `k-${Date.now()}`,
      keyName: newKeyName,
      maskedKey: `hc_prod_live_******${Math.random().toString(36).substring(2, 6)}`,
      status: "active"
    };
    setApiKeys((prev) => [...prev, newKey]);
    setNewKeyName("");
  };

  const createWebhook = () => {
    if (!newWebhookUrl) return;
    const newWh = {
      id: `w-${Date.now()}`,
      url: newWebhookUrl,
      events: ["booking.created", "visit.vitals_logged"]
    };
    setWebhooks((prev) => [...prev, newWh]);
    setNewWebhookUrl("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Nisarga Agency Administration</h3>
          <p className="text-xs text-slate-400">Manage Tenant Billing, Custom Branding, API Keys & Webhook Desks</p>
        </div>
      </div>

      <div className="flex border-b border-slate-100 bg-slate-50">
        <button
          onClick={() => setActiveTab("tenant")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "tenant" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings className="w-4 h-4 inline-block mr-1.5" />
          Multi-Tenant Branding & Rules
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 ${
            activeTab === "api" ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Key className="w-4 h-4 inline-block mr-1.5" />
          Developer Keys & Webhooks
        </button>
      </div>

      <div className="p-6">
        {statusMsg && (
          <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            {statusMsg}
          </div>
        )}

        {activeTab === "tenant" ? (
          <form onSubmit={saveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Custom Branding & White-Labeling
                </h4>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    White-Label Custom Domain
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={settings.customDomain}
                      onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                      placeholder="nisarga.homecare.in"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Branded Logo Asset URI
                  </label>
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="https://nisarga.care/assets/logo.png"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Matchmaking Automations
                </h4>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-150 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Auto-Assign Certified Staff</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Let clinical match algorithms assign nurses immediately</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, autoAssignStaff: !settings.autoAssignStaff })}
                  >
                    {settings.autoAssignStaff ? (
                      <ToggleRight className="w-9 h-9 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Platform Commission Split Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Commit Settings Adjustments
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* API Keys Panel */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Secure OAuth Client Keys
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="New client name..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                  <button
                    onClick={createApiKey}
                    className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{k.keyName}</p>
                        <p className="font-mono text-[10px] text-slate-500 mt-0.5">{k.maskedKey}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold uppercase rounded text-[9px]">
                        {k.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhooks Panel */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Transactional Callback Webhooks
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="https://myagency.com/callback..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                  <button
                    onClick={createWebhook}
                    className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {webhooks.map((w) => (
                    <div key={w.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-1.5">
                      <p className="font-mono text-[10px] text-slate-700 break-all">{w.url}</p>
                      <div className="flex flex-wrap gap-1">
                        {w.events.map((ev: string) => (
                          <span key={ev} className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-semibold rounded">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
