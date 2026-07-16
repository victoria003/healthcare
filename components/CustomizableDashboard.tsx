"use client";

import React, { useState, useEffect, useRef } from"react";
import { motion, AnimatePresence } from"motion/react";
import { 
 GripVertical, Maximize2, Minimize2, Eye, EyeOff, 
 RotateCcw, Save, Copy, Plus, X, Search, Pin, PinOff, Star, 
 Clock, CheckCircle, AlertTriangle, Play, Check, Navigation, 
 Heart, AlertCircle, FileText, ChevronRight, PlusCircle, Activity, 
 TrendingUp, Users, DollarSign, Calendar, MapPin, ShieldAlert, 
 CheckSquare, MessageSquare, Info, ShieldCheck, ListOrdered, 
 Bell, Award, Percent, HardDrive, Smartphone, Zap
} from"lucide-react";
import { useTheme } from"./ThemeContext";

// Define TypeScript Interfaces for Dashboard State
export interface WidgetConfig {
 id: string;
 title: string;
 size:"small" |"medium" |"large" |"full";
 hidden: boolean;
 order: number;
}

interface CustomizableDashboardProps {
 userRole: string;
 userName: string;
 userId: string;
 onNavigateToTab: (tabId: string) => void;
 onOpenBookingFlow?: () => void;
 onOpenLoginModal?: () => void;
}

