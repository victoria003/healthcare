"use client";

import React, { useState, useEffect, useRef, useCallback } from"react";
import { motion, useInView, AnimatePresence } from"framer-motion";
import {
 ArrowRight, ChevronRight, Check, Plus,
 House, Building2, Stethoscope, Heart, Activity, Users,
 UserCheck, Shield, Eye, Zap, Clock,
 Menu, X, User
} from"lucide-react";
import { useRouter } from"next/navigation";

/* ============================================
 ANIMATION HELPERS
 ============================================ */

const fade = {
 hidden: { opacity: 0, y: 20 },
 visible: (i: number = 0) => ({
 opacity: 1,
 y: 0,
 transition: {
 delay: i * 0.1,
 duration: 0.5,
 ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
 },
 }),
};

const stagger = {
 hidden: {},
 visible: { transition: { staggerChildren: 0.08 } },
};

function Reveal({
 children,
 className,
 delay = 0,
}: {
 children: React.ReactNode;
 className?: string;
 delay?: number;
}) {
 const ref = useRef(null);
 const inView = useInView(ref, { once: true, margin:"-60px" });
 return (
 <motion.div
 ref={ref}
 initial={{ opacity: 0, y: 24 }}
 animate={inView ? { opacity: 1, y: 0 } : {}}
 transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
 className={className}
 >
 {children}
 </motion.div>
 );
}

/* ============================================
 SECTION DATA
 ============================================ */

const careChoices = [
 { icon: <Stethoscope size={22} />, title:"Nurses", sub:"Professional nursing care at home" },
 { icon: <UserCheck size={22} />, title:"Doctors", sub:"Qualified doctors for home visits" },
 { icon: <Heart size={22} />, title:"Caregivers", sub:"Compassionate daily assistance" },
 { icon: <Activity size={22} />, title:"Physiotherapists", sub:"Rehabilitation and recovery" },
 { icon: <Users size={22} />, title:"Patient Attenders", sub:"Recovery and transition support" },
 { icon: <Building2 size={22} />, title:"Homecare Organizations", sub:"Registered care agencies" },
];

const filterChips = [
"Experience","Availability","Location","Language",
"Gender","Price","Verified","Independent","Organization",
];

const whyItems = [
 { icon: <Shield size={20} />, title:"Verified", desc:"Every profile goes through verification." },
 { icon: <Eye size={20} />, title:"Transparent", desc:"Know what you're booking before you decide." },
 { icon: <Clock size={20} />, title:"Flexible", desc:"Book care around your schedule." },
 { icon: <Zap size={20} />, title:"Reliable", desc:"Built around trust, not assumptions." },
];

const timelineSteps = [
 { num:"01", title:"Explore Care", desc:"Explore trusted services tailored to your needs" },
 { num:"02", title:"Login", desc:"Access your secure patient dashboard" },
 { num:"03", title:"Complete Profile", desc:"Set up details and emergency contacts" },
 { num:"04", title:"Explore Professionals", desc:"Browse and compare verified caregivers" },
 { num:"05", title:"Book Care", desc:"Schedule care visits with instant confirmation" },
 { num:"06", title:"Receive Care", desc:"Enjoy certified clinical support at your doorstep" },
];

const trustChecklist = [
 { title:"Identity Verification", desc:"Government ID verified for every professional." },
 { title:"Qualification Validation", desc:"Credentials and certifications confirmed." },
 { title:"Organization Verification", desc:"Registered agencies verified through official records." },
 { title:"Secure Booking", desc:"End-to-end encrypted booking process." },
 { title:"Reviews", desc:"Transparent feedback from real users." },
 { title:"Privacy", desc:"Your data is protected and never shared." },
];

const faqData = [
 { q:"How do I find the right care professional?", a:"Use our search and filter tools to browse verified professionals by service type, location, availability, and more. Each profile includes qualifications and reviews." },
 { q:"Are all professionals verified?", a:"Yes. Every professional on our platform goes through identity verification, credential validation, and background checks before they can accept bookings." },
 { q:"How does booking work?", a:"Once you find a suitable professional or organization, you can book directly through their profile. Choose a date, time, and service — confirmation is instant." },
 { q:"Can organizations register on the platform?", a:"Absolutely. Homecare agencies and organizations can register, manage their staff profiles, and receive bookings through our partner portal." },
 { q:"Is my data secure?", a:"We use industry-standard encryption and never share your personal information with third parties. Your privacy is our priority." },
];

