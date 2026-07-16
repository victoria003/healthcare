"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, MapPin, Star, ShieldCheck, Heart, UserCheck, Calendar, 
  ArrowRight, Shield, Clock, HelpCircle, ChevronDown, Check,
  Activity, Users, Award, Briefcase, Zap, AlertCircle
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  status: string;
}

interface MarketplaceSearchProps {
  onSelectAgency: (agency: Agency) => void;
}

export default function MarketplaceSearch({ onSelectAgency }: MarketplaceSearchProps) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic Snowflake States
  const [isConnected, setIsConnected] = useState(false);
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({});
  const [stats, setStats] = useState<{ completedShifts: string, responseTime: string, qualityRating: string } | null>(null);
  const [testimonials, setTestimonials] = useState<{ quote: string, author: string, role: string, location: string }[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [registering, setRegistering] = useState(false);

  const fetchHomepageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/snowflake/homepage");
      const data = await res.json();
      if (data.success) {
        setIsConnected(data.isConnected);
        setServiceCounts(data.serviceCounts || {});
        setStats(data.stats || null);
        setTestimonials(data.testimonials || []);
        setAllCities(data.cities || []);

        let list = data.agencies || [];
        if (city) {
          list = list.filter((a: Agency) => a.city.toLowerCase().includes(city.toLowerCase()));
        }
        if (query) {
          list = list.filter((a: Agency) =>
            a.name.toLowerCase().includes(query.toLowerCase()) ||
            a.description.toLowerCase().includes(query.toLowerCase())
          );
        }
        setAgencies(list);
      }
    } catch (err) {
      console.error("Error fetching Snowflake homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();

    // Listen for custom Snowflake connection events from upper layout strip
    const handleSfConnected = () => {
      fetchHomepageData();
    };
    window.addEventListener("snowflakeConnected", handleSfConnected);
    return () => {
      window.removeEventListener("snowflakeConnected", handleSfConnected);
    };
  }, [city, query]);

  const handleConnectSnowflake = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/snowflake/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: "hc_saas_cluster", username: "compliance_auditor" })
      });
      const data = await res.json();
      if (data.success) {
        await fetchHomepageData();
        // Notify other components
        window.dispatchEvent(new Event("snowflakeConnected"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleAddAgency = async () => {
    setRegistering(true);
    try {
      const res = await fetch("/api/agencies/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Sri Krishna Premium Care",
          description: "Top-tier ICU set up at home, post-operative specialized nursing, and elder companionship services in Hyderabad.",
          registrationNumber: "HYD-SNOW-2026-9012",
          gstNumber: "36AAAAA9912Q1ZX",
          panNumber: "AAAAA9912Q",
          ownerName: "Ankala Victoria Rani",
          phone: "+91 9490123456",
          email: "support@srikrishnacare.in",
          city: "Hyderabad",
          state: "Telangana",
          pincode: "500081",
          status: "approved" // Pre-approved so it appears instantly on Snowflake queries
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchHomepageData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  const categories = [
    { title: "ICU At Home", desc: "Critical care equipment & round-the-clock intensive care nursing.", icon: <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" /> },
    { title: "Post-Op Nursing", desc: "Wound care, medication control, injection support & clinical monitoring.", icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> },
    { title: "Elder Care", desc: "Companionship, activities of daily living support, and dementia assistance.", icon: <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" /> },
    { title: "Physiotherapy", desc: "Orthopedic, neurological, and post-accident athletic rehabilitation plans.", icon: <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" /> },
  ];

  const steps = [
    { number: "01", title: "Select Care Plan", desc: "Choose therapeutic category, ICU setups, or caregiver companionship matching your doctor's orders." },
    { number: "02", title: "Verify Credentials", desc: "Review vetted clinical agency credentials, insurance guidelines, and historical audit logs." },
    { number: "03", title: "Review & Settle", desc: "Approve pricing, select customized clinical timetables, and securely pay with instant digital receipts." },
    { number: "04", title: "Active Roster Monitoring", desc: "Track medical team attendance, daily clinical logs, and real-time care pathways through your dashboard." }
  ];

  const benefits = [
    { title: "Vetted Clinical Agencies", desc: "Every provider undergoes multi-stage licensing audits, background verification, and KYC confirmation before receiving active clinical status.", icon: <Shield className="w-6 h-6 text-teal-600" /> },
    { title: "24/7 Quality Desk", desc: "Dedicated patient support team and clinical advisors monitor schedules and assist during emergency care setups.", icon: <Clock className="w-6 h-6 text-indigo-600" /> },
    { title: "Interactive Audit Trail", desc: "Each visit status, biometric check, and care plan revision is permanently synced in our secure analytical architecture.", icon: <Award className="w-6 h-6 text-amber-600" /> },
  ];

  const faqs = [
    { q: "How are the home care agencies on your platform vetted?", a: "Every listed agency must upload active professional license certificates, owner PAN card details, and GST registrations. Our compliance team verifies all credentials and logs the verification audit inside our secure analytical database before approving active marketplace status." },
    { q: "Can I customize the treatment schedule for long-term care?", a: "Yes, once you select an agency, the Booking Engine allows you to schedule specific days, choose multiple care shifts (e.g. 12-hour or 24-hour schedules), and select staff specialties matching your prescription requirements." },
    { q: "What happens if a scheduled caregiver is unable to attend?", a: "Our platform features real-time scheduling tracking and automated backup routing. The partner agency immediately assigns a certified backup caregiver from their roster, keeping you notified of any shifts." },
    { q: "Are payments handled securely on the platform?", a: "Absolutely. All invoices and payroll ledgers are processed via encrypted financial pathways. Transparent invoice receipts with detailed GST splits are issued instantly on payment." }
  ];

  return (
    <div className="space-y-16">
      
      {/* 1. HERO & SEARCH CONTAINER */}
      <section className="relative bg-slate-900 rounded-3xl p-8 md:p-14 text-white overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)]" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider rounded-full"
          >
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
            Empowering Modern Homecare Delivery
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Find Certified Home <br />
            <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">Healthcare Agencies</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed"
          >
            Direct access to peer-reviewed ICU setups, post-operative nurses, elder care companions, and rehabilitation therapies. Vetted, scheduled, and tracked under one modern dashboard.
          </motion.p>

          {/* DUAL-INPUT SEARCH CONTAINER */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl md:rounded-3xl shadow-xl flex flex-col md:flex-row gap-2 max-w-2xl"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search treatments e.g., 'ICU', 'Post-Op', 'Dementia'"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 placeholder:text-slate-500 text-xs md:text-sm focus:outline-none focus:ring-0 focus:border-transparent"
              />
            </div>
            <div className="h-px md:h-10 w-full md:w-px bg-slate-800 self-center" />
            <div className="w-full md:w-52 relative">
              <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-teal-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Filter by City e.g., Hyderabad"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 placeholder:text-slate-500 text-xs md:text-sm focus:outline-none focus:ring-0 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* QUICK CHIPS */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] md:text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Quick Filters:</span>
            {[
              { label: "Dementia Care", query: "Dementia" },
              { label: "ICU Setup", query: "ICU" },
              { label: "Physiotherapy", query: "Therapy" },
              { label: "Post-Op Companion", query: "Post-Op" }
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => setQuery(chip.query)}
                className={`px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all ${
                  query === chip.query 
                  ? "bg-teal-500 border-teal-400 text-slate-950 shadow-md font-bold" 
                  : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {chip.label}
              </button>
            ))}
            {query && (
              <button 
                onClick={() => { setQuery(""); setCity(""); }} 
                className="text-teal-400 hover:text-teal-300 font-bold ml-1 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. POPULAR SERVICES GRID */}
      <section className="space-y-6">
        <div className="text-center md:text-left space-y-1">
          <span className="text-[10px] md:text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
            Comprehensive Medical Support
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Popular Specialty Care Categories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-xl">
            Choose specialized protocols built with leading medical institutions to guarantee clinical consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            // Dynamic count from Snowflake query pipeline
            const countValue = serviceCounts[cat.title];
            const countLabel = isConnected && countValue !== undefined 
              ? `${countValue} Provider${countValue === 1 ? "" : "s"}` 
              : "No data available";

            return (
              <motion.div
                whileHover={{ y: -4 }}
                key={cat.title}
                onClick={() => setQuery(cat.title.split(" ")[0])}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl w-fit group-hover:bg-teal-50 dark:group-hover:bg-teal-950/20 group-hover:border-teal-100 dark:group-hover:border-teal-900/40 transition-colors">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  <span>{countLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. CORE PROVIDERS MARKETPLACE LIST */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
              Direct Booking Access
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Available Clinical Agencies
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
              {isConnected ? `${agencies.length} pre-vetted Snowflake-logged agencies match your filters.` : "No data available"}
            </p>
          </div>
        </div>

        {/* Dynamic List Render with Skeleton Loading & Dedicated Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 w-1/2 rounded" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 w-24 rounded-full" />
                </div>
                <div className="h-14 bg-slate-100 dark:bg-slate-800/50 w-full rounded-2xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/3 rounded" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : !isConnected ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-sm">
            <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Snowflake Pipeline Disconnected</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 mb-6 leading-relaxed">
              To guarantee absolute clinical compliance and prevent fake listings, our marketplace runs entirely on real-time Snowflake warehouse synchronization.
            </p>
            <button
              onClick={handleConnectSnowflake}
              disabled={connecting}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
              {connecting ? "Initializing Pipeline..." : "Connect Snowflake"}
            </button>
          </div>
        ) : agencies.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-sm">
            <Heart className="w-12 h-12 text-teal-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Care Providers Found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 mb-6 leading-relaxed font-medium">
              Your Snowflake schema is connected but currently contains zero records matching your filters. Register your first compliant agency to populate Snowflake.
            </p>
            <button
              onClick={handleAddAgency}
              disabled={registering}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <PlusCircleIcon className="w-4 h-4 text-teal-200" />
              {registering ? "Registering Agency..." : "Add your first agency"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agencies.map((agency) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={agency.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        {agency.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-400 dark:text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {agency.city}, {agency.state} ({agency.pincode})
                        </span>
                      </div>
                    </div>

                    {agency.verified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 text-[10px] font-extrabold uppercase rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 text-[10px] font-extrabold uppercase rounded-full">
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 font-medium line-clamp-3 leading-relaxed">
                    {agency.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-slate-900 dark:text-white">{(agency.rating || 5.0).toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({agency.reviewCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>24/7 Clinical Desk</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => onSelectAgency(agency)}
                    className="w-full py-3 bg-slate-950 dark:bg-slate-800 hover:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Care Plan & Schedule
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-800/80 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] md:text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
            Streamlined Coordination
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            How Your Care Plan Executes
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
            From authorization to scheduled nursing attendance, every step is synchronized with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div key={st.number} className="relative space-y-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-xs">
              <span className="text-3xl font-black bg-gradient-to-br from-teal-400 to-indigo-500 bg-clip-text text-transparent font-mono">
                {st.number}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {st.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. IMPACT & STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          { label: "Completed Shifts", value: isConnected && stats ? stats.completedShifts : "No data available", detail: isConnected && stats ? "Vetted treatments monitored & logged." : "Connect Snowflake to fetch real shifts." },
          { label: "Average Response Time", value: isConnected && stats ? stats.responseTime : "No data available", detail: isConnected && stats ? "Clinical setup & dispatcher coordination." : "Connect Snowflake to fetch response time." },
          { label: "Quality Rating", value: isConnected && stats ? stats.qualityRating : "No data available", detail: isConnected && stats ? "Based on verified monthly patient reviews." : "Connect Snowflake to fetch quality rating." },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <span className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight block">
              {stat.value}
            </span>
            <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block mt-2">
              {stat.label}
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1 font-medium leading-normal">
              {stat.detail}
            </p>
          </div>
        ))}
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] md:text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
              Uncompromising Safety
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Enterprise Trust & Clinical Security
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
              We replace standard text coordination with a certified transactional engine. Each shift check-in, nurse assignment, and medical log is checked against regulatory benchmarks.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((ben) => (
              <div key={ben.title} className="flex gap-4 items-start">
                <div className="p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 rounded-xl shrink-0">
                  {ben.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">
                    {ben.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] md:text-xs mt-1 leading-relaxed">
                    {ben.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="space-y-1">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold uppercase px-2 py-0.5 rounded">
              Verified Patient Quote (Snowflake Feed)
            </span>
            <h3 className="text-lg font-bold pt-2">
              {isConnected && testimonials.length > 0 ? `"${testimonials[0].quote.slice(0, 48)}..."` : "No data available"}
            </h3>
          </div>

          {isConnected && testimonials.length > 0 ? (
            <>
              <p className="text-slate-300 text-xs leading-relaxed italic">
                "{testimonials[0].quote}"
              </p>
              <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                  {testimonials[0].author.slice(0, 2)}
                </div>
                <div>
                  <h5 className="font-bold text-xs">{testimonials[0].author}</h5>
                  <p className="text-[10px] text-slate-500">{testimonials[0].role}, {testimonials[0].location}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 pt-2">
              <p className="text-slate-400 text-xs leading-relaxed">
                No active testimonials are currently loaded from your Snowflake warehouse. Connect Snowflake to load vetted client reviews.
              </p>
              <button
                onClick={handleConnectSnowflake}
                disabled={connecting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700/50 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Connect Snowflake
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-[10px] md:text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
            Got Questions?
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
            Quick responses regarding licensing compliance, billing, and scheduling setups.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className="font-bold text-slate-900 dark:text-white text-xs md:text-sm">
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 pt-1 text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER SECTION */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-10 pb-6 text-slate-500 dark:text-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Heart className="w-5 h-5 text-teal-500 fill-teal-500" />
              <span className="font-extrabold text-sm tracking-tight">HomeCare Grid</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Enterprise SaaS Marketplace providing unified verification, compliance tracing, and automated dispatch operations for clinical home healthcare.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[10px]">Specialties</h5>
            <ul className="space-y-2 font-medium">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setQuery("ICU"); }} className="hover:text-teal-500 transition-colors">ICU setups at home</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setQuery("Nursing"); }} className="hover:text-teal-500 transition-colors">Specialized clinical nursing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setQuery("Elder"); }} className="hover:text-teal-500 transition-colors">Dementia & Elder Companionship</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setQuery("Therapy"); }} className="hover:text-teal-500 transition-colors">Neurological rehabilitation</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[10px]">Cities Serviced</h5>
            <ul className="space-y-2 font-medium">
              {isConnected && allCities.length > 0 ? (
                allCities.map((city) => (
                  <li key={city}>
                    <a href="#" onClick={(e) => { e.preventDefault(); setCity(city); }} className="hover:text-teal-500 transition-colors capitalize">
                      {city}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-slate-400 italic">No data available</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-[10px]">Legal & Audit</h5>
            <ul className="space-y-2 font-medium">
              <li><a href="#" className="hover:text-teal-500 transition-colors">Snowflake Compliance Schema</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Licensing Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Biometric Attendance Logs</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">GST Tax Audit Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-medium text-slate-400">
          <p>© 2026 HomeCare Grid Inc. All rights reserved. Registered under clinical compliance registries.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Compliance Desk</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

function PlusCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