export default function CustomizableDashboard({
 userRole,
 userName,
 userId,
 onNavigateToTab,
 onOpenBookingFlow,
 onOpenLoginModal
}: CustomizableDashboardProps) {
 const { theme, setTheme } = useTheme();
 
 // Storage keys unique to user ID and role
 const STORAGE_KEY =`hc_dash_layout_${userId ||"anon"}_${userRole.replace(/\s+/g,"_")}`;
 const SHORTCUTS_KEY =`hc_dash_shortcuts_${userId ||"anon"}_${userRole.replace(/\s+/g,"_")}`;
 const FAVORITES_KEY =`hc_dash_fav_reports_${userId ||"anon"}_${userRole.replace(/\s+/g,"_")}`;

 // State Management
 const [isEditMode, setIsEditMode] = useState(false);
 const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
 const [draggedId, setDraggedId] = useState<string | null>(null);
 const [dragOverId, setDragOverId] = useState<string | null>(null);
 const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

 // Snowflake connection states
 const [sfConnected, setSfConnected] = useState(false);
 const [sfLoading, setSfLoading] = useState(true);

 useEffect(() => {
 const fetchSfStatus = async () => {
 try {
 const res = await fetch("/api/snowflake/status");
 const data = await res.json();
 if (data.success) {
 setSfConnected(data.isConnected);
 }
 } catch (e) {
 console.error(e);
 } finally {
 setSfLoading(false);
 }
 };
 fetchSfStatus();

 const handleSfConnected = () => {
 setSfConnected(true);
 };
 window.addEventListener("snowflakeConnected", handleSfConnected);
 return () => {
 window.removeEventListener("snowflakeConnected", handleSfConnected);
 };
 }, []);

 // Notifications State
 const [notifications, setNotifications] = useState([
 { id:"n-1", title:"Booking Accepted", message:"Nisarga Agency accepted ICU Tracheostomy care plan.", time:"2m ago", read: false, priority:"high", category:"bookings" },
 { id:"n-2", title:"Compliance Document Approved", message:"Agency GST certification verified against Snowflake registry.", time:"1h ago", read: false, priority:"medium", category:"verification" },
 { id:"n-3", title:"Shift Checklist Completed", message:"Nurse logged patient vitals successfully.", time:"3h ago", read: true, priority:"low", category:"visits" },
 { id:"n-4", title:"System Scheduled Maintenance", message:"Analytical stream logs will sync tomorrow at 02:00 AM UTC.", time:"1d ago", read: true, priority:"medium", category:"announcements" }
 ]);
 const [notifSearch, setNotifSearch] = useState("");
 const [notifFilter, setNotifFilter] = useState("all"); // 'all', 'unread', 'high'
 const [showNotifCenter, setShowNotifCenter] = useState(false);

 // Pinned Shortcuts State
 const [pinnedShortcuts, setPinnedShortcuts] = useState<string[]>([]);
 const [shortcutSearch, setShortcutSearch] = useState("");
 const [isAddingShortcut, setIsAddingShortcut] = useState(false);

 // Favorite Reports State
 const [favReports, setFavReports] = useState<string[]>([]);
 const [reportSearch, setReportSearch] = useState("");
 const [recentlyViewed, setRecentlyViewed] = useState<string[]>([
"Weekly Revenue Audit","Compliance Performance Tracing","Clinical SLA Violations"
 ]);

 // Vitals simulation (Patient only)
 const [vitals, setVitals] = useState({ sys: 120, dia: 80, pulse: 72, temp: 98.6, spo2: 98 });
 
 // Track visual feedback
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [uploadedReports, setUploadedReports] = useState<string[]>([]);

 // Default Action Handlers
 const handleShortcutClick = (action: string) => {
 if (action ==="Book Service" || action ==="Find Agency") {
 if (onOpenBookingFlow) onOpenBookingFlow();
 onNavigateToTab("marketplace");
 } else if (action ==="Calendar") {
 onNavigateToTab("staff_roster");
 } else if (action ==="Invoices") {
 onNavigateToTab("billing_invoices");
 } else if (action ==="Reports" || action ==="Analytics") {
 onNavigateToTab("saas_analytics");
 } else if (action ==="Add Patient" || action ==="Assign Staff" || action ==="Approve Agency" || action ==="Verify Staff") {
 onNavigateToTab("compliance");
 } else {
 setSaveSuccess(`Triggered Shortcut Action: ${action}`);
 setTimeout(() => setSaveSuccess(null), 3000);
 }
 };

 // Factory Default Widgets Lists per Role
 const getDefaultWidgets = (): WidgetConfig[] => {
 let list: Omit<WidgetConfig,"order" |"hidden">[] = [];

 if (["Patient","Family Member"].includes(userRole)) {
 list = [
 { id:"upcoming_visits", title:"Upcoming Care Visits", size:"medium" },
 { id:"medical_timeline", title:"Medical Audit Timeline", size:"medium" },
 { id:"current_care_plan", title:"Current Care Plan Details", size:"medium" },
 { id:"health_summary", title:"Vitals & Health Summary", size:"medium" },
 { id:"recent_reports", title:"Vetted Diagnostic Reports", size:"small" },
 { id:"invoices", title:"Patient Due Invoices", size:"small" },
 { id:"emergency_contacts", title:"SOS & Emergency Contacts", size:"small" },
 { id:"recent_activity", title:"Recent Activity Feed", size:"medium" },
 { id:"quick_actions", title:"Quick Actions Desk", size:"small" },
 { id:"favorite_reports", title:"Favorite Analytical Reports", size:"small" }
 ];
 } else if (["Home Healthcare Agency","Agency Admin","Agency Owner"].includes(userRole)) {
 list = [
 { id:"revenue_performance", title:"Real-time Gross Revenue", size:"medium" },
 { id:"todays_bookings", title:"Today's Dispatch Roster", size:"medium" },
 { id:"staff_availability", title:"Staff Availability Metrics", size:"small" },
 { id:"pending_requests", title:"Pending Care Requests", size:"medium" },
 { id:"mini_calendar", title:"Shifts Care Calendar", size:"large" },
 { id:"verification_status", title:"Licensing Verification Badge", size:"small" },
 { id:"performance_analytics", title:"Clinical Response Metrics", size:"medium" },
 { id:"payments_ledger", title:"Tax & commission Ledgers", size:"small" },
 { id:"recent_activity", title:"Recent Activity Feed", size:"medium" },
 { id:"quick_actions", title:"Quick Actions Desk", size:"small" },
 { id:"favorite_reports", title:"Favorite Analytical Reports", size:"small" }
 ];
 } else if (["Nurse","Caregiver","Physiotherapist","Doctor"].includes(userRole)) {
 list = [
 { id:"todays_schedule", title:"Today's Clinical Visits", size:"medium" },
 { id:"assigned_patients", title:"Assigned Patient Profiles", size:"medium" },
 { id:"visit_timeline", title:"Active Visit Milestones", size:"medium" },
 { id:"navigation_map", title:"Location & Patient Routes", size:"small" },
 { id:"check_in_selfie", title:"Selfie & GPS Verification", size:"small" },
 { id:"pending_tasks", title:"Shift Checklist Tasks", size:"medium" },
 { id:"attendance_logs", title:"Clock-In & Logged Hours", size:"small" },
 { id:"performance_ratings", title:"Patient Review Scores", size:"small" },
 { id:"announcements", title:"Emergency Directives", size:"medium" },
 { id:"recent_activity", title:"Recent Activity Feed", size:"medium" },
 { id:"quick_actions", title:"Quick Actions Desk", size:"small" },
 { id:"favorite_reports", title:"Favorite Analytical Reports", size:"small" }
 ];
 } else {
 // Platform Admin / Default
 list = [
 { id:"platform_revenue", title:"Platform SaaS Commissions", size:"medium" },
 { id:"global_bookings", title:"Global Network Bookings", size:"medium" },
 { id:"active_agencies", title:"Active Vetted Agencies", size:"small" },
 { id:"system_directory", title:"System Patient & Staff Count", size:"small" },
 { id:"verification_queue", title:"Compliance Document Queue", size:"medium" },
 { id:"saas_subscriptions", title:"Subscription Tier Health", size:"small" },
 { id:"support_tickets", title:"Operational Support Tickets", size:"medium" },
 { id:"immutable_audit", title:"Immutable Snowflake Audit Logs", size:"medium" },
 { id:"system_health", title:"Analytical Latency Monitor", size:"small" },
 { id:"growth_analytics", title:"Weekly Network Growth", size:"medium" },
 { id:"recent_activity", title:"Recent Activity Feed", size:"medium" },
 { id:"quick_actions", title:"Quick Actions Desk", size:"small" },
 { id:"favorite_reports", title:"Favorite Analytical Reports", size:"small" }
 ];
 }

 return list.map((w, index) => ({
 ...w,
 order: index,
 hidden: false
 }));
 };

 // Default Shortcuts Options
 const getAllShortcutsOptions = () => {
 if (["Patient","Family Member"].includes(userRole)) {
 return ["Book Service","Find Agency","Upload Report","Pay Invoice","Support Desk","Invoices"];
 } else if (["Home Healthcare Agency","Agency Admin","Agency Owner"].includes(userRole)) {
 return ["New Booking","Assign Staff","Create Invoice","Manage Schedule","Reports","Analytics"];
 } else if (["Nurse","Caregiver","Physiotherapist","Doctor"].includes(userRole)) {
 return ["Start Visit","Check-In","View Schedule","Upload Notes","Support Desk"];
 } else {
 return ["Approve Agency","Verify Staff","Generate Report","Platform Settings","Analytics","Reports"];
 }
 };

 const getDefaultPinnedShortcuts = () => {
 const opts = getAllShortcutsOptions();
 return opts.slice(0, 3);
 };

 // Default Reports List
 const getAllReportsOptions = () => [
"Weekly Revenue Audit",
"Compliance Performance Tracing",
"Clinical SLA Violations",
"Patient Check-In Logs",
"Twilio SMS Log Sync",
"Snowflake Query Benchmarks",
"Agency Settlement Ledgers"
 ];

 // Initialize and Load Saved Settings
 useEffect(() => {
 // 1. Load Widgets Layout
 const savedLayout = localStorage.getItem(STORAGE_KEY);
 if (savedLayout) {
 try {
 setWidgets(JSON.parse(savedLayout));
 } catch (e) {
 setWidgets(getDefaultWidgets());
 }
 } else {
 setWidgets(getDefaultWidgets());
 }

 // 2. Load Pinned Shortcuts
 const savedShortcuts = localStorage.getItem(SHORTCUTS_KEY);
 if (savedShortcuts) {
 try {
 setPinnedShortcuts(JSON.parse(savedShortcuts));
 } catch (e) {
 setPinnedShortcuts(getDefaultPinnedShortcuts());
 }
 } else {
 setPinnedShortcuts(getDefaultPinnedShortcuts());
 }

 // 3. Load Favorite Reports
 const savedFavs = localStorage.getItem(FAVORITES_KEY);
 if (savedFavs) {
 try {
 setFavReports(JSON.parse(savedFavs));
 } catch (e) {
 setFavReports(["Weekly Revenue Audit"]);
 }
 } else {
 setFavReports(["Weekly Revenue Audit"]);
 }
 }, [userRole, userId]);

 // Layout Savers & Resizers
 const saveLayout = (updatedWidgets: WidgetConfig[]) => {
 setWidgets(updatedWidgets);
 localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWidgets));
 
 // Quick auto-save feedback
 setSaveSuccess("Dashboard Layout Persisted Successfully!");
 setTimeout(() => setSaveSuccess(null), 2500);
 };

 const resetLayout = () => {
 const defaults = getDefaultWidgets();
 saveLayout(defaults);
 };

 const duplicateLayout = () => {
 const duplicated = widgets.map(w => ({ ...w }));
 saveLayout(duplicated);
 setSaveSuccess("Dashboard Layout Duplicated Successfully!");
 setTimeout(() => setSaveSuccess(null), 2500);
 };

 const toggleWidgetHidden = (id: string) => {
 const updated = widgets.map(w => w.id === id ? { ...w, hidden: !w.hidden } : w);
 saveLayout(updated);
 };

 const handleResizeWidget = (id: string, newSize:"small" |"medium" |"large" |"full") => {
 const updated = widgets.map(w => w.id === id ? { ...w, size: newSize } : w);
 saveLayout(updated);
 };

 // Native HTML5 Drag and Drop Handlers (With Framer Motion transition support)
 const handleDragStart = (e: React.DragEvent, id: string) => {
 setDraggedId(id);
 e.dataTransfer.effectAllowed ="move";
 };

 const handleDragEnter = (e: React.DragEvent, id: string) => {
 e.preventDefault();
 if (draggedId === id) return;
 setDragOverId(id);

 // Swap widget orders in state on-the-fly during dragging
 const dragIdx = widgets.findIndex(w => w.id === draggedId);
 const hoverIdx = widgets.findIndex(w => w.id === id);
 if (dragIdx === -1 || hoverIdx === -1) return;

 const reordered = [...widgets];
 const [draggedItem] = reordered.splice(dragIdx, 1);
 reordered.splice(hoverIdx, 0, draggedItem);

 // Update order values
 const updated = reordered.map((w, idx) => ({ ...w, order: idx }));
 setWidgets(updated);
 };

 const handleDragEnd = () => {
 setDraggedId(null);
 setDragOverId(null);
 saveLayout(widgets);
 };

 // Mobile Manual Reorder Handler
 const handleMoveWidget = (index: number, direction:"up" |"down") => {
 const targetIdx = direction ==="up" ? index - 1 : index + 1;
 if (targetIdx < 0 || targetIdx >= widgets.length) return;

 const reordered = [...widgets];
 const temp = reordered[index];
 reordered[index] = reordered[targetIdx];
 reordered[targetIdx] = temp;

 const updated = reordered.map((w, idx) => ({ ...w, order: idx }));
 saveLayout(updated);
 };

 // Pinned Shortcuts Logic
 const handlePinShortcut = (sh: string) => {
 let updated;
 if (pinnedShortcuts.includes(sh)) {
 updated = pinnedShortcuts.filter(x => x !== sh);
 } else {
 updated = [...pinnedShortcuts, sh];
 }
 setPinnedShortcuts(updated);
 localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(updated));
 };

 // Favorite Reports Logic
 const handleToggleFavReport = (report: string) => {
 let updated;
 if (favReports.includes(report)) {
 updated = favReports.filter(x => x !== report);
 } else {
 updated = [...favReports, report];
 }
 setFavReports(updated);
 localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
 };

 // Mapping Widget sizes to Tailwind Columns
 const getColSpanClass = (size:"small" |"medium" |"large" |"full") => {
 switch (size) {
 case"small": return"col-span-1";
 case"medium": return"col-span-1 md:col-span-2";
 case"large": return"col-span-1 md:col-span-3";
 case"full": return"col-span-1 md:col-span-4";
 default: return"col-span-1 md:col-span-2";
 }
 };

 // Get active notification count
 const unreadCount = notifications.filter(n => !n.read).length;

 return (
 <div className="space-y-8">
 
 {/* 1. PREMIUM HEADER CONTROLS (Airbnb & Stripe Style) */}
 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-border p-6 rounded-3xl shadow-sm">
 <div className="space-y-1">
 <span className="text-base font-extrabold text-accent uppercase tracking-widest block">
 Customizable Analytics Desk
 </span>
 <h1 className="text-xl md:text-2xl font-black text-primary tracking-tight">
 Welcome back, {userName ||"Clinical Director"}
 </h1>
 <p className="text-text-tertiary text-sm font-semibold">
 Enterprise Hub for Role: <span className="text-primary font-bold">{userRole}</span>
 </p>
 </div>

 {/* Dashboard Manager controls */}
 <div className="flex flex-wrap items-center gap-6">
 <button
 onClick={() => setIsEditMode(!isEditMode)}
 className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
 isEditMode 
 ?"bg-accent border-accent text-white shadow-md shadow-teal-500/10" 
 :"bg-bg-alt border-border text-text-secondary hover:bg-bg-alt"
 }`}
 >
 <GripVertical className="w-3.5 h-3.5" />
 {isEditMode ?"Exit Customization" :"Configure Layout"}
 </button>

 <button
 onClick={resetLayout}
 title="Restore Factory-Default Layout"
 className="p-2 bg-bg-alt border border-border rounded-xl text-text-tertiary hover:text-primary :text-white cursor-pointer transition-colors"
 >
 <RotateCcw className="w-4 h-4" />
 </button>

 <button
 onClick={duplicateLayout}
 title="Duplicate Current Layout Template"
 className="p-2 bg-bg-alt border border-border rounded-xl text-text-tertiary hover:text-primary :text-white cursor-pointer transition-colors"
 >
 <Copy className="w-4 h-4" />
 </button>

 {/* Dedicated Notification Center Trigger */}
 <div className="relative">
 <button
 onClick={() => setShowNotifCenter(!showNotifCenter)}
 className="p-2 bg-bg-alt border border-border rounded-xl text-text-tertiary hover:text-primary :text-white cursor-pointer transition-colors relative"
 >
 <Bell className="w-4 h-4" />
 {unreadCount > 0 && (
 <span className="absolute -top-1 -right-1 bg-accent text-primary font-black text-sm w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
 {unreadCount}
 </span>
 )}
 </button>
 </div>
 </div>
 </header>

 {/* 2. AUTO-SAVE TOAST */}
 <AnimatePresence>
 {saveSuccess && (
 <motion.div
 initial={{ opacity: 0, y: -15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="p-3 bg-accent text-primary font-bold text-sm rounded-xl flex items-center gap-6 border border-emerald-400 shadow-lg z-50 fixed top-6 right-6"
 >
 <Check className="w-4 h-4 shrink-0" />
 <span>{saveSuccess}</span>
 </motion.div>
 )}
 </AnimatePresence>

 {/* 3. DEDICATED NOTIFICATION CENTER DRAWER / OVERLAY */}
 <AnimatePresence>
 {showNotifCenter && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height:"auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="bg-white border border-border rounded-3xl p-6 shadow-xl space-y-4"
 >
 <div className="flex items-center justify-between border-b border-border-light pb-3">
 <div className="flex items-center gap-6">
 <Bell className="w-5 h-5 text-accent" />
 <h3 className="font-extrabold text-primary text-base">Central Notification Hub</h3>
 <span className="bg-accent/15 text-accent font-black text-base px-3 py-2.5 rounded-full">
 {unreadCount} Unread
 </span>
 </div>
 <div className="flex items-center gap-6">
 <button
 onClick={() => {
 const marked = notifications.map(n => ({ ...n, read: true }));
 setNotifications(marked);
 }}
 className="text-base font-bold text-accent hover:underline cursor-pointer"
 >
 Mark all as read
 </button>
 <span className="text-white">|</span>
 <button
 onClick={() => setShowNotifCenter(false)}
 className="text-text-tertiary hover:text-text-secondary p-1"
 >
 <X className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Notification Filters */}
 <div className="flex flex-col sm:flex-row gap-6 items-center justify-between text-sm pt-1">
 <div className="flex items-center gap-1.5 p-1 bg-bg-alt rounded-xl border border-slate-150">
 <button
 onClick={() => setNotifFilter("all")}
 className={`px-3 py-2.5 rounded-lg font-bold transition-all ${notifFilter ==="all" ?"bg-white text-primary shadow-xs" :"text-text-tertiary hover:text-text-secondary"}`}
 >
 All
 </button>
 <button
 onClick={() => setNotifFilter("unread")}
 className={`px-3 py-2.5 rounded-lg font-bold transition-all ${notifFilter ==="unread" ?"bg-white text-primary shadow-xs" :"text-text-tertiary hover:text-text-secondary"}`}
 >
 Unread
 </button>
 <button
 onClick={() => setNotifFilter("high")}
 className={`px-3 py-2.5 rounded-lg font-bold transition-all ${notifFilter ==="high" ?"bg-white text-primary shadow-xs" :"text-text-tertiary hover:text-text-secondary"}`}
 >
 High Priority
 </button>
 </div>

 {/* Notification Search */}
 <div className="relative w-full sm:w-60">
 <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-tertiary" />
 <input
 type="text"
 value={notifSearch}
 onChange={(e) => setNotifSearch(e.target.value)}
 placeholder="Search notification texts..."
 className="w-full pl-8 pr-3 py-2 text-sm bg-bg-alt border border-border rounded-xl focus:outline-none"
 />
 </div>
 </div>

 {/* Notifications List render */}
 <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
 {notifications
 .filter(n => {
 if (notifFilter ==="unread" && n.read) return false;
 if (notifFilter ==="high" && n.priority !=="high") return false;
 if (notifSearch && !n.title.toLowerCase().includes(notifSearch.toLowerCase()) && !n.message.toLowerCase().includes(notifSearch.toLowerCase())) return false;
 return true;
 })
 .map(n => (
 <div
 key={n.id}
 className={`p-3 rounded-xl border flex items-start gap-6 transition-colors ${
 n.read 
 ?"bg-bg-alt/50 border-border-light" 
 :"bg-accent/5 border-accent/20"
 }`}
 >
 <div className="mt-1">
 {n.priority ==="high" ? (
 <AlertTriangle className="w-4 h-4 text-rose-500" />
 ) : (
 <CheckCircle className="w-4 h-4 text-accent" />
 )}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between gap-6">
 <h4 className={`text-sm font-bold ${n.read ?"text-text-secondary" :"text-primary"}`}>{n.title}</h4>
 <span className="text-base text-text-tertiary font-medium shrink-0">{n.time}</span>
 </div>
 <p className="text-base text-text-tertiary mt-0.5 font-medium">{n.message}</p>
 </div>
 <div className="flex items-center gap-1.5 shrink-0 self-center">
 {!n.read && (
 <button
 onClick={() => {
 setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x));
 }}
 className="p-1 hover:bg-slate-200 :bg-primary rounded-lg text-text-tertiary"
 title="Mark as Read"
 >
 <Check className="w-3.5 h-3.5" />
 </button>
 )}
 <button
 onClick={() => {
 setNotifications(notifications.filter(x => x.id !== n.id));
 }}
 className="p-1 hover:bg-slate-200 :bg-primary rounded-lg text-text-tertiary hover:text-rose-500"
 title="Delete Notification"
 >
 <X className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* 4. PINNED SHORTCUTS WIDGET (Linear Style) */}
 <section className="bg-white border border-border p-6 rounded-3xl shadow-sm space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
 <div className="flex items-center gap-6">
 <Pin className="w-4 h-4 text-accent" />
 <h3 className="font-extrabold text-primary text-sm md:text-base tracking-tight">Pinned Console Shortcuts</h3>
 </div>

 {/* Search & Pin shortcuts */}
 <div className="flex items-center gap-6">
 <div className="relative w-44 md:w-52">
 <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-text-tertiary" />
 <input
 type="text"
 value={shortcutSearch}
 onChange={(e) => setShortcutSearch(e.target.value)}
 placeholder="Search shortcuts..."
 className="w-full pl-8 pr-2 py-2.5 text-sm bg-bg-alt border border-border rounded-lg focus:outline-none"
 />
 </div>
 
 <button
 onClick={() => setIsAddingShortcut(!isAddingShortcut)}
 className="p-2 bg-bg-alt rounded-lg border border-border text-text-tertiary hover:text-primary :text-white cursor-pointer"
 >
 <Plus className="w-3.5 h-3.5" />
 </button>
 </div>
 </div>

 {/* Dynamic addition menu dropdown */}
 <AnimatePresence>
 {isAddingShortcut && (
 <motion.div
 initial={{ opacity: 0, y: -5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 className="p-6 bg-bg-alt rounded-2xl border border-border space-y-2"
 >
 <h5 className="text-base font-extrabold text-text-tertiary uppercase tracking-widest">Pin or Unpin Shortcuts</h5>
 <div className="flex flex-wrap gap-6">
 {getAllShortcutsOptions().map(sh => {
 const isPinned = pinnedShortcuts.includes(sh);
 return (
 <button
 key={sh}
 onClick={() => handlePinShortcut(sh)}
 className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
 isPinned 
 ?"bg-accent-light text-accent border border-accent font-black" 
 :"bg-white text-text-tertiary border border-border hover:bg-bg-alt"
 }`}
 >
 {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
 {sh}
 </button>
 );
 })}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Render Pinned shortcuts block */}
 <div className="flex flex-wrap gap-6">
 {pinnedShortcuts
 .filter(x => shortcutSearch ? x.toLowerCase().includes(shortcutSearch.toLowerCase()) : true)
 .map(sh => (
 <motion.button
 whileHover={{ scale: 1.02, y: -1 }}
 key={sh}
 onClick={() => handleShortcutClick(sh)}
 className="px-5 py-2.5 bg-primary hover:bg-accent :bg-accent text-white rounded-xl text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-6 cursor-pointer shadow-xs"
 >
 <Zap className="w-3.5 h-3.5 text-teal-400 shrink-0" />
 <span>{sh}</span>
 </motion.button>
 ))}
 {pinnedShortcuts.length === 0 && (
 <span className="text-text-tertiary text-sm font-medium italic">No shortcuts pinned to this dashboard. Click the '+' button to assign quick launchers.</span>
 )}
 </div>
 </section>

 {/* 5. ADD WIDGET DRAWER (Shown in Edit Mode) */}
 <AnimatePresence>
 {isEditMode && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="p-6 bg-primary text-white rounded-3xl border border-border-light space-y-4"
 >
 <div className="flex items-center justify-between border-b border-border-light pb-2">
 <h4 className="text-sm font-extrabold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
 <PlusCircle className="w-4 h-4" />
 Custom Widget Deployment Tray
 </h4>
 <p className="text-base text-text-tertiary">Enable or disable analytics boards inside your live environment.</p>
 </div>
 
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {widgets.map(w => (
 <button
 key={w.id}
 onClick={() => toggleWidgetHidden(w.id)}
 className={`p-3 rounded-xl border text-left text-sm font-bold transition-all flex items-center justify-between ${
 w.hidden 
 ?"bg-primary/40 border-border-light text-text-tertiary hover:bg-primary/20" 
 :"bg-accent/10 border-accent/30 text-teal-400"
 }`}
 >
 <span className="truncate">{w.title}</span>
 {w.hidden ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
 </button>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* 6. MAIN WIDGETS DISPLAY GRID (Stripe Style) */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {widgets
 .filter(w => !w.hidden)
 .sort((a, b) => a.order - b.order)
 .map((w, index) => {
 const isDragged = draggedId === w.id;
 const isDragOver = dragOverId === w.id;

 return (
 <div
 key={w.id}
 className={getColSpanClass(w.size)}
 draggable={!showNotifCenter && !isAddingShortcut && !uploadedReports.length}
 onDragStart={(e) => handleDragStart(e, w.id)}
 onDragEnter={(e) => handleDragEnter(e, w.id)}
 onDragOver={(e) => e.preventDefault()}
 onDragEnd={handleDragEnd}
 >
 <motion.div
 layout
 className={`w-full h-full group relative rounded-3xl bg-white border ${
 isDragged 
 ?"border-accent opacity-40 shadow-2xl scale-95" 
 : isDragOver 
 ?"border-indigo-500 bg-primary/5 shadow-md" 
 :"border-border"
 } shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between`}
 >
 
 {/* WIDGET TITLE & CONTROLS HEADER */}
 <div className="p-6 border-b border-border-light flex items-center justify-between bg-bg-alt/50 shrink-0">
 <div className="flex items-center gap-6 min-w-0">
 <div className="text-text-tertiary cursor-grab active:cursor-grabbing hover:text-text-secondary :text-white transition-colors">
 <GripVertical className="w-4 h-4 shrink-0" />
 </div>
 <h4 className="font-bold text-primary text-sm truncate">
 {w.title}
 </h4>
 </div>

 {/* Edit tools inside headers */}
 {isEditMode ? (
 <div className="flex items-center gap-1.5 shrink-0">
 {/* Resize Toggle controls */}
 <button
 onClick={() => handleResizeWidget(w.id, w.size ==="small" ?"medium" : w.size ==="medium" ?"large" : w.size ==="large" ?"full" :"small")}
 className="p-1 hover:bg-slate-200 :bg-primary rounded text-text-tertiary hover:text-text-secondary transition-colors"
 title="Rotate Widget Card Size"
 >
 <Maximize2 className="w-3 h-3" />
 </button>
 
 <button
 onClick={() => toggleWidgetHidden(w.id)}
 className="p-1 hover:bg-slate-200 :bg-primary rounded text-text-tertiary hover:text-rose-500 transition-colors"
 title="Hide Widget"
 >
 <X className="w-3 h-3" />
 </button>

 {/* Mobile Up/Down buttons */}
 <div className="flex md:hidden gap-1">
 <button onClick={() => handleMoveWidget(index,"up")} className="p-0.5 border border-border text-base">▲</button>
 <button onClick={() => handleMoveWidget(index,"down")} className="p-0.5 border border-border text-base">▼</button>
 </div>
 </div>
 ) : (
 <span className="text-sm font-mono font-extrabold text-text-tertiary bg-bg-alt px-3 py-2.5 rounded-full shrink-0 uppercase tracking-wider">
 {w.size}
 </span>
 )}
 </div>

 {/* WIDGET CLIENT PORTAL MARKUPS */}
 <div className="p-8 flex-1 text-text-secondary text-sm font-semibold leading-relaxed overflow-y-auto">
 {sfLoading ? (
 <div className="space-y-3 animate-pulse">
 <div className="h-4 bg-slate-200 rounded w-2/3" />
 <div className="h-3 bg-bg-alt rounded w-full" />
 <div className="h-3 bg-bg-alt rounded w-5/6" />
 </div>
 ) : !sfConnected ? (
 <div className="flex flex-col items-center justify-center h-full text-center py-4">
 <AlertCircle className="w-8 h-8 text-accent-light mb-2 animate-bounce animate-duration-1000" />
 <span className="text-base text-text-tertiary font-bold uppercase tracking-wider block">Connect Snowflake to View Data</span>
 </div>
 ) : (
 <>
 {/* PATIENT CORNER WIDGETS */}
 {w.id ==="upcoming_visits" && (
 <div className="space-y-4">
 <div className="p-3 bg-accent-light border border-teal-100 rounded-2xl flex items-center justify-between">
 <div>
 <h5 className="font-bold text-teal-800 text-sm">Active Treatment Session</h5>
 <p className="text-base text-text-tertiary mt-0.5">Nurse: Ankala Victoria (Verified Roster ID)</p>
 </div>
 <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-accent text-primary text-sm font-black uppercase rounded-full animate-pulse">
 <Clock className="w-3 h-3" />
 On-Visit
 </span>
 </div>
 <div className="space-y-2 text-base text-text-tertiary">
 <div className="flex justify-between"><span>Scheduled Shift:</span><span className="font-bold text-primary">09:00 AM - 01:00 PM</span></div>
 <div className="flex justify-between"><span>Location Match:</span><span className="font-bold text-primary">GPS Centered (100% Match)</span></div>
 <div className="flex justify-between"><span>Biometric Check-In:</span><span className="font-bold text-primary">Passed Selfie Liveness Verification</span></div>
 </div>
 </div>
 )}

 {w.id ==="medical_timeline" && (
 <div className="space-y-3 relative border-l border-slate-150 pl-4 py-2">
 <div className="relative">
 <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white" />
 <h5 className="font-bold text-sm text-primary">ICU Setup Complete</h5>
 <p className="text-base text-text-tertiary">Ankala Victoria Rani authorized ventilator parameters at home.</p>
 </div>
 <div className="relative pt-2">
 <span className="absolute -left-[21px] top-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
 <h5 className="font-bold text-sm text-text-tertiary">Physiotherapy Program Arranged</h5>
 <p className="text-base text-text-tertiary">Doctor-certified rehab guidelines loaded in Snowflake.</p>
 </div>
 </div>
 )}

 {w.id ==="current_care_plan" && (
 <div className="space-y-3">
 <div className="grid grid-cols-2 gap-6 text-center">
 <div className="p-2 bg-bg-alt rounded-xl">
 <span className="text-base text-text-tertiary block uppercase font-bold tracking-wider">Frequency</span>
 <span className="text-sm font-black text-primary block mt-1">3x Weekly</span>
 </div>
 <div className="p-2 bg-bg-alt rounded-xl">
 <span className="text-base text-text-tertiary block uppercase font-bold tracking-wider">Duration</span>
 <span className="text-sm font-black text-primary block mt-1">12-Hour Shifts</span>
 </div>
 </div>
 <p className="text-base text-text-tertiary">Clinical notes require logging blood pressure and core oxygen saturation thresholds every 4 hours.</p>
 </div>
 )}

 {w.id ==="health_summary" && (
 <div className="space-y-3">
 <div className="flex justify-between items-center pb-2 border-b border-border-light">
 <span className="font-bold">Patient Vital Metrics</span>
 <button 
 onClick={() => setVitals({ sys: 118, dia: 79, pulse: 74, temp: 98.4, spo2: 99 })}
 className="text-base text-accent font-bold hover:underline"
 >
 Refresh Logs
 </button>
 </div>
 <div className="grid grid-cols-3 gap-6 text-center text-base">
 <div className="p-2 bg-bg-alt rounded-xl border border-border-light">
 <span className="text-text-tertiary block font-bold">BP</span>
 <span className="font-extrabold text-primary block mt-1">{vitals.sys}/{vitals.dia}</span>
 </div>
 <div className="p-2 bg-bg-alt rounded-xl border border-border-light">
 <span className="text-text-tertiary block font-bold">SpO2</span>
 <span className="font-extrabold text-accent block mt-1">{vitals.spo2}%</span>
 </div>
 <div className="p-2 bg-bg-alt rounded-xl border border-border-light">
 <span className="text-text-tertiary block font-bold">Pulse</span>
 <span className="font-extrabold text-primary block mt-1">{vitals.pulse} bpm</span>
 </div>
 </div>
 </div>
 )}

 {w.id ==="recent_reports" && (
 <div className="space-y-3">
 <input
 type="file"
 ref={fileInputRef}
 onChange={(e) => {
 if (e.target.files && e.target.files.length > 0) {
 setUploadedReports(prev => [...prev, e.target.files![0].name]);
 }
 }}
 className="hidden"
 />
 <button
 onClick={() => fileInputRef.current?.click()}
 className="w-full py-2 bg-bg-alt hover:bg-bg-alt :bg-primary border border-dashed border-border rounded-xl text-center text-sm font-bold text-text-secondary cursor-pointer"
 >
 + Upload Vetted Lab report
 </button>
 <div className="space-y-1">
 <div className="flex items-center gap-1.5 text-base text-text-tertiary font-bold">
 <FileText className="w-3.5 h-3.5 text-accent" />
 <span>Doctor Prescription.pdf (Verified)</span>
 </div>
 {uploadedReports.map((rep, rIdx) => (
 <div key={rIdx} className="flex items-center gap-1.5 text-base text-text-tertiary font-bold">
 <FileText className="w-3.5 h-3.5 text-secondary" />
 <span className="truncate">{rep}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {w.id ==="invoices" && (
 <div className="space-y-3 text-base">
 <div className="flex justify-between items-center">
 <span className="text-text-tertiary font-bold">INV-48201-2026</span>
 <span className="px-3 py-2.5 bg-bg text-accent-light border border-amber-100 rounded font-bold uppercase text-sm">Unpaid</span>
 </div>
 <div className="flex justify-between font-bold text-primary">
 <span>Amount Due:</span>
 <span>INR 4,500</span>
 </div>
 <button
 onClick={() => handleShortcutClick("Pay Invoice")}
 className="w-full py-2 bg-primary hover:bg-accent :bg-accent text-white rounded-xl text-sm font-bold uppercase"
 >
 Secure Stripe Checkout
 </button>
 </div>
 )}

 {w.id ==="emergency_contacts" && (
 <div className="space-y-3">
 <button
 onClick={() => {
 setSaveSuccess("SOS TRIGGERED! Dispatched Clinical Coordinators.");
 setTimeout(() => setSaveSuccess(null), 3000);
 }}
 className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
 >
 <ShieldAlert className="w-4 h-4 animate-bounce" />
 Trigger SOS Alarm
 </button>
 <div className="space-y-1.5 text-base text-text-tertiary">
 <div className="flex justify-between font-bold"><span>Coordinating Desk:</span><span className="text-primary">911-SaaS-Response</span></div>
 <div className="flex justify-between font-bold"><span>Primary Contact:</span><span className="text-primary">Ankala Victoria (+91-9988)</span></div>
 </div>
 </div>
 )}


 {/* AGENCY WORKSPACE WIDGETS */}
 {w.id ==="revenue_performance" && (
 <div className="space-y-4">
 <div className="flex justify-between items-end">
 <div>
 <span className="text-base text-text-tertiary uppercase tracking-widest block font-extrabold">Total Settlement Ledger</span>
 <span className="text-2xl font-black text-primary block mt-1">INR 1,45,200</span>
 </div>
 <span className="inline-flex items-center gap-1 text-base text-accent font-extrabold bg-accent-light border border-emerald-100 px-3 py-2.5 rounded-full">
 <TrendingUp className="w-3.5 h-3.5" />
 +24.2%
 </span>
 </div>
 <div className="h-20 flex items-end gap-1 px-3 pt-2">
 {[40, 55, 30, 85, 60, 95, 75, 110].map((val, idx) => (
 <div 
 key={idx} 
 style={{ height:`${val}%`}} 
 className="flex-1 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t"
 title={`Revenue Point ${idx}`}
 />
 ))}
 </div>
 </div>
 )}

 {w.id ==="todays_bookings" && (
 <div className="space-y-3">
 <div className="p-2.5 bg-bg-alt rounded-2xl flex items-center justify-between border border-border-light">
 <div>
 <h6 className="font-bold text-primary text-sm">Patient: Victoria Rani</h6>
 <p className="text-base text-text-tertiary">Post-Op Wound Healing</p>
 </div>
 <span className="px-3.5 py-2.5 bg-bg text-secondary border border-indigo-150 rounded text-sm font-bold">Assigned</span>
 </div>
 <p className="text-base text-text-tertiary font-bold">2 active medical specialists on field roster.</p>
 </div>
 )}

 {w.id ==="staff_availability" && (
 <div className="space-y-3">
 <div className="flex justify-between text-base font-bold">
 <span>Active Nurses</span>
 <span className="text-accent">14 / 18 Available</span>
 </div>
 <div className="w-full bg-bg-alt h-2 rounded-full overflow-hidden">
 <div className="bg-accent h-full rounded-full" style={{ width:"77%" }} />
 </div>
 <div className="flex justify-between text-base font-bold">
 <span>Physiotherapists</span>
 <span className="text-secondary">8 / 10 Available</span>
 </div>
 <div className="w-full bg-bg-alt h-2 rounded-full overflow-hidden">
 <div className="bg-primary h-full rounded-full" style={{ width:"80%" }} />
 </div>
 </div>
 )}

 {w.id ==="pending_requests" && (
 <div className="space-y-3">
 <div className="p-3 bg-white border border-border rounded-2xl">
 <div className="flex justify-between items-start">
 <div>
 <h6 className="font-bold text-primary text-sm">New ICU Tracheostomy Setup</h6>
 <p className="text-base text-text-tertiary mt-0.5">Patient ID: p-40192</p>
 </div>
 <span className="text-base text-accent font-bold">INR 4,500</span>
 </div>
 <div className="flex gap-6 mt-3">
 <button 
 onClick={() => {
 setSaveSuccess("Care Request Confirmed and Sent to Dispatch!");
 setTimeout(() => setSaveSuccess(null), 3000);
 }}
 className="flex-1 py-2.5 bg-primary hover:bg-accent text-white rounded-lg text-base font-bold uppercase"
 >
 Accept
 </button>
 <button className="flex-1 py-2.5 border border-border hover:bg-bg-alt text-text-secondary rounded-lg text-base font-bold uppercase">
 Reject
 </button>
 </div>
 </div>
 </div>
 )}

 {w.id ==="mini_calendar" && (
 <div className="space-y-3">
 <div className="grid grid-cols-7 gap-1 text-center text-base font-extrabold text-text-tertiary">
 <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
 </div>
 <div className="grid grid-cols-7 gap-1 text-center text-sm">
 {Array.from({ length: 28 }).map((_, i) => (
 <div 
 key={i} 
 className={`p-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
 i === 12 
 ?"bg-accent text-primary font-black" 
 : i % 5 === 0 
 ?"bg-bg text-secondary" 
 :"hover:bg-bg-alt :bg-primary text-text-secondary"
 }`}
 >
 {i + 1}
 </div>
 ))}
 </div>
 </div>
 )}

 {w.id ==="verification_status" && (
 <div className="p-6 bg-accent-light border border-emerald-100 rounded-2xl space-y-2 text-center">
 <ShieldCheck className="w-10 h-10 text-accent mx-auto" />
 <h5 className="font-extrabold text-emerald-800 text-sm">Snowflake Compliance Verified</h5>
 <p className="text-base text-text-tertiary">All registered caregiver credentials, active licensing schemas, and state audits are logged securely.</p>
 </div>
 )}

 {w.id ==="performance_analytics" && (
 <div className="space-y-3 text-base text-text-tertiary font-bold">
 <div className="flex justify-between"><span>SLA Compliance index:</span><span className="text-primary">99.4% (Target: 98%)</span></div>
 <div className="flex justify-between"><span>Average Dispatch Response:</span><span className="text-primary">11.2 Mins (Optimal)</span></div>
 <div className="flex justify-between"><span>Customer Satisfaction Index:</span><span className="text-accent">4.92 / 5.0 (Excellent)</span></div>
 </div>
 )}

 {w.id ==="payments_ledger" && (
 <div className="space-y-2 text-base">
 <div className="flex justify-between"><span>Pending Payout Transfer:</span><span className="font-bold text-primary">INR 24,100</span></div>
 <div className="flex justify-between"><span>Next Scheduled Settlement:</span><span className="text-text-tertiary font-medium">15-Jul-2026</span></div>
 <div className="flex justify-between"><span>GST Ledger Deduction:</span><span className="font-mono text-text-tertiary">INR 405.00 (9%)</span></div>
 </div>
 )}


 {/* STAFF CORNER WIDGETS */}
 {w.id ==="todays_schedule" && (
 <div className="space-y-3">
 <div className="p-3 bg-bg-alt rounded-2xl border border-slate-150 space-y-2">
 <div className="flex justify-between">
 <span className="font-bold text-primary">09:00 AM - 01:00 PM</span>
 <span className="text-accent font-bold text-base uppercase">Active Visit</span>
 </div>
 <h6 className="text-sm font-black">Patient: Victoria Rani</h6>
 <p className="text-base text-text-tertiary">Specialized Ventilator Tracheostomy Nursing Setup</p>
 </div>
 </div>
 )}

 {w.id ==="assigned_patients" && (
 <div className="space-y-2 text-base">
 <div className="p-2 bg-white border border-border-light rounded-xl">
 <h6 className="font-bold">Ankala Victoria Rani</h6>
 <p className="text-base text-text-tertiary mt-0.5">Allergies: Penicillin, Core Blood: AB+</p>
 </div>
 </div>
 )}

 {w.id ==="visit_timeline" && (
 <div className="space-y-2 text-base">
 <div className="flex items-center gap-6"><CheckCircle className="w-3.5 h-3.5 text-accent" /><span>Biometric Check-In Complete (09:04 AM)</span></div>
 <div className="flex items-center gap-6"><CheckSquare className="w-3.5 h-3.5 text-secondary" /><span>Logged Patient Blood Pressure (10:15 AM)</span></div>
 <div className="flex items-center gap-6 text-text-tertiary"><Clock className="w-3.5 h-3.5" /><span>Pending Check-Out Submission</span></div>
 </div>
 )}

 {w.id ==="navigation_map" && (
 <div className="space-y-2 text-base text-text-tertiary">
 <div className="h-20 bg-bg-alt rounded-2xl flex items-center justify-center font-mono text-sm text-text-tertiary">
 [SIMULATED LOCATION PATHWAY]
 </div>
 <div className="flex justify-between font-bold pt-1">
 <span>Distance to Patient:</span>
 <span className="text-primary">1.4 km (4 mins away)</span>
 </div>
 </div>
 )}

 {w.id ==="check_in_selfie" && (
 <div className="space-y-3 text-center">
 <div className="w-12 h-12 bg-bg-alt rounded-full flex items-center justify-center mx-auto text-accent border border-border">
 <Smartphone className="w-6 h-6" />
 </div>
 <h5 className="font-bold text-primary text-sm">Selfie verification Active</h5>
 <span className="inline-flex px-3 py-2.5 bg-accent-light text-accent border border-emerald-100 rounded text-sm font-bold">100% Liveness Match</span>
 </div>
 )}

 {w.id ==="pending_tasks" && (
 <div className="space-y-2 text-base">
 <label className="flex items-center gap-6 cursor-pointer font-bold"><input type="checkbox" defaultChecked className="rounded text-accent" /> <span>Measure BP every 2 hours</span></label>
 <label className="flex items-center gap-6 cursor-pointer font-bold"><input type="checkbox" defaultChecked className="rounded text-accent" /> <span>Inject Post-Op Pain Reliever</span></label>
 <label className="flex items-center gap-6 cursor-pointer font-bold"><input type="checkbox" className="rounded text-accent" /> <span>Reposition Patient (Prevent Sores)</span></label>
 </div>
 )}

 {w.id ==="attendance_logs" && (
 <div className="space-y-1.5 text-base">
 <div className="flex justify-between"><span>Shift hours Logged:</span><span className="font-bold text-primary">38.5 Hours</span></div>
 <div className="flex justify-between"><span>Approved Payroll:</span><span className="text-accent font-bold">INR 14,800</span></div>
 </div>
 )}

 {w.id ==="performance_ratings" && (
 <div className="text-center space-y-1 py-2">
 <div className="flex justify-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><Star className="w-4 h-4 text-amber-400 fill-amber-400" /></div>
 <h5 className="font-bold text-primary text-sm mt-2">5.0 / 5.0 (48 Patient Reviews)</h5>
 <p className="text-base text-text-tertiary font-medium">100% clean safety audit index.</p>
 </div>
 )}

 {w.id ==="announcements" && (
 <div className="p-3 bg-bg border border-amber-100 rounded-2xl text-amber-800 space-y-1 text-base font-bold">
 <span className="uppercase text-sm block text-accent-light">Urgent Policy</span>
 <p>All tracheostomy caregivers must verify double suction parameters inside the Snowflake active checklist.</p>
 </div>
 )}


 {/* ADMIN CORNER WIDGETS */}
 {w.id ==="platform_revenue" && (
 <div className="space-y-3">
 <span className="text-2xl font-black text-primary block">INR 84,10,200</span>
 <div className="flex justify-between text-base text-text-tertiary font-bold">
 <span>Platform SaaS Commission:</span>
 <span className="text-primary">INR 10,09,224 (12% take rate)</span>
 </div>
 </div>
 )}

 {w.id ==="global_bookings" && (
 <div className="space-y-3 text-base text-text-tertiary font-bold">
 <div className="flex justify-between"><span>Global System Bookings:</span><span className="text-primary">1,482 Active</span></div>
 <div className="flex justify-between"><span>Completed in last 24h:</span><span className="text-primary">304 Shifts</span></div>
 <div className="flex justify-between"><span>Cancellation Frequency:</span><span className="text-accent">0.4% (Industry Low)</span></div>
 </div>
 )}

 {w.id ==="active_agencies" && (
 <div className="space-y-3">
 <div className="flex justify-between text-base font-bold">
 <span>Hyderabad</span><span className="text-primary">14 Approved</span>
 </div>
 <div className="flex justify-between text-base font-bold">
 <span>Bengaluru</span><span className="text-primary">22 Approved</span>
 </div>
 </div>
 )}

 {w.id ==="system_directory" && (
 <div className="space-y-2 text-base text-text-tertiary font-bold">
 <div className="flex justify-between"><span>Registered Patients:</span><span className="text-primary">18,204</span></div>
 <div className="flex justify-between"><span>Vetted field Caregivers:</span><span className="text-primary">4,801</span></div>
 </div>
 )}

 {w.id ==="verification_queue" && (
 <div className="space-y-3">
 <div className="p-3 bg-white border border-border rounded-2xl flex items-center justify-between">
 <div>
 <h6 className="font-bold text-sm text-primary">CareFirst HomeCare LTD</h6>
 <p className="text-base text-text-tertiary">File: licensing_audit_cert.pdf</p>
 </div>
 <button 
 onClick={() => {
 setSaveSuccess("Agency compliance credentials APPROVED.");
 setTimeout(() => setSaveSuccess(null), 3000);
 }}
 className="px-3 py-2 bg-primary hover:bg-accent text-white rounded-lg text-base font-bold uppercase"
 >
 Approve
 </button>
 </div>
 </div>
 )}

 {w.id ==="saas_subscriptions" && (
 <div className="space-y-2 text-base">
 <div className="flex justify-between font-bold"><span>Enterprise Tier:</span><span className="text-accent">32 Agencies</span></div>
 <div className="flex justify-between font-bold"><span>Pro Tier:</span><span className="text-primary">14 Agencies</span></div>
 </div>
 )}

 {w.id ==="support_tickets" && (
 <div className="space-y-2 text-base">
 <div className="flex justify-between p-2 bg-rose-50 rounded-xl border border-rose-100 text-rose-800 font-bold">
 <span>Critical GPS Desync</span>
 <span>Ticket #492</span>
 </div>
 </div>
 )}

 {w.id ==="immutable_audit" && (
 <div className="space-y-2 font-mono text-sm text-text-tertiary leading-relaxed bg-primary p-3 rounded-2xl border border-border-light">
 <div>[2026-07-12 23:00] TRACE: Snowflake connection live.</div>
 <div>[2026-07-12 23:01] SECURE: Vitals signed on booking #bk-201.</div>
 </div>
 )}

 {w.id ==="system_health" && (
 <div className="space-y-3 text-base text-text-tertiary font-bold">
 <div className="flex justify-between"><span>Snowflake Stream Latency:</span><span className="text-accent">12 ms</span></div>
 <div className="flex justify-between"><span>Cloudflare Cache Rate:</span><span className="text-primary">99.2%</span></div>
 <div className="flex justify-between"><span>Database Status:</span><span className="text-accent">Normal</span></div>
 </div>
 )}

 {w.id ==="growth_analytics" && (
 <div className="space-y-3 text-base">
 <div className="flex justify-between"><span>Month-on-Month Growth:</span><span className="text-accent font-bold">+18.5%</span></div>
 <div className="w-full bg-bg-alt h-2 rounded-full overflow-hidden">
 <div className="bg-accent h-full rounded-full" style={{ width:"65%" }} />
 </div>
 </div>
 )}


 {/* REUSABLE SYSTEM-WIDE WIDGETS */}
 {w.id ==="recent_activity" && (
 <div className="space-y-3">
 <div className="flex gap-6.5 items-start text-base">
 <Clock className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
 <div>
 <p className="font-bold text-primary">ICU Care shift check-in registered</p>
 <span className="text-sm text-text-tertiary">Victoria Rani, 12 mins ago</span>
 </div>
 </div>
 <div className="flex gap-6.5 items-start text-base">
 <DollarSign className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
 <div>
 <p className="font-bold text-primary">Invoice INV-48201 generated</p>
 <span className="text-sm text-text-tertiary">Stripe financial ledgers, 1 hour ago</span>
 </div>
 </div>
 </div>
 )}

 {w.id ==="quick_actions" && (
 <div className="space-y-2">
 {["Patient","Family Member"].includes(userRole) && (
 <>
 <button onClick={() => handleShortcutClick("Book Service")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">🗓 Book Care Treatment</button>
 <button onClick={() => handleShortcutClick("Find Agency")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">🔍 Locate Vetted Agencies</button>
 </>
 )}
 {["Home Healthcare Agency","Agency Admin","Agency Owner"].includes(userRole) && (
 <>
 <button onClick={() => handleShortcutClick("New Booking")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">📝 Create New Schedule</button>
 <button onClick={() => handleShortcutClick("Assign Staff")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">🧑‍⚕️ Assign On-Duty Caregiver</button>
 </>
 )}
 {["Nurse","Caregiver","Physiotherapist","Doctor"].includes(userRole) && (
 <>
 <button onClick={() => handleShortcutClick("Start Visit")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">🚀 Start Scheduled Shift</button>
 <button onClick={() => handleShortcutClick("Check-In")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">🤳 Log Selfie & GPS Check</button>
 </>
 )}
 {userRole ==="Platform Admin" && (
 <>
 <button onClick={() => handleShortcutClick("Approve Agency")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">✅ Approve Agency License</button>
 <button onClick={() => handleShortcutClick("Verify Staff")} className="w-full text-left py-2 px-3 bg-bg-alt hover:bg-bg-alt :bg-primary rounded-xl text-sm font-bold transition-all block">🩺 Verify Specialist Credentials</button>
 </>
 )}
 </div>
 )}

 {w.id ==="favorite_reports" && (
 <div className="space-y-3">
 {/* Search Reports */}
 <div className="relative">
 <Search className="absolute left-2.5 top-2 w-3 h-3 text-text-tertiary" />
 <input
 type="text"
 value={reportSearch}
 onChange={(e) => setReportSearch(e.target.value)}
 placeholder="Search analytical reports..."
 className="w-full pl-7 pr-2 py-2.5 text-base bg-bg-alt border border-border rounded-lg focus:outline-none"
 />
 </div>
 {/* Favorite Reports Lists */}
 <div className="space-y-1">
 {getAllReportsOptions()
 .filter(r => reportSearch ? r.toLowerCase().includes(reportSearch.toLowerCase()) : true)
 .map(rep => {
 const isFav = favReports.includes(rep);
 return (
 <div key={rep} className="flex items-center justify-between gap-6 p-1 hover:bg-bg-alt :bg-slate-855 rounded-lg text-base font-bold">
 <span className="truncate">{rep}</span>
 <button
 onClick={() => handleToggleFavReport(rep)}
 className="text-text-tertiary hover:text-amber-400 transition-colors"
 >
 <Star className={`w-3.5 h-3.5 ${isFav ?"text-amber-400 fill-amber-400" :""}`} />
 </button>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </>
 )}
 </div>
 </motion.div>
 </div>
 );
 })}
 </div>

 </div>
 );
}
