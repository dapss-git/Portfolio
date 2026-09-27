"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SunIcon, MoonIcon, PaletteIcon, CheckIcon } from "./Icons";

export type ThemeMode = "light" | "dark" | "cyber" | "custom";

interface ThemeContextType {
  theme: ThemeMode;
  customColor: string;
  setTheme: (mode: ThemeMode) => void;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  customColor: "#FFE600",
  setTheme: () => {},
  setCustomColor: () => {},
});

export const PRESET_COLORS = [
  { name: "Kuning Neo", hex: "#FFE600" },
  { name: "Cyan Cyber", hex: "#00F0FF" },
  { name: "Pink Punk", hex: "#FF5C8D" },
  { name: "Hijau Neon", hex: "#22C55E" },
  { name: "Ungu Retro", hex: "#A855F7" },
  { name: "Orange Pop", hex: "#FB923C" },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [customColor, setCustomColorState] = useState<string>("#FFE600");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("daps_portfolio_theme") as ThemeMode | null;
      const savedColor = localStorage.getItem("daps_portfolio_custom_color");

      if (savedTheme && ["light", "dark", "cyber", "custom"].includes(savedTheme)) {
        setThemeState(savedTheme);
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setThemeState("dark");
      }

      if (savedColor) {
        setCustomColorState(savedColor);
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.setProperty("--custom-accent", customColor);
      localStorage.setItem("daps_portfolio_theme", theme);
      localStorage.setItem("daps_portfolio_custom_color", customColor);
    } catch {}
  }, [theme, customColor, mounted]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const setCustomColor = (color: string) => {
    setCustomColorState(color);
    setThemeState("custom");
  };

  return (
    <ThemeContext.Provider value={{ theme, customColor, setTheme, setCustomColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// ─── Theme Switcher Component ─────────────────────────────────────────────────
export function ThemeSwitcher() {
  const { theme, customColor, setTheme, setCustomColor } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black font-mono text-xs font-bold shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        title="Ganti Tema"
      >
        {theme === "light" && <SunIcon className="w-3.5 h-3.5 text-[#eab308]" />}
        {theme === "dark" && <MoonIcon className="w-3.5 h-3.5 text-[#6366f1]" />}
        {theme === "cyber" && <span className="w-3.5 h-3.5 rounded-full bg-[#FFE600] border border-black inline-block" />}
        {theme === "custom" && <PaletteIcon className="w-3.5 h-3.5 text-[#ec4899]" />}
        <span className="capitalize hidden sm:inline">{theme}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border-3 border-black bg-white p-3 shadow-[5px_5px_0px_#000] z-50 animate-fade-up text-black font-mono">
            <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2 border-b-2 border-black pb-1.5 flex items-center justify-between">
              <span>Pilih Tema</span>
              <span className="text-[10px] text-gray-500 font-normal">Neobrutal</span>
            </p>

            {/* Presets */}
            <div className="flex flex-col gap-1.5 mb-3">
              <button
                onClick={() => {
                  setTheme("light");
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 border-black text-xs font-bold transition-all ${
                  theme === "light"
                    ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-[#f4f4f5] text-black hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <SunIcon className="w-4 h-4 text-black" />
                  <span>Terang (Putih & Hitam)</span>
                </div>
                {theme === "light" && <CheckIcon className="w-3.5 h-3.5 text-black" />}
              </button>

              <button
                onClick={() => {
                  setTheme("dark");
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 border-black text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "bg-black text-white shadow-[2px_2px_0px_#000]"
                    : "bg-[#27272a] text-white hover:bg-[#3f3f46]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MoonIcon className="w-4 h-4 text-white" />
                  <span>Gelap (Hitam & Abu)</span>
                </div>
                {theme === "dark" && <CheckIcon className="w-3.5 h-3.5 text-white" />}
              </button>

              <button
                onClick={() => {
                  setTheme("cyber");
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 border-black text-xs font-bold transition-all ${
                  theme === "cyber"
                    ? "bg-[#00F0FF] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-[#fff176] text-black hover:bg-[#ffe082]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE600] border-2 border-black" />
                  <span>Cyber (Kuning & Cyan)</span>
                </div>
                {theme === "cyber" && <CheckIcon className="w-3.5 h-3.5 text-black" />}
              </button>
            </div>

            {/* Custom Palette */}
            <div className="border-t-2 border-black pt-2">
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <PaletteIcon className="w-3 h-3 text-black" />
                <span>Custom Warna Aksen</span>
              </p>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setCustomColor(c.hex);
                      setOpen(false);
                    }}
                    title={c.name}
                    className={`w-7 h-7 rounded-lg border-2 border-black transition-all ${
                      theme === "custom" && customColor === c.hex
                        ? "scale-110 shadow-[2px_2px_0px_#000]"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
