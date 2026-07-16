"use client";

import React, { useEffect, useState } from"react";
import { useParams } from"next/navigation";
import { ArrowLeft, ShieldCheck, Star } from"lucide-react";
import Link from"next/link";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import { providerService, MockProfessional } from"@/lib/services/provider.service";

export default function AgencyProfessionalDetailPage() {
 const { id } = useParams<{ id: string }>();
 const [professional, setProfessional] = useState<MockProfessional | undefined>(undefined);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 if (!id) return;
 setLoading(true);
 providerService
 .getProviderById(id)
 .then(setProfessional)
 .catch((err) => console.error("Error loading professional:", err))
 .finally(() => setLoading(false));
 }, [id]);

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 if (!professional) {
 return (
 <div className="text-center py-20 text-text-tertiary text-base font-semibold">
 Professional not found.{""}
 <Link href="/agency/professionals" className="text-accent-light hover:underline">
 Go back
 </Link>
 </div>
 );
 }

 return (
 <div className="space-y-6 max-w-4xl mx-auto w-full">
 {/* Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/agency/dashboard" },
 { label:"Manage Professionals", href:"/agency/professionals" },
 { label: professional.fullName },
 ]}
 />

 {/* Back link */}
 <Link
 href="/agency/professionals"
 className="inline-flex items-center gap-6 text-sm font-bold text-text-tertiary hover:text-accent-light transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to Professionals
 </Link>

 {/* Page Header */}
 <SectionHeader
 title={professional.fullName}
 description={`${professional.category} · ${professional.experience}`}
 />

 {/* Profile Card */}
 <DashboardCard className="p-6 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden">
 <div className="w-20 h-20 rounded-[20px] bg-bg text-accent-light flex items-center justify-center font-black text-2xl uppercase border border-orange-100 shrink-0 overflow-hidden">
 {professional.photo ? (
 <img src={professional.photo} alt={professional.fullName} className="w-full h-full object-cover" />
 ) : (
 professional.fullName.substring(0, 2)
 )}
 </div>
 <div className="flex-1 space-y-2">
 <div className="flex flex-wrap items-center gap-6">
 <h2 className="text-xl font-black text-primary">{professional.fullName}</h2>
 {professional.verified && (
 <span className="inline-flex items-center gap-1 px-3 py-2.5 rounded-full bg-accent-light border border-emerald-100 text-emerald-655 text-sm font-extrabold uppercase">
 <ShieldCheck className="w-3 h-3" />
 Verified
 </span>
 )}
 </div>
 <p className="text-sm font-bold text-text-tertiary uppercase tracking-wider">
 {professional.category} · {professional.experience}
 </p>
 <div className="flex flex-wrap gap-6 pt-1 text-sm">
 <span className="flex items-center gap-1 font-bold text-accent-light bg-bg px-3 py-2.5 rounded-lg">
 <Star className="w-3.5 h-3.5 fill-current" />
 {professional.rating.toFixed(1)} Rating
 </span>
 <span className="font-semibold text-text-tertiary bg-bg-alt px-3 py-2.5 rounded-lg">
 {professional.availability}
 </span>
 <span className="font-semibold text-text-tertiary bg-bg-alt px-3 py-2.5 rounded-lg">
 {professional.organization}
 </span>
 </div>
 {professional.languages?.length > 0 && (
 <div className="flex flex-wrap gap-1.5 pt-1">
 {professional.languages.map((lang) => (
 <span key={lang} className="px-3 py-2.5 text-sm font-extrabold uppercase tracking-wide rounded-lg bg-bg-alt text-text-tertiary">
 {lang}
 </span>
 ))}
 </div>
 )}
 </div>
 <div className="absolute right-0 bottom-0 w-24 h-24 bg-accent-light/5 blur-2xl rounded-full" />
 </DashboardCard>

 {/* Placeholder notice */}
 <DashboardCard className="p-6 text-center space-y-2 border-dashed">
 <p className="text-base font-extrabold text-text-tertiary">Professional Detail Page</p>
 <p className="text-sm text-text-tertiary">
 Full professional detail view will be implemented in a future phase.
 </p>
 <Link
 href="/agency/professionals"
 className="inline-block mt-2 text-base font-extrabold text-accent-light hover:underline"
 >
 ← Return to Professionals List
 </Link>
 </DashboardCard>
 </div>
 );
}
