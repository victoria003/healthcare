"use client";

import React, { useState } from "react";
import { LogIn, KeyRound, Mail, Phone, ShieldCheck, HelpCircle } from "lucide-react";

interface AuthModalProps {
  onSuccess: (user: any, token: string) => void;
  onClose?: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("Patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        onSuccess(data.user, data.token);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError("Network connection failure");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!phone && !email) {
      setError("Please input email or phone number");
      return;
    }
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, role }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setMsg(data.message);
      } else {
        setError(data.error || "Failed to deliver code");
      }
    } catch (err) {
      setError("Network timeout");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, code: otpCode }),
      });
      const data = await res.json();

      if (data.success) {
        onSuccess(data.user, data.token);
      } else {
        setError(data.error || "Incorrect OTP");
      }
    } catch (err) {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "/api/auth/google/url",
      "GoogleAuthPopup",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        onSuccess(event.data.user, event.data.token);
        window.removeEventListener("message", messageHandler);
      }
    };

    window.addEventListener("message", messageHandler);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">HomeCare Grid Identity</h3>
            <p className="text-xs text-slate-400">Secure Single Sign-On Access</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setActiveTab("password"); setError(""); setMsg(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "password" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Password Credentials
          </button>
          <button
            onClick={() => { setActiveTab("otp"); setError(""); setMsg(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "otp" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            OTP Multi-Factor (SMS/Email)
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium rounded">
            {error}
          </div>
        )}

        {msg && (
          <div className="p-3 mb-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs font-semibold rounded font-mono leading-relaxed">
            {msg}
          </div>
        )}

        {activeTab === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                Clinical Registry Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                Secure Key Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                    Workspace Role Setting
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                  >
                    <option value="Patient">Patient / Family</option>
                    <option value="Agency Admin">Agency Administrator</option>
                    <option value="Nurse">Registered Nurse (RN)</option>
                    <option value="Caregiver">Companion Caregiver</option>
                    <option value="Platform Admin">Platform Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                    Contact Phone or Email
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={phone || email}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes("@")) {
                          setEmail(val);
                          setPhone("");
                        } else {
                          setPhone(val);
                          setEmail("");
                        }
                      }}
                      placeholder="+91 9490123456 or email"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Generating Code..." : "Send Verification OTP"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-slate-500 mb-1">
                    6-Digit Verification Pin
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 text-lg text-center font-mono letter font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Authenticating..." : "Confirm Code"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="relative my-6 text-center">
          <hr className="border-slate-100" />
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Identity Integrations
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.41 7.59l3.79 2.94C6.12 7.55 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.18-2.01 3.71-4.98 3.71-8.61z"
            />
            <path
              fill="#FBBC05"
              d="M5.2 14.53c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.41 6.83C.51 8.65 0 10.66 0 12.78s.51 4.13 1.41 5.95l3.79-2.95z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.72-2.88c-1.04.7-2.38 1.12-3.93 1.12-3.16 0-5.88-2.51-6.8-5.49l-3.79 2.94C3.37 20.32 7.35 23 12 23z"
            />
          </svg>
          Continue with Google Secure Popup
        </button>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
          <span>Demo credentials? Use <b>password123</b> on any account.</span>
        </div>
      </div>
    </div>
  );
}
