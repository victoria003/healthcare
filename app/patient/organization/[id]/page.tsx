"use client";

import React, { useState, useEffect } from"react";
import { useParams, useRouter } from"next/navigation";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import { organizationService, MockOrganization } from"@/lib/services/organization.service";

export default function OrganizationDetailPage() {
 const params = useParams();
 const router = useRouter();
 const orgId = params ? (Array.isArray(params.id) ? params.id[0] : params.id) :"";
 const [organization, setOrganization] = useState<MockOrganization | undefined>(undefined);

 useEffect(() => {
 if (orgId) {
 organizationService.getOrganizationById(orgId).then((data) => setOrganization(data));
 }
 }, [orgId]);

 return (
 <div className="space-y-6">
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/patient/dashboard" },
 { label:"Explore Care", href:"/patient/explore" },
 { label:"Organization Details" },
 ]}
 />

 <DashboardCard className="p-12 text-center max-w-xl mx-auto mt-10">
 <h1 className="text-2xl font-black text-primary">Coming Soon</h1>
 <p className="text-sm text-text-tertiary mt-2 max-w-sm mx-auto leading-relaxed">
 The regulatory certification timeline, branch audit ledgers, service rate sheets, and clinical reports matching for organization <strong className="text-accent-light font-extrabold">{organization ? organization.name : orgId}</strong> is under preparation.
 </p>
 <PrimaryButton onClick={() => router.push("/patient/explore")} className="mt-6">
 Back to Explore
 </PrimaryButton>
 </DashboardCard>
 </div>
 );
}
