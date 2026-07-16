"use client";

import React, { useState, useEffect } from"react";
import { useRouter, useSearchParams } from"next/navigation";
import {
 Star,
 ShieldCheck,
 MapPin,
 Sparkles,
 Filter,
 Search,
 ChevronDown,
 ChevronUp,
 Clock,
 Languages,
 Award,
 BookOpen,
 ArrowRight
} from"lucide-react";
import { PageHeader, CleanCard, EmptyState } from"@/components/DesignSystem";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import { organizationService, MockOrganization } from"@/lib/services/organization.service";

export default function ExploreCarePage() {
 const router = useRouter();
 const [providers, setProviders] = useState<MockProfessional[]>([]);
 const [organizations, setOrganizations] = useState<MockOrganization[]>([]);
 const [selectedCategory, setSelectedCategory] = useState("All");
 const [searchQuery, setSearchQuery] = useState("");
 const [verifiedOnly, setVerifiedOnly] = useState(false);
 const [homeVisitOnly, setHomeVisitOnly] = useState(false);
 const [onlineConsultOnly, setOnlineConsultOnly] = useState(false);

 // Filters state placeholders
 const [selectedLocation, setSelectedLocation] = useState("All");
 const [selectedExperience, setSelectedExperience] = useState("All");
 const [selectedGender, setSelectedGender] = useState("All");
 const [selectedLanguage, setSelectedLanguage] = useState("All");
 const [selectedAvailability, setSelectedAvailability] = useState("All");
 const [selectedRating, setSelectedRating] = useState("All");
 const [selectedOrg, setSelectedOrg] = useState("All");
 const [selectedPrice, setSelectedPrice] = useState("All");

 // Advanced filters collapse state
 const [filtersExpanded, setFiltersExpanded] = useState(false);

 useEffect(() => {
 providerService.getProviders().then((data) => setProviders(data));
 organizationService.getOrganizations().then((data) => setOrganizations(data));
 }, []);

 const clearFilters = () => {
 setSelectedCategory("All");
 setSearchQuery("");
 setVerifiedOnly(false);
 setHomeVisitOnly(false);
 setOnlineConsultOnly(false);
 setSelectedLocation("All");
 setSelectedExperience("All");
 setSelectedGender("All");
 setSelectedLanguage("All");
 setSelectedAvailability("All");
 setSelectedRating("All");
 setSelectedOrg("All");
 setSelectedPrice("All");
 };

 const searchParams = useSearchParams();
 useEffect(() => {
 if (searchParams && searchParams.toString() ==="") {
 clearFilters();
 } else if (searchParams) {
 const categoryParam = searchParams.get("category");
 if (categoryParam) {
 // Map param role name to category tab
 if (categoryParam.toLowerCase() ==="nurse") setSelectedCategory("Nurses");
 else if (categoryParam.toLowerCase() ==="doctor") setSelectedCategory("Doctors");
 else if (categoryParam.toLowerCase() ==="caregiver") setSelectedCategory("Caregivers");
 else if (categoryParam.toLowerCase() ==="physiotherapist") setSelectedCategory("Physiotherapists");
 else if (categoryParam.toLowerCase() ==="agency" || categoryParam.toLowerCase() ==="organization") setSelectedCategory("Organizations");
 }
 }
 }, [searchParams]);

 // Determine filtering logic locally
 const filteredProfessionals = providers.filter((p) => {
 if (selectedCategory !=="All" && selectedCategory !== p.category) return false;
 if (verifiedOnly && !p.verified) return false;
 
 // Connect search query
 if (searchQuery.trim() !=="") {
 const q = searchQuery.toLowerCase();
 const matchName = p.fullName.toLowerCase().includes(q);
 const matchCategory = p.category.toLowerCase().includes(q);
 const matchOrg = p.organization.toLowerCase().includes(q);
 if (!matchName && !matchCategory && !matchOrg) return false;
 }
 return true;
 });

 const filteredOrganizations = organizations.filter((o) => {
 if (selectedCategory !=="All" && selectedCategory !=="Organizations") return false;
 if (verifiedOnly && !o.verified) return false;
 
 // Connect search query
 if (searchQuery.trim() !=="") {
 const q = searchQuery.toLowerCase();
 const matchName = o.name.toLowerCase().includes(q);
 const matchLoc = o.location.toLowerCase().includes(q);
 if (!matchName && !matchLoc) return false;
 }
 return true;
 });

 const hasResults = filteredProfessionals.length > 0 || filteredOrganizations.length > 0;

 // Build categories list dynamically
 const getCategoriesList = () => {
 const list: string[] = ["All"];
 providers.forEach((p) => {
 if (!list.includes(p.category)) {
 list.push(p.category);
 }
 });
 list.push("Organizations");
 return list;
 };
 const categories = getCategoriesList();

 // Mock static values for provider card details enrichment
 const mockProviderDetails: Record<string, { reviews: number; startingPrice: string; gender: string; distance: string }> = {
"u-3": { reviews: 32, startingPrice:"₹649/hr", gender:"Female", distance:"1.8 km" },
"u-4": { reviews: 24, startingPrice:"₹499/hr", gender:"Male", distance:"2.4 km" },
 };

 return (
 <div className="w-full space-y-8">
 {/* 1. Page Header */}
 <PageHeader
 title="Care Services"
 description="Find and book trusted, background-verified home care professionals and licensed organizations near you."
 />

 {/* 2. Modern Search & Discovery Bar */}
 <div className="flex flex-col sm:flex-row gap-6">
 <div className="relative flex-1">
 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
 <input
 type="text"
 placeholder="Search by name, role, or services..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none focus:border-border :border-border-light text-primary transition-all"
 />
 </div>

 <div className="relative w-full sm:w-48 shrink-0">
 <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
 <select
 value={selectedLocation}
 onChange={(e) => setSelectedLocation(e.target.value)}
 className="w-full pl-10 pr-8 py-2.5 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none appearance-none cursor-pointer text-slate-750 font-semibold"
 >
 <option value="All">All Locations</option>
 <option value="Hyderabad">Hyderabad</option>
 <option value="Vijayawada">Vijayawada</option>
 </select>
 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
 </div>
 </div>

 {/* 3. Category Filters */}
 <div className="flex gap-6 overflow-x-auto scrollbar-none py-2 select-none">
 {categories.map((cat) => {
 const isActive = selectedCategory === cat;
 return (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-3.5 py-2.5 text-sm font-semibold rounded-full border transition-all whitespace-nowrap ${
 isActive
 ?"bg-primary border-slate-900 text-white shadow-sm"
 :"bg-white border-border/50 [#12121a] text-text-tertiary hover:text-primary :text-white"
 }`}
 >
 {cat}
 </button>
 );
 })}
 </div>

 {/* 4. Advanced Filters Panel Toggle */}
 <div className="border border-border/50 rounded-lg bg-white [#12121a] overflow-hidden">
 <button
 onClick={() => setFiltersExpanded(!filtersExpanded)}
 className="flex items-center justify-between w-full px-5 py-4.5 text-sm font-semibold text-text-secondary hover:bg-bg-alt/50 :bg-primary/30 transition-colors"
 >
 <div className="flex items-center gap-6">
 <Filter className="w-3.5 h-3.5 text-slate-450" />
 <span>Refine Search Filters</span>
 </div>
 {filtersExpanded ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
 </button>

 {filtersExpanded && (
 <div className="p-6 border-t border-border-light bg-bg-alt/20 space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
 {/* Experience */}
 <div className="flex flex-col gap-1.5">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary">Experience</span>
 <div className="relative">
 <select
 value={selectedExperience}
 onChange={(e) => setSelectedExperience(e.target.value)}
 className="w-full pl-3 pr-8 py-2 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none appearance-none font-semibold text-text-secondary"
 >
 <option value="All">Any Experience</option>
 <option value="5">5+ Years</option>
 <option value="10">10+ Years</option>
 </select>
 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
 </div>
 </div>

 {/* Gender */}
 <div className="flex flex-col gap-1.5">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary">Gender</span>
 <div className="relative">
 <select
 value={selectedGender}
 onChange={(e) => setSelectedGender(e.target.value)}
 className="w-full pl-3 pr-8 py-2 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none appearance-none font-semibold text-text-secondary"
 >
 <option value="All">Any Gender</option>
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 </select>
 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
 </div>
 </div>

 {/* Languages */}
 <div className="flex flex-col gap-1.5">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary">Languages</span>
 <div className="relative">
 <select
 value={selectedLanguage}
 onChange={(e) => setSelectedLanguage(e.target.value)}
 className="w-full pl-3 pr-8 py-2 text-sm bg-white [#12121a] border border-border/50 rounded-lg outline-none appearance-none font-semibold text-text-secondary"
 >
 <option value="All">Any Language</option>
 <option value="English">English</option>
 <option value="Telugu">Telugu</option>
 <option value="Hindi">Hindi</option>
 </select>
 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450 pointer-events-none" />
 </div>
 </div>

 {/* Verified Checkbox */}
 <div className="flex items-center gap-6 pt-5">
 <label className="flex items-center gap-6 cursor-pointer font-semibold text-sm text-text-secondary">
 <input
 type="checkbox"
 checked={verifiedOnly}
 onChange={(e) => setVerifiedOnly(e.target.checked)}
 className="rounded text-primary border-border w-4 h-4"
 />
 <span>Verified Only</span>
 </label>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* 5. Results Grid */}
 <section className="space-y-6">
 {!hasResults ? (
 <EmptyState
 title="No care options found"
 description="Adjust your keyword filters or locations to view all healthcare listings."
 action={{ label:"Reset Filters", onClick: clearFilters }}
 />
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {/* Render Professionals */}
 {selectedCategory !=="Organizations" &&
 filteredProfessionals.map((p) => {
 const details = mockProviderDetails[p.id] || { reviews: 10, startingPrice:"₹499/hr", gender:"Male", distance:"2 km" };
 return (
 <CleanCard key={p.id} className="flex flex-col justify-between hover:border-border :border-border-light transition-colors">
 <div>
 {/* Avatar & Core Identity */}
 <div className="flex items-start justify-between gap-6">
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-lg bg-bg-alt border border-border-light flex items-center justify-center font-bold text-sm uppercase text-text-secondary">
 {p.fullName.charAt(0)}
 </div>
 <div>
 <h3 className="font-semibold text-sm text-primary flex items-center gap-1.5">
 {p.fullName}
 {p.verified && (
 <ShieldCheck className="w-3.5 h-3.5 text-slate-450" />
 )}
 </h3>
 <p className="text-base text-slate-450 mt-0.5">{p.category}</p>
 </div>
 </div>

 <div className="flex items-center gap-1 bg-bg/50 px-3 py-2.5 rounded text-accent-light text-sm font-semibold">
 <Star className="w-3 h-3 text-accent-light fill-amber-500" />
 <span>{p.rating.toFixed(1)}</span>
 </div>
 </div>

 {/* Provider Info Grid */}
 <div className="border-t border-border-light my-4 pt-4 text-sm space-y-2 text-text-tertiary">
 <div className="flex justify-between">
 <span className="text-text-tertiary font-medium">Experience</span>
 <span className="font-semibold text-primary">{p.experience}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-text-tertiary font-medium">Languages</span>
 <span className="font-semibold text-primary truncate max-w-[140px]">{p.languages.join(",")}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-text-tertiary font-medium">Organization</span>
 <span className="font-semibold text-primary truncate max-w-[140px]">{p.organization}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-text-tertiary font-medium">Starting Price</span>
 <span className="font-semibold text-primary">{details.startingPrice}</span>
 </div>
 </div>
 </div>

 <div className="flex gap-6 mt-4 pt-4 border-t border-border-light">
 <button
 onClick={() => router.push(`/patient/provider/${p.id}`)}
 className="flex-1 py-2 border border-border/60 hover:bg-bg-alt :bg-primary rounded-lg text-sm font-semibold text-text-secondary transition-colors"
 >
 View Profile
 </button>
 <button
 disabled
 className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed transition-opacity"
 >
 Book Visit
 </button>
 </div>
 </CleanCard>
 );
 })}

 {/* Render Organizations */}
 {(selectedCategory ==="All" || selectedCategory ==="Organizations") &&
 filteredOrganizations.map((o) => (
 <CleanCard key={o.id} className="flex flex-col justify-between hover:border-border :border-border-light transition-colors">
 <div>
 <div className="flex items-start justify-between gap-6">
 <div className="flex items-center gap-6">
 <div className="w-10 h-10 rounded-lg bg-bg-alt border border-border-light flex items-center justify-center font-bold text-sm uppercase text-text-secondary">
 {o.name.substring(0, 2)}
 </div>
 <div>
 <h3 className="font-semibold text-sm text-primary flex items-center gap-1.5">
 {o.name}
 {o.verified && (
 <ShieldCheck className="w-3.5 h-3.5 text-slate-450" />
 )}
 </h3>
 <p className="text-base text-slate-450 mt-0.5">Licensed Care Agency</p>
 </div>
 </div>

 <div className="flex items-center gap-1 bg-bg/50 px-3 py-2.5 rounded text-accent-light text-sm font-semibold">
 <Star className="w-3 h-3 text-accent-light fill-amber-500" />
 <span>{o.rating.toFixed(1)}</span>
 </div>
 </div>

 <div className="border-t border-border-light my-4 pt-4 text-sm space-y-3.5 text-slate-555">
 <div className="flex justify-between items-center">
 <span className="text-text-tertiary font-medium">Location</span>
 <span className="font-semibold text-primary flex items-center gap-1 shrink-0">
 <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
 {o.location}
 </span>
 </div>
 <div className="space-y-1">
 <span className="text-text-tertiary font-medium block">Provided Services</span>
 <div className="flex flex-wrap gap-1">
 {o.services.map((svc) => (
 <span
 key={svc}
 className="bg-bg-alt border border-border-light text-base font-semibold text-text-secondary px-3 py-2.5 rounded"
 >
 {svc}
 </span>
 ))}
 </div>
 </div>
 </div>
 </div>

 <div className="flex gap-6 mt-4 pt-4 border-t border-border-light">
 <button
 onClick={() => router.push(`/patient/organization/${o.id}`)}
 className="flex-1 py-2 border border-border/60 hover:bg-bg-alt :bg-primary rounded-lg text-sm font-semibold text-text-secondary transition-colors"
 >
 View Profile
 </button>
 <button
 disabled
 className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed transition-opacity"
 >
 Professionals
 </button>
 </div>
 </CleanCard>
 ))}
 </div>
 )}
 </section>
 </div>
 );
}
