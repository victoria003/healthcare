"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import { Users, ShieldCheck, UserCheck, AlertTriangle, Plus, Eye, Edit, Trash2 } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import PageLayout from"@/components/dashboard/PageLayout";
import { DataTable } from"@/components/DataTable";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import ProfessionalModal, { ProfessionalFormData } from"./ProfessionalModal";

interface EnrichedProfessional extends MockProfessional {
 status:"Active" |"Inactive" |"Suspended";
 verificationStatus:"Verified" |"Pending" |"Rejected";
 availabilityStatus:"Available" |"Busy" |"Unavailable";
 registrationNumber: string;
 specialization: string;
 email: string;
 phone: string;
}

export default function AdminProfessionalsPage() {
 const router = useRouter();
 const [loading, setLoading] = useState(true);
 const [professionals, setProfessionals] = useState<EnrichedProfessional[]>([]);

 // Modal State
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalMode, setModalMode] = useState<"create" |"edit">("create");
 const [currentProfessional, setCurrentProfessional] = useState<ProfessionalFormData | null>(null);

 const loadData = () => {
 setLoading(true);
 providerService.getProviders()
 .then((provs) => {
 const enriched: EnrichedProfessional[] = provs.map((p, idx) => {
 const statuses: ("Active" |"Inactive" |"Suspended")[] = ["Active","Inactive","Suspended"];
 const verifications: ("Verified" |"Pending" |"Rejected")[] = ["Verified","Pending","Rejected"];
 const availabilities: ("Available" |"Busy" |"Unavailable")[] = ["Available","Busy","Unavailable"];
 
 return {
 ...p,
 status: p.verified ?"Active" : statuses[idx % statuses.length],
 verificationStatus: p.verified ?"Verified" : verifications[idx % verifications.length],
 availabilityStatus: p.availability?.toLowerCase().includes("today") 
 ?"Available" 
 : availabilities[idx % availabilities.length],
 registrationNumber:`MCI-${p.id.toUpperCase()}-3344`,
 specialization: p.category ==="Doctors" ?"General Medicine" : p.category ==="Physiotherapists" ?"Orthopedics" :"Geriatric Care",
 email:`${p.fullName.toLowerCase().replace(/\s+/g,".")}@homecare.in`,
 phone:"+91 9876543210",
 };
 });
 setProfessionals(enriched);
 setLoading(false);
 })
 .catch((err) => {
 console.error("Error loading admin professionals:", err);
 setLoading(false);
 });
 };

 useEffect(() => {
 loadData();
 }, []);

 const openCreateModal = () => {
 setModalMode("create");
 setCurrentProfessional(null);
 setIsModalOpen(true);
 };

 const openEditModal = (p: EnrichedProfessional) => {
 setModalMode("edit");
 setCurrentProfessional({
 id: p.id,
 fullName: p.fullName,
 email: p.email,
 phone: p.phone,
 experienceYears: parseInt(p.experience) || 0,
 });
 setIsModalOpen(true);
 };

 const handleDelete = async (id: string) => {
 if (!confirm("Are you sure you want to delete this professional?")) return;
 try {
 const res = await fetch(`/api/staff/${id}`, { method:"DELETE" });
 const result = await res.json();
 if (!result.success) throw new Error(result.error);
 loadData();
 } catch (err: any) {
 alert("Error deleting professional:" + err.message);
 }
 };

 // Summary counts
 const totalCount = professionals.length;
 const verifiedCount = professionals.filter((p) => p.verificationStatus ==="Verified").length;
 const availableCount = professionals.filter((p) => p.availabilityStatus ==="Available").length;
 const unavailableCount = professionals.filter((p) => p.availabilityStatus ==="Unavailable" || p.availabilityStatus ==="Busy").length;

 const summaryCards = [
 { label:"Total Professionals", value: totalCount, icon: <Users className="w-5 h-5 text-secondary" /> },
 { label:"Verified", value: verifiedCount, icon: <ShieldCheck className="w-5 h-5 text-accent" /> },
 { label:"Available", value: availableCount, icon: <UserCheck className="w-5 h-5 text-secondary" /> },
 { label:"Unavailable", value: unavailableCount, icon: <AlertTriangle className="w-5 h-5 text-rose-600" /> },
 ];

 const columns = [
 {
 header:"Professional",
 accessor: (row: EnrichedProfessional) => (
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-bg-alt text-text-secondary flex items-center justify-center font-bold text-base uppercase">
 {row.fullName.substring(0, 2)}
 </div>
 <div>
 <p className="font-semibold text-primary">{row.fullName}</p>
 <p className="text-sm text-text-tertiary">{row.id} · {row.category}</p>
 </div>
 </div>
 ),
 sortable: true,
 sortKey:"fullName"
 },
 {
 header:"Experience",
 accessor: (row: EnrichedProfessional) => (
 <div>
 <p className="font-medium text-primary">{row.experience}</p>
 <p className="text-sm text-text-tertiary">★ {row.rating.toFixed(1)}</p>
 </div>
 ),
 sortable: true,
 sortKey:"experience"
 },
 {
 header:"Availability",
 accessor: (row: EnrichedProfessional) => (
 <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${
 row.availabilityStatus ==="Available"
 ?"bg-accent-light text-accent"
 :"bg-bg text-accent-light"
 }`}>
 {row.availabilityStatus}
 </span>
 ),
 sortable: true,
 sortKey:"availabilityStatus"
 },
 {
 header:"Status",
 accessor: (row: EnrichedProfessional) => (
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
 accessor: (row: EnrichedProfessional) => (
 <div className="flex items-center gap-2">
 <button
 onClick={() => router.push(`/admin/professionals/${row.id}`)}
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
 title="Professionals"
 description="View, monitor, and manage all registered healthcare professionals on the platform."
 actionButton={
 <button
 onClick={openCreateModal}
 className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-base font-semibold rounded-lg hover:bg-primary :bg-bg-alt transition-colors"
 >
 <Plus className="w-4 h-4" /> Add Professional
 </button>
 }
 secondaryInformation={
 <div className="text-base text-text-tertiary">
 Showing {professionals.length} total professionals. Manage access controls in the settings panel.
 </div>
 }
 >
 <div className="space-y-8">
 <Breadcrumb
 items={[
 { label:"Admin", href:"/admin/dashboard" },
 { label:"Professionals" },
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
 data={professionals}
 columns={columns}
 searchPlaceholder="Search professionals by name..."
 searchKey="fullName"
 filterOptions={[
 {
 label:"Category",
 key:"category",
 options: ["Doctor","Nurse","Caregiver","Physiotherapist"]
 },
 {
 label:"Status",
 key:"status",
 options: ["Active","Inactive","Suspended"]
 }
 ]}
 />
 </div>

 <ProfessionalModal
 isOpen={isModalOpen}
 mode={modalMode}
 initialData={currentProfessional}
 onClose={() => setIsModalOpen(false)}
 onSubmit={async () => {
 setIsModalOpen(false);
 loadData();
 }}
 />
 </PageLayout>
 );
}
