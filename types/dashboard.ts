"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { HTMLMotionProps } from "framer-motion";

export interface DashboardNavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardConfiguration {
  role: string;
  title: string;
  defaultRoute: string;
  navigation: DashboardNavigationItem[];
}

export interface DashboardHeaderProps {
  pageTitle: string;
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export interface DashboardSidebarProps {
  navigation: DashboardNavigationItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onItemClick: (item: DashboardNavigationItem) => void;
}

export interface DashboardCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel?: string;
  buttonLink?: string;
}

export interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
}

export interface NotificationMenuProps {
  // Notification menu props placeholder
}

export interface UserMenuProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export interface DashboardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
