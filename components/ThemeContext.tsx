"use client";

import React, { createContext, useContext, useState, useEffect } from"react";

type Theme ="light" |"dark" |"system";

interface ThemeContextType {
 theme: Theme;
 setTheme: (theme: Theme) => void;
 resolvedTheme:"light" |"dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
 const [theme, setThemeState] = useState<Theme>("light");
 const [resolvedTheme, setResolvedTheme] = useState<"light" |"dark">("light");

 useEffect(() => {
 const savedTheme = localStorage.getItem("homecare-theme") as Theme | null;
 if (savedTheme) {
 setThemeState(savedTheme);
 } else {
 setThemeState("system");
 }
 }, []);

 useEffect(() => {
 const root = window.document.documentElement;
 let activeTheme:"light" |"dark" ="light";

 if (theme ==="system") {
 const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
 activeTheme = systemPrefersDark ?"dark" :"light";
 } else {
 activeTheme = theme;
 }

 setResolvedTheme(activeTheme);

 if (activeTheme ==="dark") {
 root.classList.add("dark");
 } else {
 root.classList.remove("dark");
 }

 localStorage.setItem("homecare-theme", theme);
 }, [theme]);

 const setTheme = (newTheme: Theme) => {
 setThemeState(newTheme);
 };

 return (
 <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
 {children}
 </ThemeContext.Provider>
 );
}

export function useTheme() {
 const context = useContext(ThemeContext);
 if (context === undefined) {
 throw new Error("useTheme must be used within a ThemeProvider");
 }
 return context;
}
