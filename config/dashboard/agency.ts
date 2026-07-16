import { DashboardConfiguration } from "@/types/dashboard";
import { House, CalendarDays, Users, Calendar, Building2, BarChart2, Settings, HelpCircle, LogOut } from "lucide-react";

export const agencyDashboardConfig: DashboardConfiguration = {
  role: "Agency",
  title: "Agency Portal",
  defaultRoute: "/agency/dashboard",
  navigation: [
    { id: "dashboard",     label: "Dashboard",            href: "/agency/dashboard",        icon: House },
    { id: "bookings",      label: "Booking Requests",     href: "/agency/booking-requests", icon: CalendarDays },
    { id: "professionals", label: "Manage Professionals", href: "/agency/professionals",     icon: Users },
    { id: "calendar",      label: "Calendar",             href: "/agency/calendar",          icon: Calendar },
    { id: "profile",       label: "Organization Profile", href: "/agency/profile",           icon: Building2 },
    { id: "reports",       label: "Reports",              href: "/agency/reports",           icon: BarChart2 },
    { id: "settings",      label: "Settings",             href: "/agency/settings",          icon: Settings },
    { id: "support",       label: "Support",              href: "/agency/dashboard?view=support", icon: HelpCircle },
    { id: "logout",        label: "Logout",               href: "/logout",                   icon: LogOut },
  ],
};
