"use client";
import React, { useState } from "react";
import { User, Bell, Shield, Globe, Settings, Sun, Moon, ToggleLeft, ToggleRight, Check } from "lucide-react";
import { useTheme } from "../../components/ThemeContext";

export default function SettingsConsole() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications" | "security">("profile");
  const [statusMsg, setStatusMsg] = useState("");

  const [profile, setProfile] = useState({
    fullName: "Ankala Victoria Rani",
    email: "victoriarani.ankala@gmail.com",
    phone: "+91 9490123456",
    role: "Patient"
  });

  const [pref, setPref] = useState({
    language: "en-US",
    timezone: "IST (UTC+05:30)",
    layoutMode: "standard",
    autoSyncSnowflake: true,
  });

  const [notif, setNotif] = useState({
    emailBookings: true,
    smsVitals: true,
    pushAnnouncements: false,
  });

  const [security, setSecurity] = useState({
    mfaEnabled: true,
    sessionTimeout: "30 mins",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("Preferences updated successfully in user session storage.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile Console", icon: <User className="w-4 h-4" /> },
    { id: "preferences", label: "Regional & Layout", icon: <Globe className="w-4 h-4" /> },
    { id: "notifications", label: "Notification Channels", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security & MFA", icon: <Shield className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold">Preferences Console</h3>
          <p className="text-xs text-slate-400">Configure profile attributes, local regional parameters, theme, and dashboard presets</p>
        </div>
      </div>

      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setStatusMsg(""); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? "border-teal-600 text-teal-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900">
        {statusMsg && (
          <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/40">
            <Check className="w-4 h-4" />
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === "profile" && (
            <div className="space-y-4 max-w-lg">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Profile Console</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6 max-w-lg">
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Regional Configs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Language</label>
                    <select
                      value={pref.language}
                      onChange={(e) => setPref({ ...pref, language: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                    >
                      <option value="en-US">English (en-US)</option>
                      <option value="en-IN">English (en-IN)</option>
                      <option value="te-IN">Telugu (te-IN)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timezone</label>
                    <input
                      type="text"
                      value={pref.timezone}
                      disabled
                      className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Theme preference */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Design Theme Preference</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      theme === "light"
                        ? "bg-slate-900 border-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light Theme
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      theme === "dark"
                        ? "bg-slate-900 border-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark Theme
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Dashboard Layout</h4>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Auto Sync Snowflake Streams</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Keep dashboard widgets synchronized in real-time</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPref({ ...pref, autoSyncSnowflake: !pref.autoSyncSnowflake })}
                  >
                    {pref.autoSyncSnowflake ? (
                      <ToggleRight className="w-9 h-9 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-lg">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Email Bookings Alerts</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Receive copy of bookings confirmation details in inbox</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotif({ ...notif, emailBookings: !notif.emailBookings })}
                  >
                    {notif.emailBookings ? (
                      <ToggleRight className="w-9 h-9 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">SMS Vitals Updates</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Get Twilio SMS alert notifications of daily checked vitals</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotif({ ...notif, smsVitals: !notif.smsVitals })}
                  >
                    {notif.smsVitals ? (
                      <ToggleRight className="w-9 h-9 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Push Announcements</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Receive platform compliance or service availability warnings</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotif({ ...notif, pushAnnouncements: !notif.pushAnnouncements })}
                  >
                    {notif.pushAnnouncements ? (
                      <ToggleRight className="w-9 h-9 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4 max-w-lg">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Security Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-2xl">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">MFA Authentication (Google Authenticator)</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Verify session check-in using secure 6-digit dynamic codes</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSecurity({ ...security, mfaEnabled: !security.mfaEnabled })}
                  >
                    {security.mfaEnabled ? (
                      <ToggleRight className="w-9 h-9 text-teal-600" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session Inactive Timeout</label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                  >
                    <option value="15 mins">15 minutes</option>
                    <option value="30 mins">30 minutes</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Save Configuration Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
