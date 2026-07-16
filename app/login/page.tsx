"use client";

import React, { useState, useEffect, Suspense } from"react";
import { useSearchParams, useRouter } from"next/navigation";
import { motion } from"framer-motion";
import { ArrowLeft, Eye, EyeOff } from"lucide-react";

const roleLabels: Record<string, string> = {
 patient:"Patient",
 nurse:"Certified Nurse",
 caregiver:"Caregiver",
 physiotherapist:"Physiotherapist",
 doctor:"Doctor",
 attender:"Patient Attender",
"patient-attender":"Patient Attender",
 agency:"HomeCare Agency",
 hospital:"Hospital",
 diagnostic:"Diagnostic Partner",
"social-worker":"Medical Social Worker",
 vendor:"Medical Equipment Vendor",
 insurance:"Insurance Partner",
 volunteer:"Volunteer",
 staff:"Staff",
 admin:"Admin",
};

const roleDashboards: Record<string, string> = {
 patient:"/patient/dashboard",
 nurse:"/nurse/dashboard",
 caregiver:"/caregiver/dashboard",
 physiotherapist:"/physiotherapist/dashboard",
 doctor:"/doctor/dashboard",
 attender:"/attender/dashboard",
"patient-attender":"/patient-attender/dashboard",
 agency:"/agency/dashboard",
 hospital:"/hospital/dashboard",
 diagnostic:"/diagnostic/dashboard",
"social-worker":"/social-worker/dashboard",
 vendor:"/vendor/dashboard",
 insurance:"/insurance/dashboard",
 volunteer:"/volunteer/dashboard",
 staff:"/staff/dashboard",
 admin:"/admin/dashboard",
};

function LoginForm() {
 const searchParams = useSearchParams();
 const router = useRouter();
 const roleParam = searchParams.get("role") ||"patient";

 const [role, setRole] = useState(roleParam);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 useEffect(() => {
 setRole(roleParam);
 }, [roleParam]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError("");

 try {
 const res = await fetch("/api/auth/login", {
 method:"POST",
 headers: {"Content-Type":"application/json" },
 body: JSON.stringify({ email, password, role }),
 });

 const data = await res.json();

 if (data.success) {
 const dashboardPath = roleDashboards[role] ||"/patient/dashboard";
 router.push(dashboardPath);
 } else {
 setError(data.message ||"Login failed. Please try again.");
 }
 } catch {
 setError("Network error. Please check your connection.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="hc-login-wrapper">
 <motion.div
 className="hc-login-card"
 initial={{ opacity: 0, y: 24 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 >
 <a href="/" style={{ display:"inline-flex", alignItems:"center", gap: 6, fontSize: 14, fontWeight: 600, color:"var(--text-secondary)", marginBottom: 28, textDecoration:"none" }}>
 <ArrowLeft size={16} /> Back to Home
 </a>

 <div style={{ marginBottom: 8 }}>
 <div className="hc-logo" style={{ marginBottom: 24 }}>
 <span className="hc-logo-main">HomeCare</span>
 <span className="hc-logo-sub">MARKETPLACE</span>
 </div>
 </div>

 <h2>Welcome Back</h2>
 <p className="subtitle">
 Sign in as <strong style={{ color:"var(--accent)" }}>{roleLabels[role] ||"User"}</strong> to continue.
 </p>

 {error && (
 <div style={{
 padding:"12px 16px",
 background:"#FEF2F2",
 border:"1px solid #FECACA",
 borderRadius: 8,
 color:"#DC2626",
 fontSize: 14,
 marginBottom: 20
 }}>
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit}>
 <div className="hc-form-group">
 <label>Role</label>
 <select value={role} onChange={(e) => setRole(e.target.value)}>
 {Object.entries(roleLabels).map(([key, label]) => (
 <option key={key} value={key}>{label}</option>
 ))}
 </select>
 </div>

 <div className="hc-form-group">
 <label>Email Address</label>
 <input
 type="email"
 placeholder="you@example.com"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 />
 </div>

 <div className="hc-form-group" style={{ position:"relative" }}>
 <label>Password</label>
 <input
 type={showPassword ?"text" :"password"}
 placeholder="Enter your password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 style={{
 position:"absolute",
 right: 12,
 top: 38,
 background:"none",
 color:"var(--text-secondary)",
 padding: 4
 }}
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>

 <button
 type="submit"
 className="hc-login-btn"
 disabled={loading}
 style={{ opacity: loading ? 0.7 : 1 }}
 >
 {loading ?"Signing in..." :"Sign In"}
 </button>
 </form>

 <p style={{
 textAlign:"center",
 marginTop: 24,
 fontSize: 14,
 color:"var(--text-secondary)"
 }}>
 Don&apos;t have an account?{""}
 <a href="#" style={{ color:"var(--accent)", fontWeight: 600 }}>
 Register here
 </a>
 </p>
 </motion.div>
 </div>
 );
}

export default function LoginPage() {
 return (
 <Suspense fallback={
 <div className="hc-login-wrapper">
 <div className="hc-login-card" style={{ textAlign:"center", padding: 60 }}>
 Loading...
 </div>
 </div>
 }>
 <LoginForm />
 </Suspense>
 );
}
