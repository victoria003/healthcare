"use client";

import React, { useState } from"react";
import { useRouter } from"next/navigation";
import { motion } from"framer-motion";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from"lucide-react";
import FormError from"@/components/forms/FormError";

type Role ="patient" |"agency" |"professional";

const roleLabels: Record<Role, string> = {
 patient:"Patient",
 agency:"Agency",
 professional:"Professional",
};

const roleMeta: Record<
 Role,
 {
 title: string;
 subtitle: string;
 fieldLabel: string;
 placeholder: string;
 primaryAction: string;
 secondaryAction: string;
 secondaryHref: string;
 forgotHref: string;
 }
> = {
 patient: {
 title:"Welcome Back",
 subtitle:"Sign in to find and manage your care.",
 fieldLabel:"Email or Mobile Number",
 placeholder:"you@example.com or +91 98765 43210",
 primaryAction:"Login",
 secondaryAction:"Create Patient Account",
 secondaryHref:"/patient/register",
 forgotHref:"/patient/forgot-password",
 },
 agency: {
 title:"Welcome Back",
 subtitle:"Manage your organization, team, and bookings.",
 fieldLabel:"Business Email",
 placeholder:"team@youragency.com",
 primaryAction:"Login",
 secondaryAction:"Register Agency",
 secondaryHref:"/agency/register",
 forgotHref:"/agency/forgot-password",
 },
 professional: {
 title:"Welcome Back",
 subtitle:"Access your schedule, bookings, and profile.",
 fieldLabel:"Email or Mobile Number",
 placeholder:"you@example.com or +91 98765 43210",
 primaryAction:"Login",
 secondaryAction:"Create Professional Account",
 secondaryHref:"/professional/register",
 forgotHref:"/professional/forgot-password",
 },
};

const roleDashboards: Record<Role, string> = {
 patient:"/patient/dashboard",
 agency:"/agency/dashboard",
 professional:"/professional/dashboard",
};

export default function RoleLoginView({ role ="patient" }: { role?: Role }) {
 const router = useRouter();
 const [identifier, setIdentifier] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const currentRole = role in roleLabels ? role :"patient";
 const meta = roleMeta[currentRole];

 const handleSubmit = async (event: React.FormEvent) => {
 event.preventDefault();
 setLoading(true);
 setError("");

 try {
 const response = await fetch("/api/auth/login", {
 method:"POST",
 headers: {"Content-Type":"application/json" },
 body: JSON.stringify({ email: identifier, password, role: currentRole }),
 });

 if (response.status === 404) {
 setError("Login endpoint not found.");
 return;
 }

 if (response.status === 500) {
 setError("Server error encountered during login.");
 return;
 }

 let data;
 try {
 data = await response.json();
 } catch (jsonErr) {
 setError(`Server returned status ${response.status}. Failed to parse response.`);
 return;
 }

 if (response.ok && data.success) {
 router.push(roleDashboards[currentRole]);
 } else {
 setError(data.message || data.error ||"Login failed. Please try again.");
 }
 } catch (networkErr) {
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
 transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
 >
 <a href="/" className="hc-login-back">
 <ArrowLeft size={16} /> Back to Home
 </a>

 <div className="hc-logo" aria-label="HomeCare Marketplace">
 <span className="hc-logo-main">HomeCare</span>
 <span className="hc-logo-sub">MARKETPLACE</span>
 </div>

 <div className="hc-login-badge">
 <ShieldCheck size={16} /> {roleLabels[currentRole]} Sign In
 </div>

 <h2>{meta.title}</h2>
 <p className="hc-login-subtitle">{meta.subtitle}</p>

 <FormError message={error} className="mb-5" />

 <form onSubmit={handleSubmit} className="hc-login-form">
 <div className="hc-form-group">
 <label htmlFor="identifier">{meta.fieldLabel}</label>
 <input
 id="identifier"
 name="identifier"
 type="text"
 value={identifier}
 onChange={(event) => setIdentifier(event.target.value)}
 placeholder={meta.placeholder}
 autoComplete="username"
 required
 />
 </div>

 <div className="hc-form-group hc-form-group-password">
 <label htmlFor="password">Password</label>
 <input
 id="password"
 name="password"
 type={showPassword ?"text" :"password"}
 value={password}
 onChange={(event) => setPassword(event.target.value)}
 placeholder="Enter your password"
 autoComplete="current-password"
 required
 />
 <button
 type="button"
 className="hc-password-toggle"
 onClick={() => setShowPassword((value) => !value)}
 aria-label={showPassword ?"Hide password" :"Show password"}
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>

 <button type="submit" className="hc-login-btn" disabled={loading}>
 {loading ?"Signing in..." : meta.primaryAction}
 </button>

 <a href={meta.secondaryHref} className="hc-login-btn hc-login-btn-secondary">
 {meta.secondaryAction}
 </a>
 </form>

 <div className="hc-login-links">
 <a href={meta.forgotHref}>Forgot Password</a>
 </div>
 </motion.div>
 </div>
 );
}