/* ============================================
 ROLE CHOOSER MODAL
 ============================================ */

const roleOptions = [
 {
 icon: <House size={24} />,
 title:"Patient Login",
 desc:"Find and manage your care.",
 href:"/patient/login",
 },
 {
 icon: <Building2 size={24} />,
 title:"Agency Login",
 desc:"Manage your organization and team.",
 href:"/agency/login",
 },
 {
 icon: <Stethoscope size={24} />,
 title:"Professional Login",
 desc:"Access your schedule and profile.",
 href:"/professional/login",
 },
];

function RoleChooserModal({ onClose }: { onClose: () => void }) {
 const router = useRouter();

 useEffect(() => {
 const onKey = (e: KeyboardEvent) => {
 if (e.key ==="Escape") onClose();
 };
 document.addEventListener("keydown", onKey);
 document.body.style.overflow ="hidden";
 return () => {
 document.removeEventListener("keydown", onKey);
 document.body.style.overflow ="";
 };
 }, [onClose]);

 const handleSelect = (href: string) => {
 router.push(href);
 onClose();
 };

 return (
 <motion.div
 className="role-modal-overlay"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 onClick={onClose}
 role="dialog"
 aria-modal="true"
 aria-label="Choose Your Login"
 >
 <motion.div
 className="role-modal"
 initial={{ opacity: 0, y: 20, scale: 0.97 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.97 }}
 transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
 onClick={(e) => e.stopPropagation()}
 >
 <button
 className="role-modal-close"
 onClick={onClose}
 aria-label="Close modal"
 >
 <X size={20} />
 </button>

 <h3 className="role-modal-title">Choose Your Login</h3>
 <p className="role-modal-subtitle">Select your role to continue.</p>

 <div className="role-modal-options">
 {roleOptions.map((opt) => (
 <button
 key={opt.href}
 className="role-modal-option"
 onClick={() => handleSelect(opt.href)}
 >
 <div className="role-modal-option-icon">{opt.icon}</div>
 <div className="role-modal-option-text">
 <span className="role-modal-option-title">{opt.title}</span>
 <span className="role-modal-option-desc">{opt.desc}</span>
 </div>
 <ArrowRight size={16} className="role-modal-option-arrow" />
 </button>
 ))}
 </div>
 </motion.div>
 </motion.div>
 );
}

/* ============================================
 FAQ ITEM
 ============================================ */

