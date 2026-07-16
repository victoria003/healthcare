"use client";

import React, { useState, useEffect } from"react";
import { useRouter } from"next/navigation";
import { Bell, Calendar, Clock, AlertCircle, Sparkles, Inbox, ShieldCheck, MailOpen } from"lucide-react";
import Breadcrumb from"@/components/dashboard/Breadcrumb";
import DashboardCard from"@/components/dashboard/DashboardCard";
import SectionHeader from"@/components/dashboard/SectionHeader";
import EmptyState from"@/components/dashboard/EmptyState";
import PrimaryButton from"@/components/dashboard/PrimaryButton";
import SecondaryButton from"@/components/dashboard/SecondaryButton";
import { notificationService } from"@/lib/services/notification.service";
import { Notification, NotificationType } from"@/types/notification";

export default function PatientNotificationsPage() {
 const router = useRouter();
 const [notifications, setNotifications] = useState<Notification[]>([]);
 const [activeTab, setActiveTab] = useState<"All" |"Unread" |"Booking" |"Reminder" |"System">("All");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 setLoading(true);
 notificationService.getNotifications()
 .then((data) => {
 setNotifications(data || []);
 })
 .catch((err) => console.error("Error loading notifications:", err))
 .finally(() => setLoading(false));
 }, []);

 // Summaries
 const unreadCount = notifications.filter((n) => !n.read).length;
 const readCount = notifications.filter((n) => n.read).length;
 const totalCount = notifications.length;

 // Mark a notification as read (local state only)
 const handleMarkAsRead = (id: string) => {
 setNotifications((prev) =>
 prev.map((n) => (n.id === id ? { ...n, read: true } : n))
 );
 };

 // Filter list
 const filteredNotifications = notifications.filter((n) => {
 if (activeTab ==="All") return true;
 if (activeTab ==="Unread") return !n.read;
 if (activeTab ==="Booking") return n.type === NotificationType.Booking;
 if (activeTab ==="Reminder") return n.type === NotificationType.Reminder;
 if (activeTab ==="System") return n.type === NotificationType.System;
 return true;
 });

 // Render Type Icon
 const renderNotificationIcon = (type: NotificationType) => {
 if (type === NotificationType.Booking) {
 return (
 <div className="w-10 h-10 rounded-xl bg-bg text-secondary flex items-center justify-center border border-blue-100/50 shrink-0">
 <Calendar className="w-5 h-5" />
 </div>
 );
 }
 if (type === NotificationType.Reminder) {
 return (
 <div className="w-10 h-10 rounded-xl bg-bg text-accent-light flex items-center justify-center border border-orange-100/50 shrink-0">
 <Clock className="w-5 h-5" />
 </div>
 );
 }
 if (type === NotificationType.System) {
 return (
 <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shrink-0">
 <AlertCircle className="w-5 h-5" />
 </div>
 );
 }
 // Promotion
 return (
 <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center border border-emerald-100/50 shrink-0">
 <Sparkles className="w-5 h-5" />
 </div>
 );
 };

 // Helper to extract clean date/time strings
 const formatDateTime = (isoString: string) => {
 try {
 const d = new Date(isoString);
 return {
 date: d.toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" }),
 time: d.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" }),
 };
 } catch {
 return { date:"Today", time:"10:00 AM" };
 }
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
 </div>
 );
 }

 return (
 <div className="space-y-16 max-w-[1440px] mx-auto w-full px-5 md:px-8 lg:px-10 py-6">
 {/* 1. Breadcrumb */}
 <Breadcrumb
 items={[
 { label:"Dashboard", href:"/patient/dashboard" },
 { label:"Notifications" },
 ]}
 />

 {/* 2. Page Header */}
 <div className="space-y-1">
 <h1 className="text-3xl font-bold tracking-tight text-primary">
 Notification Inbox
 </h1>
 <p className="text-base text-text-tertiary font-medium">
 Stay updated with your diagnostic scheduling requests and important system alerts.
 </p>
 </div>

 {/* 3. Notification Summary Dashboard */}
 <div className="grid grid-cols-3 gap-6">
 {[
 { label:"Unread Alerts", val: unreadCount },
 { label:"Read Messages", val: readCount },
 { label:"Total Notifications", val: totalCount },
 ].map((card) => (
 <div key={card.label} className="bg-white [#12121a] border border-border/60 rounded-[24px] p-6 shadow-xs flex flex-col justify-between">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block mb-3">{card.label}</span>
 <span className="text-3xl font-bold text-primary leading-none">{card.val}</span>
 </div>
 ))}
 </div>

 {/* 4. Filter Chips Tab Menu */}
 <div className="space-y-4">
 <span className="text-base font-bold uppercase tracking-wider text-text-tertiary block">Filter Alerts</span>
 <div className="flex gap-6 overflow-x-auto scrollbar-none py-2 select-none">
 {(["All","Unread","Booking","Reminder","System"] as const).map((tab) => {
 const isActive = activeTab === tab;
 return (
 <button
 key={tab}
 type="button"
 onClick={() => setActiveTab(tab)}
 className={`px-5 py-2 text-sm font-semibold rounded-full border transition-all whitespace-nowrap ${
 isActive
 ?"bg-primary border-slate-900 text-white shadow-xs"
 :"bg-white border-border/60 [#12121a] text-slate-505 hover:text-primary :text-white"
 }`}
 >
 {tab}
 </button>
 );
 })}
 </div>
 </div>

 {/* 5. Grouped Notification Feed */}
 <section className="space-y-6 max-w-4xl">
 {filteredNotifications.length === 0 ? (
 <EmptyState
 icon={<Inbox className="w-5 h-5 animate-pulse" />}
 title="You're all caught up!"
 description="No new alerts or scheduling requests found. We'll update you when there's activity on your care timeline."
 buttonLabel="Explore Care"
 buttonLink="/patient/explore"
 />
 ) : (
 <div className="space-y-4">
 {filteredNotifications.map((notif) => {
 const { date, time } = formatDateTime(notif.createdAt);
 return (
 <DashboardCard
 key={notif.id}
 className={`!p-8 flex flex-col sm:flex-row gap-8 items-start justify-between rounded-[24px] border-l-4 transition-all hover:shadow-md ${
 notif.read
 ?"border-l-transparent"
 :"border-l-orange-500 bg-bg/5"
 }`}
 >
 <div className="flex gap-6 items-start min-w-0">
 {renderNotificationIcon(notif.type)}
 <div className="space-y-1.5 min-w-0">
 <div className="flex flex-wrap items-center gap-6">
 <h3 className={`text-base text-primary leading-none ${notif.read ?"font-semibold" :"font-extrabold text-orange-655"}`}>
 {notif.title}
 </h3>
 <span className={`inline-flex items-center text-base font-semibold px-3 py-2.5 rounded-full border leading-none ${
 notif.read
 ?"bg-bg-alt text-text-tertiary border-border/40"
 :"bg-bg text-orange-655 border-orange-100/50"
 }`}>
 {notif.read ?"Read" :"Unread"}
 </span>
 </div>
 <p className="text-sm text-text-tertiary leading-relaxed">
 {notif.message}
 </p>
 <div className="flex items-center gap-6 text-sm text-text-tertiary pt-1.5 font-medium">
 <span className="flex items-center gap-1">
 <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
 {date}
 </span>
 <span>&middot;</span>
 <span className="flex items-center gap-1">
 <Clock className="w-3.5 h-3.5 text-text-tertiary" />
 {time}
 </span>
 </div>
 </div>
 </div>

 {/* Actions Column */}
 <div className="flex gap-6 w-full sm:w-auto self-end sm:self-center pt-3 sm:pt-0 border-t border-border-light sm:border-0 select-none">
 {!notif.read && (
 <SecondaryButton
 onClick={() => handleMarkAsRead(notif.id)}
 className="flex-1 sm:flex-initial text-sm font-semibold py-2 px-3 flex items-center justify-center gap-1.5"
 aria-label="Mark notification as read"
 >
 <MailOpen className="w-4 h-4 text-text-tertiary" />
 Mark as Read
 </SecondaryButton>
 )}
 <PrimaryButton
 onClick={() => router.push("/patient/bookings")}
 className="flex-1 sm:flex-initial text-sm font-semibold py-2 px-3 flex items-center justify-center gap-1.5"
 aria-label="View associated bookings"
 >
 View Booking
 </PrimaryButton>
 </div>
 </DashboardCard>
 );
 })}
 </div>
 )}
 </section>
 </div>
 );
}
