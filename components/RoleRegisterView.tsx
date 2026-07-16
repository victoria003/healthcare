"use client";

import React, { useState } from"react";
import { useRouter } from"next/navigation";
import { motion } from"framer-motion";
import { ArrowLeft, Eye, EyeOff, UserPlus } from"lucide-react";
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
 nameLabel: string;
 namePlaceholder: string;
 emailLabel: string;
 emailPlaceholder: string;
 showPhone: boolean;
 loginHref: string;
 }
> = {
 patient: {
 title:"Create Patient Account",
 subtitle:"Join to find and manage trusted homecare services.",
 nameLabel:"Full Name",
 namePlaceholder:"Your full name",
 emailLabel:"Email or Mobile Number",
 emailPlaceholder:"you@example.com or +91 98765 43210",
 showPhone: false,
 loginHref:"/patient/login",
 },
 agency: {
 title:"Register Agency",
 subtitle:"Set up your organization and start receiving bookings.",
 nameLabel:"Organization Name",
 namePlaceholder:"Your agency or organization name",
 emailLabel:"Business Email",
 emailPlaceholder:"team@youragency.com",
 showPhone: true,
 loginHref:"/agency/login",
 },
 professional: {
 title:"Create Professional Account",
 subtitle:"Build your profile and connect with care seekers.",
 nameLabel:"Full Name",
 namePlaceholder:"Your full name",
 emailLabel:"Email or Mobile Number",
 emailPlaceholder:"you@example.com or +91 98765 43210",
 showPhone: false,
 loginHref:"/professional/login",
 },
};

const roleDashboards: Record<Role, string> = {
 patient:"/patient/dashboard",
 agency:"/agency/dashboard",
 professional:"/professional/dashboard",
};

export default function RoleRegisterView({ role ="patient" }: { role?: Role }) {
 const router = useRouter();
 const [fullName, setFullName] = useState("");
 const [email, setEmail] = useState("");
 const [phone, setPhone] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirm, setShowConfirm] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

 const currentRole = role in roleLabels ? role :"patient";
 const meta = roleMeta[currentRole];

 const handleSubmit = async (event: React.FormEvent) => {
 event.preventDefault();
 setError("");

 if (password !== confirmPassword) {
 setError("Passwords do not match.");
 return;
 }

 if (password.length < 6) {
 setError("Password must be at least 6 characters.");
 return;
 }

 setLoading(true);

 try {
 const response = await fetch("/api/auth/register", {
 method:"POST",
 headers: {"Content-Type":"application/json" },
 body: JSON.stringify({
 email,
 password,
 fullName,
 phone: phone || undefined,
 role: roleLabels[currentRole],
 }),
 });

 if (response.status === 404) {
 setError("Registration endpoint not found.");
 return;
 }

 if (response.status === 500) {
 setError("Unable to create account.");
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
 setError(data.error || data.message ||"Registration failed. Please try again.");
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
 <UserPlus size={16} /> {roleLabels[currentRole]} Registration
 </div>

 <h2>{meta.title}</h2>
 <p className="hc-login-subtitle">{meta.subtitle}</p>

 <FormError message={error} className="mb-5" />

 <form onSubmit={handleSubmit} className="hc-login-form">
 <div className="hc-form-group">
 <label htmlFor="fullName">{meta.nameLabel}</label>
 <input
 id="fullName"
 name="fullName"
 type="text"
 value={fullName}
 onChange={(event) => setFullName(event.target.value)}
 placeholder={meta.namePlaceholder}
 autoComplete="name"
 required
 />
 </div>

 <div className="hc-form-group">
 <label htmlFor="email">{meta.emailLabel}</label>
 <input
 id="email"
 name="email"
 type="text"
 value={email}
 onChange={(event) => setEmail(event.target.value)}
 placeholder={meta.emailPlaceholder}
 autoComplete="email"
 required
 />
 </div>

 {meta.showPhone && (
 <div className="hc-form-group">
 <label htmlFor="phone">Phone Number</label>
 <input
 id="phone"
 name="phone"
 type="tel"
 value={phone}
 onChange={(event) => setPhone(event.target.value)}
 placeholder="+91 98765 43210"
 autoComplete="tel"
 />
 </div>
 )}

 <div className="hc-form-group hc-form-group-password">
 <label htmlFor="password">Password</label>
 <input
 id="password"
 name="password"
 type={showPassword ?"text" :"password"}
 value={password}
 onChange={(event) => setPassword(event.target.value)}
 placeholder="Create a password"
 autoComplete="new-password"
 required
 />
 <button
 type="button"
 className="hc-password-toggle"
 onClick={() => setShowPassword((v) => !v)}
 aria-label={showPassword ?"Hide password" :"Show password"}
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>

 <div className="hc-form-group hc-form-group-password">
 <label htmlFor="confirmPassword">Confirm Password</label>
 <input
 id="confirmPassword"
 name="confirmPassword"
 type={showConfirm ?"text" :"password"}
 value={confirmPassword}
 onChange={(event) => setConfirmPassword(event.target.value)}
 placeholder="Confirm your password"
 autoComplete="new-password"
 required
 />
 <button
 type="button"
 className="hc-password-toggle"
 onClick={() => setShowConfirm((v) => !v)}
 aria-label={showConfirm ?"Hide password" :"Show password"}
 >
 {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>
 </div>

 <button type="submit" className="hc-login-btn" disabled={loading}>
 {loading ?"Creating account..." : meta.title}
 </button>
 </form>

 <div className="hc-login-links">
 Already have an account?{""}
 <a href={meta.loginHref}>Sign in</a>
 </div>
 </motion.div>
 </div>
 );
}
