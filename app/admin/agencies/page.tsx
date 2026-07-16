"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import { Building2, ShieldCheck, AlertCircle, Plus, Eye, Edit, Trash2 } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import PageLayout from"@/components/dashboard/PageLayout";
import { DataTable } from"@/components/DataTable";
import { organizationService } from"@/lib/services/organization.service";
import AgencyModal, { AgencyFormData } from"./AgencyModal";

interface EnrichedAgency {
 id: string;
 name: string;
 logo: string;
 businessType: string;
 registrationNumber: string;
 state: string;
 rating: number;
 verified: boolean;
 status:"Active" |"Inactive" |"Suspended";
 verificationStatus:"Verified" |"Pending" |"Rejected";
 email: string;
}

export default function AdminAgenciesPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [agencies, setAgencies] = useState<EnrichedAgency[]>([]);

 // Modal State
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalMode, setModalMode] = useState<"create" |"edit">("create");
 const [currentAgency, setCurrentAgency] = useState<AgencyFormData | null>(null);

 const loadData = () => {
 setLoading(true);
 organizationService.getOrganizations()
 .then((orgs) => {
 const enriched: EnrichedAgency[] = orgs.map((o: any, idx: number) => {
 const bizTypes = ["Home Care Agency","Hospital","Clinic","NGO","Healthcare Provider"];
 const states = ["Telangana","Karnataka","Maharashtra"];

 return {
 id: o.id,
 name: o.name,
 logo: o.logo,
 businessType: bizTypes[idx % bizTypes.length],
 registrationNumber: o.registrationNumber ||`REG-${o.id.toUpperCase()}-9900`,
 state: states[idx % states.length],
 rating: o.rating,
 verified: o.verified,
 status: o.verified ?"Active" : idx % 2 === 0 ?"Inactive" :"Suspended",
 verificationStatus: o.verified ?"Verified" : idx % 2 === 0 ?"Pending" :"Rejected",
 email: o.email ||`contact@${o.name.toLowerCase().replace(/\s+/g,"")}.org`,
 phone: o.phone ||"N/A",
 gstNumber: o.gstNumber ||"N/A"
 };
 });
 setAgencies(enriched);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading admin agencies:", err);
 setLoading(false);
 });
 };

 useEffect(() => {
 loadData();
 }, []);

 const openCreateModal = () => {
 setModalMode("create");
 setCurrentAgency(null);
 setIsModalOpen(true);
 };

 const openEditModal = (a: any) => {
 setModalMode("edit");
 setCurrentAgency({
 id: a.id,
 name: a.name,
 email: a.email,
 phone: a.phone,
 registrationNumber: a.registrationNumber,
 gstNumber: a.gstNumber,
 });
 setIsModalOpen(true);
 };

 const handleDelete = async (id: string) => {
 if (!confirm("Are you sure you want to delete this agency?")) return;
 try {
 const res = await fetch(`/api/agencies/${id}`, { method:"DELETE" });
 const result = await res.json();
 if (!result.success) throw new Error(result.error);
 loadData();
 } catch (err: any) {
 alert("Error deleting agency:" + err.message);
 }
 };

 // Summary counts
 const totalCount = agencies.length;
 const verifiedCount = agencies.filter((a) => a.verificationStatus ==="Verified").length;
 const activeCount = agencies.filter((a) => a.status ==="Active").length;
 const issuesCount = agencies.filter((a) => a.status ==="Suspended" || a.verificationStatus ==="Rejected").length;

 const summaryCards = [
 { label:"Total Agencies", value: totalCount, icon: <Building2 className="w-5 h-5 text-secondary" /> },
 { label:"Verified", value: verifiedCount, icon: <ShieldCheck className="w-5 h-5 text-accent" /> },
 { label:"Active", value: activeCount, icon: <ShieldCheck className="w-5 h-5 text-accent" /> },
 { label:"Needs Attention", value: issuesCount, icon: <AlertCircle className="w-5 h-5 text-rose-600" /> },
 ];

 const columns = [
 {
 header:"Agency",
 accessor: (row: EnrichedAgency) => (
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-bg-alt text-text-secondary flex items-center justify-center font-bold text-base uppercase">
 {row.name.substring(0, 2)}
 </div>
 <div>
 <p className="font-semibold text-primary">{row.name}</p>
 <p className="text-sm text-text-tertiary">{row.registrationNumber}</p>
 </div>
 </div>
 ),
 sortable: true,
 sortKey:"name"
 },
 {
 header:"Business Details",
 accessor: (row: EnrichedAgency) => (
 <div>
 <p className="font-medium text-primary">{row.businessType}</p>
 <p className="text-sm text-text-tertiary">{row.state} · ★ {row.rating.toFixed(1)}</p>
 </div>
 ),
 sortable: true,
 sortKey:"businessType"
 },
 {
 header:"Verification",
 accessor: (row: EnrichedAgency) => (
 <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${
 row.verificationStatus ==="Verified"
 ?"bg-accent-light text-accent"
 : row.verificationStatus ==="Pending"
 ?"bg-bg text-accent-light"
 :"bg-rose-50 text-rose-700"
 }`}>
 {row.verificationStatus}
 </span>
 ),
 sortable: true,
 sortKey:"verificationStatus"
 },
 {
 header:"Status",
 accessor: (row: EnrichedAgency) => (
 <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${
 row.status ==="Active"
 ?"bg-bg text-secondary"
 :"bg-bg-alt text-text-secondary"
 }`}>
 {row.status}
 </span>
 ),
 sortable: true,
 sortKey:"status"
 },
 {
 header:"Action",
 accessor: (row: EnrichedAgency) => (
 <div className="flex items-center gap-2">
 <button
 onClick={() => router.push(`/admin/agencies/${row.id}`)}
 className="p-1.5 text-text-tertiary hover:text-text-secondary :text-white transition-colors"
 title="View Details"
 >
 <Eye className="w-4 h-4" />
 </button>
 <button
 onClick={() => openEditModal(row)}
 className="p-1.5 text-text-tertiary hover:text-secondary transition-colors"
 title="Edit"
 >
 <Edit className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDelete(row.id)}
 className="p-1.5 text-text-tertiary hover:text-rose-600 transition-colors"
 title="Delete"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 )
 }
 ];

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
 </div>
 );
 }

 return (
 <PageLayout
 title="Agencies"
 description="View, monitor, and manage all registered healthcare agencies and organizations."
 actionButton={
 <button
 onClick={openCreateModal}
 className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-base font-semibold rounded-lg hover:bg-primary :bg-bg-alt transition-colors"
 >
 <Plus className="w-4 h-4" /> Add Agency
 </button>
 }
 secondaryInformation={
 <div className="text-base text-text-tertiary">
 Showing {agencies.length} total agencies. Ensure all organizations meet compliance standards before activation.
 </div>
 }
 >
 <div className="space-y-8">
 <Breadcrumb
 items={[
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Agencies" },
 ]}
 />

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
 {summaryCards.map((c, i) => (
 <DashboardCard key={i} className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-full bg-bg-alt flex items-center justify-center shrink-0">
 {c.icon}
 </div>
 <div>
 <p className="text-2xl font-bold text-primary">{c.value}</p>
 <p className="text-sm font-medium text-text-tertiary">{c.label}</p>
 </div>
 </DashboardCard>
 ))}
 </div>

 <DataTable
 data={agencies}
 columns={columns}
 searchPlaceholder="Search agencies by name or ID..."
 searchKey="name"
 filterOptions={[
 {
 label:"Business Type",
 key:"businessType",
 options: ["Home Care Agency","Hospital","Clinic","NGO","Healthcare Provider"]
 },
 {
 label:"Status",
 key:"status",
 options: ["Active","Inactive","Suspended"]
 },
 {
 label:"Verification",
 key:"verificationStatus",
 options: ["Verified","Pending","Rejected"]
 }
 ]}
 />
 </div>

 <AgencyModal
 isOpen={isModalOpen}
 mode={modalMode}
 initialData={currentAgency}
 onClose={() => setIsModalOpen(false)}
 onSubmit={async () => {
 setIsModalOpen(false);
 loadData();
 }}
 />
 </PageLayout>
 );
}
