import { DashboardConfiguration } from "@/types/dashboard";
import { House, Calendar, CalendarDays, Activity, Users, User, FileText, Settings, LogOut } from "lucide-react";

export const professionalDashboardConfig: DashboardConfiguration = {
  role: "Professional",
  title: "Professional Portal",
  defaultRoute: "/professional/dashboard",
  navigation: [
    { id: "dashboard",   label: "Dashboard",    href: "/professional/dashboard",   icon: House },
    { id: "schedule",    label: "My Schedule",  href: "/professional/schedule",    icon: Calendar },
    { id: "bookings",    label: "My Bookings",  href: "/professional/bookings",    icon: CalendarDays },
    { id: "availability",label: "Availability", href: "/professional/availability", icon: Activity },
    { id: "patients",    label: "Patients",     href: "/professional/patients",    icon: Users },
    { id: "profile",     label: "Profile",      href: "/professional/profile",     icon: User },
    { id: "documents",   label: "Documents",    href: "/professional/documents",   icon: FileText },
    { id: "settings",    label: "Settings",     href: "/professional/settings",    icon: Settings },
    { id: "logout",      label: "Logout",       href: "/logout",                   icon: LogOut },
  ],
};
