import { DashboardConfiguration } from "@/types/dashboard";
import { House, Users, Building2, UserSquare2, CalendarDays, BarChart3, Settings, LogOut } from "lucide-react";

export const adminDashboardConfig: DashboardConfiguration = {
  role: "Admin",
  title: "Admin Portal",
  defaultRoute: "/admin/dashboard",
  navigation: [
    { id: "dashboard",     label: "Dashboard",     href: "/admin/dashboard",     icon: House },
    { id: "users",         label: "Users",         href: "/admin/users",         icon: Users },
    { id: "agencies",      label: "Agencies",      href: "/admin/agencies",      icon: Building2 },
    { id: "professionals", label: "Professionals", href: "/admin/professionals", icon: UserSquare2 },
    { id: "bookings",      label: "Bookings",      href: "/admin/bookings",      icon: CalendarDays },
    { id: "reports",       label: "Reports",       href: "/admin/reports",       icon: BarChart3 },
    { id: "settings",      label: "Settings",      href: "/admin/settings",      icon: Settings },
    { id: "logout",        label: "Logout",        href: "/logout",              icon: LogOut },
  ],
};