function FaqItem({ q, a }: { q: string; a: string }) {
 const [open, setOpen] = useState(false);
 return (
 <div className="faq-item">
 <button className="faq-question" onClick={() => setOpen(!open)}>
 {q}
 <Plus size={20} className={`faq-icon ${open ?"open" :""}`} />
 </button>
 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height:"auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.25 }}
 style={{ overflow:"hidden" }}
 >
 <p className="faq-answer">{a}</p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}

/* ============================================
 FEATURED PLACEHOLDER CARD
 ============================================ */

function FeaturedPlaceholder({ type }: { type:"pro" |"org" }) {
 return (
 <div className="featured-card">
 <div className="featured-card-img">
 <div className="featured-card-img-inner">
 {type ==="pro" ? <User size={40} /> : <Building2 size={40} />}
 </div>
 <span className={`featured-card-badge ${type ==="pro" ?"badge-pro" :"badge-org"}`}>
 {type ==="pro" ?"Professional" :"Organization"}
 </span>
 </div>
 <div className="featured-card-body">
 <div className="placeholder-line w-60" style={{ marginBottom: 8 }} />
 <div className="placeholder-line w-80" style={{ marginBottom: 8, height: 12 }} />
 <div className="placeholder-line w-40" style={{ marginBottom: 12, height: 10 }} />
 <div className="featured-card-avail">Availability placeholder</div>
 <div className="featured-card-actions">
 <button className="btn-outline">View Profile</button>
 <button className="btn-fill">Book</button>
 </div>
 </div>
 </div>
 );
}

/* ============================================
 STORY PLACEHOLDER
 ============================================ */

function StoryPlaceholder() {
 return (
 <div className="story-card">
 <div className="story-avatar"><User size={22} /></div>
 <div className="story-image-placeholder" />
 <p className="story-quote">&ldquo;Story placeholder for a future verified experience.&rdquo;</p>
 <div className="placeholder-line w-40" style={{ marginBottom: 4 }} />
 <div className="placeholder-line w-60" style={{ height: 12 }} />
 </div>
 );
}

/* ============================================
 HERO CARD WITH RIPPLE
 ============================================ */

function HeroCard({
 icon,
 title,
 desc,
 href,
 index,
}: {
 icon: React.ReactNode;
 title: string;
 desc: string;
 href: string;
 index: number;
}) {
 const router = useRouter();
 const cardRef = useRef<HTMLDivElement>(null);
 const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

 const handleClick = useCallback(
 (e: React.MouseEvent<HTMLDivElement>) => {
 const rect = cardRef.current?.getBoundingClientRect();
 if (rect) {
 setRipple({
 x: e.clientX - rect.left,
 y: e.clientY - rect.top,
 key: Date.now(),
 });
 }
 setTimeout(() => {
 router.push(href);
 }, 400);
 },
 [href, router]
 );

 return (
 <motion.div
 ref={cardRef}
 className="hero-card"
 variants={fade}
 custom={index + 2}
 whileHover={{ y: -6 }}
 onClick={handleClick}
 role="link"
 tabIndex={0}
 aria-label={`${title} — ${desc}`}
 onKeyDown={(e) => {
 if (e.key ==="Enter" || e.key ==="") {
 e.preventDefault();
 router.push(href);
 }
 }}
 >
 {ripple && (
 <span
 key={ripple.key}
 className="hero-card-ripple"
 style={{ left: ripple.x, top: ripple.y }}
 />
 )}
 <div className="hero-card-icon">{icon}</div>
 <div className="hero-card-title">{title}</div>
 <div className="hero-card-desc">{desc}</div>
 <span className="hero-card-cta">
 Continue <ArrowRight size={15} />
 </span>
 </motion.div>
 );
}

/* ============================================
 HOMEPAGE
 ============================================ */

export default function HomePage() {
 const [scrolled, setScrolled] = useState(false);
 const [drawerOpen, setDrawerOpen] = useState(false);
 const [modalOpen, setModalOpen] = useState(false);
 const [sfData, setSfData] = useState<any>(null);

 useEffect(() => {
 const onScroll = () => setScrolled(window.scrollY > 20);
 window.addEventListener("scroll", onScroll);
 
 // Fetch Snowflake Data
 fetch("/api/snowflake/homepage")
 .then(res => res.json())
 .then(data => {
 if (data.success) {
 setSfData(data);
 }
 })
 .catch(console.error);

 return () => window.removeEventListener("scroll", onScroll);
 }, []);

 return (
 <>
 {/* ── NAVBAR ── */}
 <nav className={`nav ${scrolled ?"scrolled" :""}`}>
 <div className="nav-inner">
 <a href="/" className="nav-logo">
 <span className="nav-logo-main">HomeCare</span>
 <span className="nav-logo-sub">MARKETPLACE</span>
 </a>

 <div className="nav-links">
 <a href="#care" className="nav-link">Explore Care</a>
 <a href="/agency/login" className="nav-link">Partner With Us</a>
 <a href="#trust" className="nav-link">About</a>
 <a href="#faq" className="nav-link">Support</a>
 </div>

 <div className="nav-actions">
 <button className="btn-ghost" onClick={() => setModalOpen(true)}>Login</button>
 </div>

 <button className="nav-toggle" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
 <Menu size={24} />
 </button>
 </div>
 </nav>

 {/* Mobile Drawer */}
 <AnimatePresence>
 {drawerOpen && (
 <div className="mobile-drawer">
 <motion.div
 className="mobile-drawer-overlay"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setDrawerOpen(false)}
 />
 <motion.div
 className="mobile-drawer-panel"
 initial={{ x:"100%" }}
 animate={{ x: 0 }}
 exit={{ x:"100%" }}
 transition={{ type:"spring", damping: 30, stiffness: 300 }}
 >
 <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
 <X size={24} />
 </button>
 <a href="#care" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Explore Care</a>
 <a href="/agency/login" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Partner With Us</a>
 <a href="#trust" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>About</a>
 <a href="#faq" className="mobile-drawer-link" onClick={() => setDrawerOpen(false)}>Support</a>
 <div className="mobile-drawer-actions">
 <button className="btn-ghost" onClick={() => { setDrawerOpen(false); setModalOpen(true); }}>Login</button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Role Chooser Modal */}
 <AnimatePresence>
 {modalOpen && <RoleChooserModal onClose={() => setModalOpen(false)} />}
 </AnimatePresence>

 {/* ── HERO ── */}
 <section className="hero">
 <div className="container">
 <motion.h1
 className="hero-headline"
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
 >
 Bringing Trusted Care Closer to Home
 </motion.h1>

 <motion.p
 className="hero-sub"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
 >
 Designed for the moments when finding the right care matters most.
 </motion.p>

 <motion.div
 className="hero-cards"
 variants={stagger}
 initial="hidden"
 animate="visible"
 >
 <HeroCard
 icon={<House size={24} />}
 title="Explore Care"
 desc="Explore trusted homecare services tailored to your needs."
 href="/patient/login"
 index={0}
 />
 <HeroCard
 icon={<Building2 size={24} />}
 title="Partner With Us"
 desc="Grow your organization through meaningful opportunities."
 href="/agency/login"
 index={1}
 />
 <HeroCard
 icon={<Stethoscope size={24} />}
 title="Join as Professional"
 desc="Create your profile and start your journey."
 href="/professional/login"
 index={2}
 />
 </motion.div>
 </div>
 </section>

 {/* ── CARE STARTS WITH CHOICE ── */}
 <section id="care" className="section">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">Care Starts with Choice</h2>
 <p className="section-subtitle">
 Explore verified professionals and organizations across every care category.
 </p>
 </div>
 </Reveal>

 <motion.div
 className="choice-grid"
 variants={stagger}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin:"-60px" }}
 >
 {careChoices.map((c, i) => (
 <motion.div
 key={c.title}
 className="choice-card"
 variants={fade}
 custom={i}
 whileHover={{ y: -6, scale: 1.01 }}
 style={{ cursor:"default" }}
 >
 <div className="choice-card-icon">{c.icon}</div>
 <h3>{c.title}</h3>
 <p>{c.sub}</p>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>

 {/* ── WHY PEOPLE CHOOSE US ── */}
 <section className="section section-alt">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">Why People Choose Us</h2>
 </div>
 </Reveal>

 <motion.div
 className="why-grid"
 variants={stagger}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin:"-60px" }}
 >
 {whyItems.map((w, i) => (
 <motion.div key={w.title} className="why-card" variants={fade} custom={i}>
 <div className="why-card-icon">{w.icon}</div>
 <h4>{w.title}</h4>
 <p>{w.desc}</p>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>

 {/* ── HOW IT WORKS ── */}
 <section className="section">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">How It Works</h2>
 <p className="section-subtitle">Five steps to quality care at home.</p>
 </div>
 </Reveal>

 <motion.div
 className="timeline"
 variants={stagger}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin:"-60px" }}
 >
 {timelineSteps.map((step, i) => (
 <motion.div key={step.num} className="timeline-step" variants={fade} custom={i}>
 <div className="timeline-dot">{step.num}</div>
 {i < timelineSteps.length - 1 && <div className="timeline-connector" />}
 <h4>{step.title}</h4>
 <p>{step.desc}</p>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>

 {/* ── DESIGNED AROUND TRUST ── */}
 <section id="trust" className="section section-alt">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">Designed Around Trust</h2>
 <p className="section-subtitle">
 Every layer of our platform is built to protect you.
 </p>
 </div>
 </Reveal>

 <div className="trust-split">
 <Reveal>
 <div className="trust-illustration">🛡️</div>
 </Reveal>

 <div className="trust-checklist">
 {trustChecklist.map((item, i) => (
 <Reveal key={item.title} delay={i * 0.08}>
 <div className="trust-item">
 <div className="trust-check">
 <Check size={14} />
 </div>
 <div>
 <h4>{item.title}</h4>
 <p>{item.desc}</p>
 </div>
 </div>
 </Reveal>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* ── STORIES OF CARE ── */}
 <section className="section">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">Stories of Care</h2>
 <p className="section-subtitle">
 Real experiences from people who found the right care.
 </p>
 </div>
 </Reveal>

 <Reveal delay={0.1}>
 <div className="stories-track">
 {sfData && sfData.testimonials && sfData.testimonials.length > 0 ? (
 sfData.testimonials.map((t: any, idx: number) => (
 <div key={idx} className="story-card bg-white p-6 rounded-2xl shadow-sm border border-border-light">
 <div className="story-avatar mb-4 text-accent"><User size={28} /></div>
 <p className="story-quote text-text-secondary italic font-medium mb-4">&ldquo;{t.quote}&rdquo;</p>
 <div className="text-base font-bold text-primary">{t.author}</div>
 <div className="text-sm text-text-tertiary">{t.role} • {t.location}</div>
 </div>
 ))
 ) : (
 <>
 <StoryPlaceholder />
 <StoryPlaceholder />
 <StoryPlaceholder />
 </>
 )}
 </div>
 </Reveal>
 </div>
 </section>

 {/* ── FEATURED AGENCIES (SNOWFLAKE) ── */}
 {sfData && sfData.agencies && sfData.agencies.length > 0 && (
 <section className="section bg-bg-alt">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">Verified Agencies</h2>
 <p className="section-subtitle">Powered by Snowflake live data</p>
 </div>
 </Reveal>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
 {sfData.agencies.slice(0, 3).map((agency: any) => (
 <div key={agency.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-150 hover:shadow-md transition-shadow">
 <div className="flex items-center gap-6 mb-4">
 <div className="p-3 bg-accent-light text-accent rounded-xl">
 <Building2 size={24} />
 </div>
 <div>
 <h4 className="font-bold text-primary">{agency.name}</h4>
 <p className="text-sm text-text-tertiary">{agency.city}, {agency.state}</p>
 </div>
 </div>
 <p className="text-base text-text-secondary line-clamp-3 mb-4">{agency.description ||"Providing quality healthcare services."}</p>
 <div className="flex justify-between items-center text-sm font-semibold text-text-tertiary">
 <span>{agency.rating} / 5.0 Rating</span>
 <span className="text-accent px-3 py-2 bg-accent-light rounded-lg">{agency.verified ?"Verified" :"Pending"}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* ── FAQ ── */}
 <section id="faq" className="section">
 <div className="container">
 <Reveal>
 <div className="section-header">
 <h2 className="section-title">Frequently Asked Questions</h2>
 </div>
 </Reveal>

 <Reveal delay={0.1}>
 <div className="faq-list">
 {faqData.map((f) => (
 <FaqItem key={f.q} q={f.q} a={f.a} />
 ))}
 </div>
 </Reveal>
 </div>
 </section>

 {/* ── FOOTER ── */}
 <footer className="footer">
 <div className="container">
 <div className="footer-grid">
 <div className="footer-brand">
 <div className="nav-logo">
 <span className="nav-logo-main" style={{ color:"#fff" }}>HomeCare</span>
 <span className="nav-logo-sub">MARKETPLACE</span>
 </div>
 <p>Enterprise home healthcare marketplace connecting patients with verified professionals and organizations.</p>
 </div>

 <div className="footer-col">
 <h4>Platform</h4>
 <a href="#care">Explore Care</a>
 <a href="/agency/login">Partner With Us</a>
 <a href="#trust">About</a>
 <a href="#faq">Support</a>
 </div>

 <div className="footer-col">
 <h4>Explore Care</h4>
 <a href="/patient/login">Patients</a>
 <a href="/agency/login">Organizations</a>
 <a href="/professional/login">Professionals</a>
 </div>

 <div className="footer-col">
 <h4>Legal</h4>
 <a href="#">Privacy Policy</a>
 <a href="#">Terms of Service</a>
 <a href="#">Cookie Policy</a>
 </div>

 <div className="footer-col">
 <h4>Social</h4>
 <a href="#">Twitter</a>
 <a href="#">LinkedIn</a>
 <a href="#">Instagram</a>
 </div>
 </div>

 <div className="footer-bottom">
 <span>&copy; {new Date().getFullYear()} HomeCare Marketplace. All rights reserved.</span>
 <div className="footer-social">
 <a href="#" aria-label="Twitter">𝕏</a>
 <a href="#" aria-label="LinkedIn">in</a>
 <a href="#" aria-label="Instagram">📷</a>
 </div>
 </div>
 </div>
 </footer>
 </>
 );
}
