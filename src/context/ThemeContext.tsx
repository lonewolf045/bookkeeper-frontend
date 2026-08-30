"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = [
  // Dark
  { id: "midnight", label: "Midnight", color: "#6366f1", dark: true  },
  { id: "nord",     label: "Nord",     color: "#5e81ac", dark: true  },
  { id: "forest",   label: "Forest",   color: "#16a34a", dark: true  },
  { id: "rose",     label: "Rose",     color: "#e11d48", dark: true  },
  { id: "amber",    label: "Amber",    color: "#d97706", dark: true  },
  // Light
  { id: "paper",    label: "Paper",    color: "#7c3aed", dark: false },
  { id: "sky",      label: "Sky",      color: "#0284c7", dark: false },
  { id: "mint",     label: "Mint",     color: "#16a34a", dark: false },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "bk-theme";

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "midnight",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("midnight");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const valid = THEMES.some(t => t.id === stored);
    const initial = valid ? (stored as ThemeId) : "midnight";
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.setAttribute("data-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
