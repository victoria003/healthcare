"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import {
 Star,
 ShieldCheck,
 MapPin,
 Calendar,
 Award,
 Clock,
 ArrowLeft,
 Bookmark,
 Share2,
 AlertTriangle,
 GraduationCap,
 Briefcase,
 Heart,
 Globe,
 DollarSign,
 User,
 HeartHandshake
} from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import EmptyState from"@/components/dashboard/EmptyState";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { providerService, MockProfessional } from"@/lib/services/provider.service";

export default function ProviderProfilePage() {
 const params = useParams();
 const router = useRouter();
 const providerId = params ? (Array.isArray(params.id) ? params.id[0] : params.id) :"";

 const [provider, setProvider] = useState<MockProfessional | undefined>(undefined);
 const [similarProviders, setSimilarProviders] = useState<MockProfessional[]>([]);
 const [loading, setLoading] = useState(true);

 // States for interactive header features
 const [isBookmarked, setIsBookmarked] = useState(false);

 useEffect(() => {
 if (providerId) {
 setLoading(true);
 providerService.getProviderById(providerId)
 .then((data) => {
 setProvider(data);
 return providerService.getProviders();
 })
 .then((all) => {
 if (all) {
 // Filter to similar professionals (same category, excluding current)
 const filtered = all.filter((p) => p.id !== providerId).slice(0, 4);
 setSimilarProviders(filtered);
 }
 })
 .catch((err) => console.error("Error loading provider data:", err))
 .finally(() => setLoading(false));
 }
 }, [providerId]);

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 if (!provider) {
 return (
 <div className="space-y-12 max-w-[1440px] mx-auto w-full">
 <Breadcrumb
 items={[
 { label:"Home", href:"/patient/dashboard" },
 { label:"Explore Care", href:"/patient/explore" },
 { label:"Provider Profile" },
 ]}
 />
 <EmptyState
 icon={<AlertTriangle className="w-5 h-5" />}
 title="Provider not found"
 description="The requested professional profile could not be located."
 buttonLabel="Back to Explore"
 buttonLink="/patient/explore"
 />
 </div>
 );
 }

 // Categories services mapping
 const getServicesForCategory = (cat: string) => {
 const list = [
 { name:"Clinical Assessment", desc:"Detailed physiological parameters tracking and clinical vitals mapping.", duration:"1 Hour", price:"₹499" },
 { name:"Diagnostic Review", desc:"Inspection of prescription charts and lab diagnostics files for treatment alignments.", duration:"45 Mins", price:"₹399" },
 { name:"Home Consultation", desc:"Certified bedside assistance and clinical plan review in the comfort of your home.", duration:"1.5 Hours", price:"₹699" }
 ];
 if (cat ==="Nurses") {
 list[0] = { name:"Post-Op Wound Dressing", desc:"Surgical wound care, sterile dressing changes, and clinical monitoring.", duration:"45 Mins", price:"₹599" };
 list[1] = { name:"ICU Support Care Shift", desc:"Full shift tracheostomy management, IV administration, and bedside nursing.", duration:"8 Hours", price:"₹2,499" };
 } else if (cat ==="Physiotherapists") {
 list[0] = { name:"Rehabilitation Workout", desc:"Strength exercises, mobility training, and post-stroke movement recovery.", duration:"1 Hour", price:"₹649" };
 list[1] = { name:"Geriatric Mobility Therapy", desc:"Gentle balance mapping and pain management exercises for senior patients.", duration:"1 Hour", price:"₹599" };
 }
 return list;
 };

 const services = getServicesForCategory(provider.category);

 // Mock slot data separated by day periods
 const availabilitySlots = {
 morning: ["09:00 AM","09:30 AM","10:00 AM","11:00 AM"],
 afternoon: ["02:00 PM","02:30 PM","03:00 PM"],
 evening: ["05:00 PM","05:30 PM","06:00 PM"]
 };

 const reviewsList = [
 { name:"Arjun M.", date:"1 week ago", rating: 5, comment:"Extremely professional and patient. Guided me through my rehabilitation exercises carefully.", verified: true },
 { name:"Priya S.", date:"3 weeks ago", rating: 5, comment:"Punctual, clean, and clinical. Highly recommended care partner.", verified: true },
 { name:"Ramesh K.", date:"1 month ago", rating: 4, comment:"Very good bedside manner. Helped resolve diagnostic doubts clearly.", verified: false }
 ];

 return (
 <div className="space-y-16 max-w-[1440px] mx-auto w-full px-5 md:px-8 lg:px-10 py-6">
 {/* Breadcrumb Navigation */}
 <Breadcrumb
 items={[
 { label:"Home", href:"/patient/dashboard" },
 { label:"Explore Care", href:"/patient/explore" },
 { label: provider.fullName },
 ]}
 />

 {/* Main Two-column Profile Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
 
 {/* Left Side Content (70% - 7 spans) */}
 <div className="lg:col-span-7 space-y-16">
 
 {/* SECTION 1: Provider Header */}
 <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between pb-8 border-b border-border/60">
 <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
 {/* Profile Avatar Container */}
 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-3xl uppercase shrink-0 shadow-[0_4px_12px_rgba(234,88,12,0.15)]">
 {provider.fullName.charAt(0)}
 </div>
 
 <div className="space-y-2">
 <div className="flex flex-wrap items-center gap-6">
 <h1 className="text-3xl font-bold text-primary tracking-tight leading-tight">
 {provider.fullName}
 </h1>
 {provider.verified && (
 <span className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-full bg-accent-light text-accent text-sm font-semibold">
 <ShieldCheck className="w-3.5 h-3.5" />
 Verified Caregiver
 </span>
 )}
 </div>
 
 <p className="text-base text-text-tertiary font-medium">
 {provider.category} &middot; MSc Board Certified Clinical Partner
 </p>
 
 <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-base text-text-tertiary">
 <span className="flex items-center gap-1">
 <Award className="w-4 h-4 text-text-tertiary" />
 {provider.experience} Experience
 </span>
 <span className="text-white">&middot;</span>
 <span className="flex items-center gap-1">
 <MapPin className="w-4 h-4 text-text-tertiary" />
 Hyderabad, Telangana
 </span>
 <span className="text-white">&middot;</span>
 <span className="flex items-center gap-1 font-semibold text-accent-light">
 <Star className="w-4 h-4 fill-amber-500 text-accent-light" />
 {provider.rating.toFixed(1)} ({reviewsList.length} reviews)
 </span>
 </div>
 </div>
 </div>

 {/* Quick Actions (Bookmark, Share, Report) */}
 <div className="flex items-center gap-6">
 <button
 onClick={() => setIsBookmarked(!isBookmarked)}
 className={`p-2.5 rounded-xl border border-border transition-all hover:bg-bg-alt :bg-primary/50 ${
 isBookmarked ?"text-orange-550 border-accent-light bg-bg/10" :"text-slate-455"
 }`}
 title="Bookmark provider"
 >
 <Bookmark className="w-4 h-4" />
 </button>
 <button
 onClick={() => alert("Profile link copied to clipboard!")}
 className="p-2.5 rounded-xl border border-border text-slate-455 transition-all hover:bg-bg-alt :bg-primary/50"
 title="Share profile"
 >
 <Share2 className="w-4 h-4" />
 </button>
 <button
 onClick={() => alert("Report profile workflow triggered.")}
 className="p-2.5 rounded-xl border border-border text-slate-455 hover:text-rose-500 transition-all hover:bg-bg-alt :bg-primary/50"
 title="Report profile issues"
 >
 <AlertTriangle className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* SECTION 2: About Biography (Limit line length to 70 chars) */}
 <section className="space-y-4">
 <h2 className="text-2xl font-semibold text-primary tracking-tight">About Provider</h2>
 <div className="text-base text-slate-650 space-y-4 leading-relaxed max-w-[70ch]">
 <p>
 {provider.fullName} is a highly dedicated specialist in {provider.category}, bringing over {provider.experience} of certified clinical expertise to the HomeCare network. Recognized for a compassionate bedside manner and meticulous safety standards, they ensure every treatment aligns with isolated homecare best practices.
 </p>
 <p>
 <strong>Care Philosophy:</strong> I believe in providing high-quality healthcare that empowers individuals in their own homes, combining clinical precision with true patient advocacy and continuous recovery support.
 </p>
 </div>
 </section>

 {/* SECTION 3: Professional Info Chips */}
 <section className="space-y-4">
 <h2 className="text-2xl font-semibold text-primary tracking-tight">Professional Information</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 {[
 { icon: <GraduationCap className="w-4 h-4 text-accent-light" />, label:"Education", val:"BSc Nursing Specialization" },
 { icon: <Award className="w-4 h-4 text-accent-light" />, label:"License Number", val:"REG-2026-9481A" },
 { icon: <Briefcase className="w-4 h-4 text-accent-light" />, label:"Experience", val: provider.experience },
 { icon: <Globe className="w-4 h-4 text-accent-light" />, label:"Languages", val: provider.languages.join(",") },
 { icon: <User className="w-4 h-4 text-accent-light" />, label:"Gender", val:"Female" },
 { icon: <HeartHandshake className="w-4 h-4 text-accent-light" />, label:"Affiliation", val: provider.organization },
 ].map((info) => (
 <div key={info.label} className="flex gap-6 items-start p-6 bg-white [#12121a] border border-border/60 rounded-2xl shadow-xs">
 <div className="p-2 rounded-xl bg-bg shrink-0">
 {info.icon}
 </div>
 <div>
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">{info.label}</span>
 <span className="text-base font-semibold text-text-secondary block mt-0.5">{info.val}</span>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* SECTION 4: Services Offered */}
 <section className="space-y-4">
 <h2 className="text-2xl font-semibold text-primary tracking-tight">Services Offered</h2>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
 {services.map((svc) => (
 <DashboardCard key={svc.name} className="!p-8 flex flex-col justify-between h-full hover:shadow-md hover:border-accent-light/30 transition-all rounded-[24px]">
 <div>
 <h3 className="font-semibold text-lg text-primary leading-tight">{svc.name}</h3>
 <p className="text-base text-text-tertiary mt-2 leading-relaxed">{svc.desc}</p>
 </div>
 <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-border-light">
 <span className="flex items-center gap-1.5 text-sm text-text-tertiary font-medium">
 <Clock className="w-4 h-4 text-text-tertiary" />
 {svc.duration}
 </span>
 <span className="text-base font-semibold text-accent-light bg-bg px-3 py-2.5 rounded-lg">
 {svc.price}
 </span>
 </div>
 </DashboardCard>
 ))}
 </div>
 </section>

 {/* SECTION 5: Availability Calendar Slots */}
 <section className="space-y-4">
 <h2 className="text-2xl font-semibold text-primary tracking-tight">Availability</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white [#12121a] border border-border/60 rounded-[24px] p-6">
 {/* Morning slots */}
 <div className="space-y-3">
 <span className="text-base font-semibold text-text-secondary block">Morning Slots</span>
 <div className="flex flex-wrap gap-6">
 {availabilitySlots.morning.map((slot) => (
 <span key={slot} className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-accent-light text-accent border border-emerald-100/30">
 {slot}
 </span>
 ))}
 </div>
 </div>

 {/* Afternoon slots */}
 <div className="space-y-3">
 <span className="text-base font-semibold text-text-secondary block">Afternoon Slots</span>
 <div className="flex flex-wrap gap-6">
 {availabilitySlots.afternoon.map((slot) => (
 <span key={slot} className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-accent-light text-accent border border-emerald-100/30">
 {slot}
 </span>
 ))}
 </div>
 </div>

 {/* Evening slots */}
 <div className="space-y-3">
 <span className="text-base font-semibold text-text-secondary block">Evening Slots</span>
 <div className="flex flex-wrap gap-6">
 {availabilitySlots.evening.map((slot) => (
 <span key={slot} className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-accent-light text-accent border border-emerald-100/30">
 {slot}
 </span>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* SECTION 7: Reviews */}
 <section className="space-y-4">
 <h2 className="text-2xl font-semibold text-primary tracking-tight">Patient Reviews</h2>
 <div className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-xs">
 {/* Left distribution */}
 <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-6 md:border-r border-border-light">
 <span className="text-5xl font-bold text-primary">{provider.rating.toFixed(1)}</span>
 <div className="flex items-center gap-0.5 text-accent-light mt-2">
 <Star className="w-5 h-5 fill-amber-500" />
 <Star className="w-5 h-5 fill-amber-500" />
 <Star className="w-5 h-5 fill-amber-500" />
 <Star className="w-5 h-5 fill-amber-500" />
 <Star className="w-5 h-5 fill-amber-500" />
 </div>
 <span className="text-sm text-text-tertiary mt-2 font-medium">Based on 28 reviews</span>
 </div>

 {/* Right star bars */}
 <div className="md:col-span-3 space-y-2.5 text-sm text-text-tertiary self-center">
 {[
 { label:"5 Stars", pct:"90%" },
 { label:"4 Stars", pct:"8%" },
 { label:"3 Stars", pct:"2%" },
 { label:"2 Stars", pct:"0%" },
 ].map((row) => (
 <div key={row.label} className="flex items-center gap-6">
 <span className="w-12 text-text-tertiary">{row.label}</span>
 <div className="flex-1 h-2 bg-bg-alt rounded-full overflow-hidden">
 <div className="h-full bg-accent-light rounded-full" style={{ width: row.pct }} />
 </div>
 <span className="w-8 text-right font-semibold">{row.pct}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Individual review cards */}
 <div className="space-y-4">
 {reviewsList.map((rev) => (
 <div key={rev.name} className="bg-white [#12121a] border border-border/60 rounded-2xl p-8 shadow-xs">
 <div className="flex items-center justify-between gap-6">
 <div>
 <h4 className="text-base font-semibold text-primary">{rev.name}</h4>
 <p className="text-[12px] text-text-tertiary mt-0.5">{rev.date}</p>
 </div>
 <div className="flex items-center gap-1">
 {Array.from({ length: rev.rating }).map((_, idx) => (
 <Star key={idx} className="w-3.5 h-3.5 text-accent-light fill-amber-500" />
 ))}
 </div>
 </div>
 <p className="text-base text-text-secondary mt-3 leading-relaxed">{rev.comment}</p>
 {rev.verified && (
 <span className="inline-flex items-center gap-1 mt-3 text-base font-semibold text-accent">
 <ShieldCheck className="w-3.5 h-3.5" />
 Verified Patient Appointment
 </span>
 )}
 </div>
 ))}
 </div>
 </section>

 {/* SECTION 8: Related Providers */}
 {similarProviders.length > 0 && (
 <section className="space-y-4">
 <h2 className="text-2xl font-semibold text-primary tracking-tight">Similar Care Providers</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
 {similarProviders.map((p) => (
 <DashboardCard
 key={p.id}
 tabIndex={0}
 className="flex flex-col justify-between h-full hover:border-accent-light/50 relative rounded-[24px] focus:ring-2 focus:ring-accent focus:outline-none"
 >
 <div>
 <div className="flex items-start justify-between">
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl bg-bg text-accent-light flex items-center justify-center font-bold text-sm uppercase shrink-0">
 {p.fullName.charAt(0)}
 </div>
 <div>
 <h4 className="font-semibold text-sm text-primary flex items-center gap-1">
 {p.fullName}
 </h4>
 <p className="text-base text-slate-455 font-medium mt-0.5">{p.category}</p>
 </div>
 </div>

 <div className="flex items-center gap-0.5 bg-bg px-1.5 py-2.5 rounded text-accent-light text-base font-semibold shrink-0">
 <Star className="w-3 h-3 text-accent-light fill-amber-500" />
 {p.rating.toFixed(1)}
 </div>
 </div>

 <div className="border-t border-border-light my-3.5 pt-3 text-[12px] space-y-1.5 text-text-tertiary">
 <p className="flex justify-between">
 <span className="text-text-tertiary">Experience:</span>
 <span className="font-semibold text-text-secondary">{p.experience}</span>
 </p>
 <p className="flex justify-between">
 <span className="text-text-tertiary">Organization:</span>
 <span className="font-semibold text-text-secondary truncate max-w-[100px]">{p.organization}</span>
 </p>
 </div>
 </div>

 <div className="flex gap-6 mt-4 pt-3 border-t border-border-light">
 <PrimaryButton
 onClick={() => router.push(`/patient/provider/${p.id}`)}
 className="flex-1 !text-base py-2.5"
 aria-label={`View profile for ${p.fullName}`}
 >
 View Profile
 </PrimaryButton>
 </div>
 </DashboardCard>
 ))}
 </div>
 </section>
 )}
 </div>

 {/* Right Side Content (30% - 3 spans, Sticky booking card) */}
 <div className="lg:col-span-3 space-y-8 sticky top-24 z-20">
 
 {/* SECTION 6: Sticky Booking Card */}
 <div className="bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)] space-y-6">
 <div className="flex items-center gap-6">
 <div className="w-14 h-14 rounded-full bg-orange-655 text-white flex items-center justify-center font-bold text-xl uppercase shrink-0 shadow-sm">
 {provider.fullName.charAt(0)}
 </div>
 <div>
 <h3 className="font-semibold text-base text-primary leading-tight">
 {provider.fullName}
 </h3>
 <p className="text-sm text-text-tertiary mt-1">{provider.category}</p>
 <div className="flex items-center gap-1.5 text-sm text-text-tertiary mt-1.5">
 <Star className="w-3.5 h-3.5 text-accent-light fill-amber-500" />
 <span className="font-semibold text-primary">{provider.rating.toFixed(1)}</span>
 <span className="text-white">&middot;</span>
 <span>{reviewsList.length} reviews</span>
 </div>
 </div>
 </div>

 <div className="border-t border-b border-border-light py-4 space-y-3">
 <div className="flex justify-between items-center text-base">
 <span className="text-text-tertiary">Consultation Fee</span>
 <strong className="text-primary">Starting at ₹499/hr</strong>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-text-tertiary">Availability Status</span>
 <span className="inline-flex items-center gap-1.5 font-semibold text-accent bg-accent-light px-3.5 py-2 rounded-xl">
 <span className="w-1.5 h-1.5 rounded-full bg-accent" />
 Available Today
 </span>
 </div>
 </div>

 <div className="space-y-2.5">
 <PrimaryButton
 onClick={() => router.push(`/patient/book?providerId=${provider.id}`)}
 className="w-full text-sm font-semibold py-4 flex items-center justify-center gap-6"
 aria-label="Proceed to appointment booking steps"
 >
 Book Appointment
 </PrimaryButton>
 
 <SecondaryButton
 onClick={() => alert("Direct messaging is placeholder behavior.")}
 className="w-full text-sm font-semibold py-4 flex items-center justify-center gap-6"
 aria-label="Direct message provider support line"
 >
 Message Provider
 </SecondaryButton>
 </div>
 </div>

 {/* SECTION 6b: Partner Agency Information */}
 <div className="bg-bg-alt [#12121a]/30 border border-border/40 rounded-[24px] p-6 space-y-4">
 <SectionHeader title="Agency Affiliation" />
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-xl bg-white border border-border-light text-text-tertiary flex items-center justify-center font-bold text-sm uppercase">
 {provider.organization.substring(0, 2)}
 </div>
 <div>
 <h4 className="text-sm font-semibold text-primary flex items-center gap-1">
 {provider.organization}
 <ShieldCheck className="w-3.5 h-3.5 text-accent-light" />
 </h4>
 <p className="text-base text-text-tertiary flex items-center gap-0.5 mt-0.5">
 <MapPin className="w-3 h-3 text-text-tertiary" />
 Hyderabad Center
 </p>
 </div>
 </div>
 <SecondaryButton
 onClick={() => router.push(`/patient/organization/o1`)}
 className="w-full text-base py-2 flex items-center justify-center"
 aria-label={`View clinical details for ${provider.organization}`}
 >
 View Agency Profile
 </SecondaryButton>
 </div>
 </div>

 </div>
 </div>
 );
}
