"use client";

import React, { useState, useEffect, useMemo } from"react";
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Search, Eye, Download, Upload } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import SearchInput from"@/components/dashboard/SearchInput";
import EmptyState from"@/components/dashboard/EmptyState";
import { providerService } from"@/lib/services/provider.service";

interface DocumentItem {
 id: string;
 name: string;
 type: string;
 issueDate: string;
 expiryDate: string;
 status:"Verified" |"Pending" |"Rejected" |"Expired";
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
 {
 id:"doc-1",
 name:"Medical Council Registration",
 type:"Professional Registration",
 issueDate:"2022-01-15",
 expiryDate:"2027-01-14",
 status:"Verified",
 },
 {
 id:"doc-2",
 name:"Aadhaar Card",
 type:"Government ID",
 issueDate:"2015-06-10",
 expiryDate:"—",
 status:"Verified",
 },
 {
 id:"doc-3",
 name:"MD Degree Certificate",
 type:"Qualification Certificate",
 issueDate:"2012-05-20",
 expiryDate:"—",
 status:"Verified",
 },
 {
 id:"doc-4",
 name:"Previous Experience Letter",
 type:"Experience Certificate",
 issueDate:"2020-12-01",
 expiryDate:"—",
 status:"Verified",
 },
 {
 id:"doc-5",
 name:"Active Medical License",
 type:"Medical License",
 issueDate:"2023-04-10",
 expiryDate:"2028-04-09",
 status:"Verified",
 },
 {
 id:"doc-6",
 name:"Police Verification Certificate",
 type:"Police Verification",
 issueDate:"2026-01-10",
 expiryDate:"2027-01-09",
 status:"Pending",
 },
 {
 id:"doc-7",
 name:"Rental Agreement",
 type:"Address Proof",
 issueDate:"2025-05-01",
 expiryDate:"2026-04-30",
 status:"Expired",
 },
 {
 id:"doc-8",
 name:"Professional Headshot Photo",
 type:"Professional Photograph",
 issueDate:"2026-07-01",
 expiryDate:"—",
 status:"Verified",
 },
];

const DOCUMENT_TYPES = [
"Professional Registration",
"Government ID",
"Qualification Certificate",
"Experience Certificate",
"Medical License",
"Police Verification",
"Address Proof",
"Professional Photograph",
];

