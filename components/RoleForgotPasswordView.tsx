"use client";

import React, { useState } from"react";
import { motion } from"framer-motion";
import { ArrowLeft, Mail, CheckCircle } from"lucide-react";
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
 subtitle: string;
 fieldLabel: string;
 placeholder: string;
 loginHref: string;
 }
> = {
 patient: {
 subtitle:"Enter your email or mobile number to reset your password.",
 fieldLabel:"Email or Mobile Number",
 placeholder:"you@example.com or +91 98765 43210",
 loginHref:"/patient/login",
 },
 agency: {
 subtitle:"Enter your business email to reset your password.",
 fieldLabel:"Business Email",
 placeholder:"team@youragency.com",
 loginHref:"/agency/login",
 },
 professional: {
 subtitle:"Enter your email or mobile number to reset your password.",
 fieldLabel:"Email or Mobile Number",
 placeholder:"you@example.com or +91 98765 43210",
 loginHref:"/professional/login",
 },
};

export default function RoleForgotPasswordView({ role ="patient" }: { role?: Role }) {
 const [identifier, setIdentifier] = useState("");
 const [loading, setLoading] = useState(false);
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState("");

 const currentRole = role in roleLabels ? role :"patient";
 const meta = roleMeta[currentRole];

 const handleSubmit = async (event: React.FormEvent) => {
 event.preventDefault();
 setError("");
 setLoading(true);

 try {
 // Simulate API call — no existing password reset endpoint
 await new Promise((resolve) => setTimeout(resolve, 1200));
 setSubmitted(true);
 } catch {
 setError("Something went wrong. Please try again.");
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
 <a href={meta.loginHref} className="hc-login-back">
 <ArrowLeft size={16} /> Back to Login
 </a>

 <div className="hc-logo" aria-label="HomeCare Marketplace">
 <span className="hc-logo-main">HomeCare</span>
 <span className="hc-logo-sub">MARKETPLACE</span>
 </div>

 <div className="hc-login-badge">
 <Mail size={16} /> {roleLabels[currentRole]} Password Reset
 </div>

 <h2>Forgot Password</h2>
 <p className="hc-login-subtitle">{meta.subtitle}</p>

 {submitted ? (
 <motion.div
 className="hc-forgot-success"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.3 }}
 >
 <CheckCircle size={40} />
 <h3>Check your inbox</h3>
 <p>
 If an account exists with that email, we&apos;ve sent a password reset link.
 Please check your email and follow the instructions.
 </p>
 <a href={meta.loginHref} className="hc-login-btn" style={{ marginTop: 16 }}>
 Back to Login
 </a>
 </motion.div>
 ) : (
 <>
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
 autoComplete="email"
 required
 />
 </div>

 <button type="submit" className="hc-login-btn" disabled={loading}>
 {loading ?"Sending..." :"Send Reset Link"}
 </button>
 </form>

 <div className="hc-login-links">
 Remember your password?{""}
 <a href={meta.loginHref}>Sign in</a>
 </div>
 </>
 )}
 </motion.div>
 </div>
 );
}
