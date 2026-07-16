import { DashboardConfiguration } from "@/types/dashboard";
import { House, Compass, CalendarDays, FileText, Bell, User, Settings, HelpCircle, LogOut } from "lucide-react";

export const patientDashboardConfig: DashboardConfiguration = {
  role: "Patient",
  title: "Patient Portal",
  defaultRoute: "/patient/dashboard",
  navigation: [
    { id: "dashboard", label: "Dashboard", href: "/patient/dashboard", icon: House },
    { id: "explore", label: "Explore Care", href: "/patient/explore", icon: Compass },
    { id: "bookings", label: "My Bookings", href: "/patient/bookings", icon: CalendarDays },
    { id: "records", label: "Medical Records", href: "/patient/medical-records", icon: FileText },
    { id: "notifications", label: "Notifications", href: "/patient/dashboard?view=notifications", icon: Bell },
  ],
};
