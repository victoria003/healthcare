"use client";

import React, { useState, useEffect } from"react";
import { useRouter, useSearchParams } from"next/navigation";
import {
 Compass,
 CalendarDays,
 FileText,
 Bell,
 User,
 Settings,
 HelpCircle,
 Stethoscope,
 Heart,
 Activity,
 Users,
 Building2,
 UserCheck,
 ShieldCheck,
 ArrowRight,
 Clock,
 ExternalLink,
 MapPin,
 Calendar
} from"lucide-react";
import { PageHeader, CleanCard, EmptyState, StatusBadge, Tabs } from"@/components/DesignSystem";
import PageLayout from"@/components/dashboard/PageLayout";
import { bookingService } from"@/lib/services/booking.service";
import { providerService, MockProfessional } from"@/lib/services/provider.service";
import { Booking, BookingStatus } from"@/types/booking";

export default function PatientDashboardPage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const activeView = searchParams ? searchParams.get("view") ||"dashboard" :"dashboard";

 const [user, setUser] = useState<{ fullName: string; id: string; email: string } | null>(null);
 const [greeting, setGreeting] = useState("Good morning");
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [providers, setProviders] = useState<MockProfessional[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetch("/api/auth/me")
 .then((res) => res.json())
 .then((data) => {
 if (data.success) {
 setUser(data.user);
 } else {
 setUser({ fullName:"Ankala Victoria Rani", id:"u-1", email:"victoriarani.ankala@gmail.com" });
 }
 })
 .catch(() => {
 setUser({ fullName:"Ankala Victoria Rani", id:"u-1", email:"victoriarani.ankala@gmail.com" });
 });

 const hrs = new Date().getHours();
 if (hrs < 12) setGreeting("Good morning");
 else if (hrs < 18) setGreeting("Good afternoon");
 else setGreeting("Good evening");

 // Fetch data for dashboard sections
 Promise.all([bookingService.getBookings(), providerService.getProviders()])
 .then(([bookingsData, providersData]) => {
 setBookings(bookingsData || []);
 setProviders(providersData || []);
 })
 .catch((err) => console.error("Error loading dashboard data:", err))
 .finally(() => setLoading(false));
 }, []);

 const getProviderInfo = (providerId: string) => {
 return providers.find((p) => p.id === providerId);
 };

 // Find next upcoming appointment
 const upcomingBooking = bookings.find(
 (b) => b.status === BookingStatus.Confirmed || b.status === BookingStatus.Pending
 );

 // Recent activity (other completed or historical bookings)
 const recentActivities = bookings.filter((b) => b.id !== upcomingBooking?.id);

 // Format date helper
 const formatDate = (val: string | number) => {
 if (typeof val ==="string" && !isNaN(Number(val))) {
 const date = new Date(Number(val) * 1000);
 return date.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
 }
 return String(val);
 };

 const getBadgeType = (status: BookingStatus) => {
 if (status === BookingStatus.Confirmed || status === BookingStatus.Completed) return"success";
 if (status === BookingStatus.Pending) return"warning";
 if (status === BookingStatus.Cancelled) return"error";
 return"neutral";
 };

 // Subpage active tabs for Profile view
 const [profileTab, setProfileTab] = useState("personal");

 return (
 <div className="w-full">
 {activeView ==="dashboard" && (
 <PageLayout
 title={`Welcome, ${user?.fullName?.split("")[0] ||"Victoria"}`}
 description="Here's what's happening with your care today."
 secondaryInformation={
 <div className="text-base text-text-tertiary">
 Need immediate assistance? Contact our 24/7 support line.
 </div>
 }
 >
 <div className="space-y-10">

 {/* 2. Quick Actions */}
 <section className="space-y-3">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary">Quick Actions</span>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
 {[
 { label:"Book Care", href:"/patient/explore", icon: Compass },
 { label:"Find Doctor", href:"/patient/explore?category=doctor", icon: UserCheck },
 { label:"Medical Records", href:"/patient/medical-records", icon: FileText },
 { label:"Emergency", href:"/patient/dashboard?view=support", icon: Bell },
 { label:"Messages", href:"/patient/dashboard?view=support", icon: HelpCircle },
 { label:"Support", href:"/patient/dashboard?view=support", icon: HelpCircle }
 ].map((act, idx) => (
 <button
 key={idx}
 onClick={() => router.push(act.href)}
 className="flex items-center gap-6 px-3 py-2 bg-white [#12121a] border border-border/50 rounded-lg hover:border-slate-350 :border-border-light hover:bg-bg-alt/50 :bg-primary/50 text-sm font-semibold text-text-secondary transition-all select-none"
 >
 <act.icon className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
 <span>{act.label}</span>
 </button>
 ))}
 </div>
 </section>

 {/* 3. Upcoming Appointment */}
 <section className="space-y-3">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Upcoming Appointment</span>
 {upcomingBooking ? (
 <CleanCard className="hover:border-border :border-slate-750 transition-colors">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="space-y-4 flex-1">
 <div className="flex items-center gap-6">
 <StatusBadge status={upcomingBooking.status} type={getBadgeType(upcomingBooking.status)} />
 <span className="text-sm text-text-tertiary font-medium">#{upcomingBooking.id}</span>
 </div>

 <div className="space-y-1">
 <h3 className="font-bold text-base text-primary">
 {upcomingBooking.serviceName ||"Nursing Care Support"}
 </h3>
 <p className="text-sm text-text-tertiary font-medium">
 Category: {upcomingBooking.serviceCategory ||"Nursing"}
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-tertiary font-medium">
 <span className="flex items-center gap-1.5">
 <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
 {upcomingBooking.date ? formatDate(upcomingBooking.date) :"Today"}
 </span>
 <span className="flex items-center gap-1.5">
 <Clock className="w-3.5 h-3.5 text-text-tertiary" />
 {upcomingBooking.timeSlot || upcomingBooking.time}
 </span>
 {upcomingBooking.address && (
 <span className="flex items-center gap-1.5">
 <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
 {upcomingBooking.address.city}
 </span>
 )}
 </div>
 </div>

 <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border-light">
 {upcomingBooking.assignedStaffId && (
 <div className="flex items-center gap-6">
 <div className="w-8 h-8 rounded-full bg-bg-alt flex items-center justify-center font-bold text-sm uppercase text-text-secondary">
 {getProviderInfo(upcomingBooking.assignedStaffId)?.fullName.charAt(0) ||"P"}
 </div>
 <div className="text-left">
 <span className="text-sm font-semibold text-primary block">
 {getProviderInfo(upcomingBooking.assignedStaffId)?.fullName ||"Priya Sharma, RN"}
 </span>
 <span className="text-base text-slate-450 block">Assigned Provider</span>
 </div>
 </div>
 )}
 <button
 onClick={() => router.push(`/patient/bookings`)}
 className="px-3 py-2.5 border border-border/60 hover:bg-bg-alt :bg-primary rounded-lg text-sm font-semibold text-text-secondary transition-colors"
 >
 Manage Visit
 </button>
 </div>
 </div>
 </CleanCard>
 ) : (
 <CleanCard>
 <EmptyState
 title="No upcoming care visits scheduled"
 description="Find clinical nurses, companions, and therapists nearby to schedule your recovery care."
 action={{ label:"Find Care", onClick: () => router.push("/patient/explore") }}
 />
 </CleanCard>
 )}
 </section>

 {/* 4. Recent Activity & 5. Recommended Services & 6. Recent Notifications */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 {/* Recent Activity (Left column - span 7) */}
 <section className="lg:col-span-7 space-y-3">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Recent Activity</span>
 <CleanCard className="space-y-4">
 {recentActivities.length > 0 ? (
 <div className="divide-y divide-slate-100">
 {recentActivities.slice(0, 3).map((act, idx) => (
 <div key={idx} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
 <div className="space-y-1">
 <span className="text-sm font-semibold text-primary block">
 {act.serviceName ||"Nursing Care Support"}
 </span>
 <span className="text-base text-slate-455 block">
 {act.date ? formatDate(act.date) :"Recent"} • {act.timeSlot || act.time}
 </span>
 </div>
 <StatusBadge status={act.status} type={getBadgeType(act.status)} />
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-slate-450 py-4 text-center">No recent care history.</p>
 )}
 </CleanCard>

 {/* Recommended Services (Sub-item) */}
 <div className="space-y-3 pt-4">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Recommended Services</span>
 <div className="grid grid-cols-2 gap-6">
 {[
 { label:"Nurses", icon: Stethoscope, desc:"Clinical home nurse", id:"Nurses" },
 { label:"Caregivers", icon: Heart, desc:"Elderly & daily assistance", id:"Caregivers" }
 ].map((item, idx) => (
 <button
 key={idx}
 onClick={() => router.push(`/patient/explore?category=${item.id}`)}
 className="flex items-start gap-6 p-6 bg-white [#12121a] border border-border/50 rounded-xl hover:border-slate-350 :border-border-light text-left transition-all"
 >
 <item.icon className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
 <div className="space-y-0.5">
 <span className="text-sm font-bold text-primary block">{item.label}</span>
 <span className="text-base text-slate-450 block">{item.desc}</span>
 </div>
 </button>
 ))}
 </div>
 </div>
 </section>

 {/* Recent Notifications (Right column - span 5) */}
 <section className="lg:col-span-5 space-y-3">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Recent Notifications</span>
 <CleanCard className="flex flex-col justify-between min-h-[160px]">
 <div className="flex items-start gap-6">
 <div className="w-7 h-7 rounded-lg bg-bg-alt border border-border-light flex items-center justify-center text-text-tertiary shrink-0">
 <Bell className="w-3.5 h-3.5" />
 </div>
 <div className="space-y-1">
 <span className="text-sm font-semibold text-slate-850 block">All caught up</span>
 <p className="text-base text-slate-455 leading-normal">
 No new account alerts or scheduling modifications detected.
 </p>
 </div>
 </div>

 <div className="pt-4 border-t border-border-light flex justify-between items-center mt-4">
 <span className="text-base text-slate-450 font-medium">Checked: Just now</span>
 <button
 onClick={() => router.push("/patient/dashboard?view=notifications")}
 className="text-base font-bold text-slate-850 hover:underline flex items-center gap-1"
 >
 <span>View all</span>
 <ArrowRight className="w-3 h-3" />
 </button>
 </div>
 </CleanCard>
 </section>
 </div>
 </div>
 </PageLayout>
 )}

 {/* SUBPAGES IMPLEMENTATION */}
 {activeView ==="notifications" && (
 <div className="space-y-6">
 <PageHeader title="Notifications" description="View account alerts and transaction logs." />
 <CleanCard>
 <EmptyState
 icon={<Bell className="w-5 h-5" />}
 title="You're all caught up"
 description="No new notification events available."
 />
 </CleanCard>
 </div>
 )}

 {activeView ==="profile" && (
 <div className="space-y-6">
 <PageHeader title="Patient Profile" description="Manage your basic patient info, contact endpoints, and credentials." />
 
 <Tabs
 tabs={[
 { id:"personal", label:"Personal" },
 { id:"medical", label:"Medical" },
 { id:"addresses", label:"Addresses" },
 { id:"security", label:"Security" }
 ]}
 activeTab={profileTab}
 onChange={setProfileTab}
 />

 <CleanCard>
 {profileTab ==="personal" && (
 <div className="space-y-6">
 <div className="flex items-center gap-6">
 <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-base flex items-center justify-center select-none uppercase">
 {user?.fullName?.charAt(0) ||"P"}
 </div>
 <div>
 <h3 className="text-base font-semibold text-primary">{user?.fullName}</h3>
 <p className="text-sm text-text-tertiary mt-0.5">{user?.email}</p>
 </div>
 </div>

 <div className="border-t border-border-light pt-6 space-y-4 text-sm font-semibold text-slate-555">
 <div className="flex justify-between">
 <span>Patient Identifier</span>
 <span className="text-primary font-mono">{user?.id}</span>
 </div>
 <div className="flex justify-between">
 <span>Contact Number</span>
 <span className="text-primary">{user?.email ==="victoriarani.ankala@gmail.com" ?"+91 9490123456" :"+91 9999999999"}</span>
 </div>
 </div>
 </div>
 )}

 {profileTab ==="medical" && (
 <div className="space-y-4 text-sm">
 <div className="space-y-1">
 <span className="text-base font-bold uppercase tracking-wider text-slate-450">Primary Diagnosis</span>
 <p className="text-primary font-semibold">Post-Stroke Recovery with Tracheostomy protocol</p>
 </div>
 <div className="space-y-1 pt-2">
 <span className="text-base font-bold uppercase tracking-wider text-slate-455">Allergies</span>
 <div className="flex gap-1.5 mt-1">
 <span className="px-3.5 py-2.5 rounded bg-rose-50 text-rose-700 border border-rose-100/50 font-bold uppercase tracking-wider text-sm">
 Penicillin
 </span>
 </div>
 </div>
 </div>
 )}

 {profileTab ==="addresses" && (
 <div className="space-y-2 text-sm">
 <span className="text-base font-bold uppercase tracking-wider text-slate-455 block">Saved Address</span>
 <p className="text-slate-850 leading-normal font-semibold">
 Flat 402, Gachibowli Heights, Near DLF Cybercity<br />
 Hyderabad, Telangana - 500032
 </p>
 </div>
 )}

 {profileTab ==="security" && (
 <div className="space-y-2 text-sm">
 <span className="text-base font-bold uppercase tracking-wider text-slate-455 block">Password Settings</span>
 <p className="text-text-tertiary leading-relaxed font-medium">
 Authentication is managed securely using credentials linked to your Snowflake identity.
 </p>
 </div>
 )}
 </CleanCard>
 </div>
 )}

 {activeView ==="settings" && (
 <div className="space-y-6">
 <PageHeader title="Settings" description="Manage platform boundaries and notification rules." />
 <CleanCard>
 <h3 className="text-base font-semibold text-primary mb-2">Notification Settings</h3>
 <p className="text-sm text-text-tertiary leading-relaxed">
 Email alerts are dispatched automatically for scheduling confirmations, document reviews, and invoicing updates.
 </p>
 </CleanCard>
 </div>
 )}

 {activeView ==="support" && (
 <div className="space-y-6">
 <PageHeader title="Contact Support" description="Connect with HomeCare's customer advocacy advocates." />
 <CleanCard className="space-y-4">
 <p className="text-sm text-text-tertiary leading-relaxed">
 Have an issue with an ongoing care visit or invoice settlement? Contact our team.
 </p>
 <div className="p-6 bg-bg-alt/50 rounded-lg flex items-center gap-6">
 <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
 <div className="text-sm">
 <span className="font-semibold text-primary block">Support Desk Online</span>
 <span className="text-slate-455 block">Average response time is under 5 minutes</span>
 </div>
 </div>
 </CleanCard>
 </div>
 )}
 </div>
 );
}