export default function ProfessionalDocumentsPage() {
 const [loading, setLoading] = useState(true);
 const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);

 // Search & Filter state
 const [search, setSearch] = useState("");
 const [typeFilter, setTypeFilter] = useState("");
 const [statusFilter, setStatusFilter] = useState("");
 const [expiryFilter, setExpiryFilter] = useState("");

 useEffect(() => {
 providerService.getProviders()
 .then(() => setLoading(false))
 .catch((err) => {
 console.error(err);
 setLoading(false);
 });
 }, []);

 // Summary Card values
 const totalCount = documents.length;
 const verifiedCount = documents.filter((d) => d.status ==="Verified").length;
 const pendingCount = documents.filter((d) => d.status ==="Pending").length;
 const expiredCount = documents.filter((d) => d.status ==="Expired" || d.status ==="Rejected").length;

 const summaryCards = [
 { label:"Total Documents", value: totalCount, icon: <FileText className="w-5 h-5 text-secondary" />, color:"text-blue-650 bg-bg" },
 { label:"Verified Documents", value: verifiedCount, icon: <CheckCircle2 className="w-5 h-5 text-accent" />, color:"text-emerald-650 bg-accent-light" },
 { label:"Pending Verification", value: pendingCount, icon: <Clock className="w-5 h-5 text-accent-light" />, color:"text-amber-650 bg-bg" },
 { label:"Expired Documents", value: expiredCount, icon: <AlertTriangle className="w-5 h-5 text-rose-600" />, color:"text-rose-650 bg-rose-50" },
 ];

 // Local filtering & searching
 const filteredDocuments = useMemo(() => {
 return documents.filter((doc) => {
 const q = search.toLowerCase();
 const matchSearch = !q || doc.name.toLowerCase().includes(q);
 const matchType = !typeFilter || doc.type === typeFilter;
 const matchStatus = !statusFilter || doc.status === statusFilter;

 let matchExpiry = true;
 if (expiryFilter ==="Expired") {
 matchExpiry = doc.status ==="Expired";
 } else if (expiryFilter ==="Active") {
 matchExpiry = doc.status !=="Expired";
 }

 return matchSearch && matchType && matchStatus && matchExpiry;
 });
 }, [documents, search, typeFilter, statusFilter, expiryFilter]);

 const getStatusBadge = (status: string) => {
 let classes ="bg-bg-alt text-text-secondary";
 if (status ==="Verified") {
 classes ="bg-accent-light text-accent border border-emerald-100";
 } else if (status ==="Pending") {
 classes ="bg-bg text-accent-light border border-amber-100";
 } else if (status ==="Expired") {
 classes ="bg-rose-50 text-rose-700 border border-rose-100";
 } else if (status ==="Rejected") {
 classes ="bg-rose-100 text-rose-700 border border-rose-200";
 }
 return <span className={`px-3 py-2.5 rounded-lg text-sm font-extrabold uppercase tracking-wide ${classes}`}>{status}</span>;
 };

 const getDocumentProgressPct = (count: number) => {
 return totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 return (
 <div className="space-y-6 max-w-7xl mx-auto w-full">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/professional/dashboard" },
 { label:"Documents" },
 ]}
 />

 {/* 2. Page Header */}
 <SectionHeader
 title="Documents"
 description="View your professional documents and verification status."
 />

 {/* 3. Document Summary Cards */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {summaryCards.map((c, idx) => (
 <DashboardCard key={idx} className="p-8 flex items-center gap-6">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.color}`}>
 {c.icon}
 </div>
 <div>
 <p className="text-2xl font-black text-primary">{c.value}</p>
 <p className="text-base font-bold text-text-tertiary uppercase tracking-wider leading-tight">{c.label}</p>
 </div>
 </DashboardCard>
 ))}
 </div>

 <DashboardCard className="p-8 space-y-4">
 {/* 4. Search Bar */}
 <SearchInput
 placeholder="Search documents by name"
 className="max-w-md"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />

 {/* 5. Filter Row */}
 <div className="flex flex-wrap gap-6 items-center">
 <span className="text-base font-extrabold text-text-tertiary uppercase tracking-wider mr-1">Filter:</span>
 
 <select
 value={typeFilter}
 onChange={(e) => setTypeFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Document Types</option>
 {DOCUMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
 </select>

 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Statuses</option>
 <option value="Verified">Verified</option>
 <option value="Pending">Pending</option>
 <option value="Rejected">Rejected</option>
 <option value="Expired">Expired</option>
 </select>

 <select
 value={expiryFilter}
 onChange={(e) => setExpiryFilter(e.target.value)}
 className="px-3 py-2 text-sm bg-white border border-border rounded-xl outline-none text-text-secondary font-semibold"
 >
 <option value="">All Expiry Statuses</option>
 <option value="Active">Active / Non-Expired</option>
 <option value="Expired">Expired</option>
 </select>
 </div>

 {/* 6. Documents Grid / 8. Empty State */}
 {filteredDocuments.length === 0 ? (
 <EmptyState
 icon={<FileText className="w-5 h-5" />}
 title="No documents available"
 description="Your uploaded documents will appear here."
 buttonLabel="Go to Dashboard"
 buttonLink="/professional/dashboard"
 />
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {filteredDocuments.map((doc) => (
 <DashboardCard key={doc.id} className="p-6 flex flex-col justify-between h-[200px] border border-border-light">
 <div className="space-y-3">
 <div className="flex items-start justify-between gap-6">
 <div className="w-9 h-9 rounded-xl bg-bg text-accent-light flex items-center justify-center border border-orange-100">
 <FileText className="w-5 h-5" />
 </div>
 {getStatusBadge(doc.status)}
 </div>
 <div>
 <h4 className="text-sm font-black text-primary truncate" title={doc.name}>
 {doc.name}
 </h4>
 <p className="text-sm text-text-tertiary font-bold uppercase tracking-wider mt-0.5">{doc.type}</p>
 </div>
 </div>

 <div className="space-y-2.5">
 <div className="flex items-center justify-between text-base text-text-tertiary font-bold">
 <span>Issued: {doc.issueDate}</span>
 <span>Exp: {doc.expiryDate}</span>
 </div>

 {/* Card Footer Actions */}
 <div className="flex items-center gap-1.5 pt-2 border-t border-border-light">
 <button
 disabled
 className="flex-1 py-2.5 rounded-lg text-sm font-extrabold uppercase bg-bg-alt text-text-tertiary cursor-not-allowed border border-border flex items-center justify-center gap-1 select-none"
 >
 <Eye className="w-3 h-3" /> View
 </button>
 <button
 disabled
 className="flex-1 py-2.5 rounded-lg text-sm font-extrabold uppercase bg-bg-alt text-text-tertiary cursor-not-allowed border border-border flex items-center justify-center gap-1 select-none"
 >
 <Download className="w-3 h-3" /> Get
 </button>
 <button
 disabled
 className="px-3 py-2.5 rounded-lg bg-bg-alt text-text-tertiary cursor-not-allowed border border-border flex items-center justify-center select-none"
 title="Replace"
 >
 <Upload className="w-3 h-3" />
 </button>
 </div>
 </div>
 </DashboardCard>
 ))}
 </div>
 )}
 </DashboardCard>

 {/* 7. Verification Status Panel */}
 <DashboardCard className="p-6 space-y-4">
 <h3 className="text-base font-extrabold text-primary flex items-center gap-6">
 <CheckCircle2 className="w-4 h-4 text-accent-light" />
 Verification Progress
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm font-bold">
 {[
 { label:"Verified Documents", count: verifiedCount, color:"bg-accent" },
 { label:"Pending Documents", count: pendingCount, color:"bg-accent-light" },
 { label:"Rejected Documents", count: documents.filter(d => d.status ==="Rejected").length, color:"bg-rose-500" },
 { label:"Expired Documents", count: documents.filter(d => d.status ==="Expired").length, color:"bg-rose-455" },
 ].map((bar, idx) => {
 const pct = getDocumentProgressPct(bar.count);
 return (
 <div key={idx} className="space-y-1.5 p-3 bg-bg-alt/50 border border-border-light rounded-2xl">
 <div className="flex items-center justify-between">
 <span className="text-text-tertiary">{bar.label}</span>
 <span className="font-extrabold text-primary">{bar.count}</span>
 </div>
 <div className="h-1.5 bg-bg-alt rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full transition-all duration-500 ${bar.color}`}
 style={{ width:`${pct}%`}}
 />
 </div>
 </div>
 );
 })}
 </div>
 </DashboardCard>
 </div>
 );
}
