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
  { name: "Pink Pop", hex: "#FF5C8D" },
  { name: "Hijau Neon", hex: "#22C55E" },
  { name: "Ungu Retro", hex: "#A855F7" },
  { name: "Oranye Bold", hex: "#FF7A00" },
  { name: "Merah Crimson", hex: "#EF4444" },
  { name: "Biru Royal", hex: "#3B82F6" },
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
      if (theme === "custom") {
        document.documentElement.style.setProperty("--accent-primary", customColor);
        document.documentElement.style.setProperty("--custom-accent", customColor);
      } else {
        document.documentElement.style.removeProperty("--accent-primary");
      }
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
        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white text-black font-mono text-xs font-bold shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        title="Ganti Tema & Warna"
      >
        {theme === "light" && <SunIcon className="w-3.5 h-3.5 text-[#eab308]" />}
        {theme === "dark" && <MoonIcon className="w-3.5 h-3.5 text-[#6366f1]" />}
        {theme === "cyber" && <span className="w-3.5 h-3.5 rounded-full bg-[#FFE600] border border-black inline-block" />}
        {theme === "custom" && (
          <span
            className="w-3.5 h-3.5 rounded-full border border-black inline-block"
            style={{ backgroundColor: customColor }}
          />
        )}
        <span className="capitalize hidden sm:inline">{theme}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 border-3 border-black bg-white p-3.5 shadow-[5px_5px_0px_#000] z-50 animate-fade-up text-black font-mono">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b-2 border-black">
              <span className="text-xs font-black uppercase tracking-wider">Pilih Tema</span>
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold">Neobrutal</span>
            </div>

            {/* Presets */}
            <div className="flex flex-col gap-1.5 mb-3">
              <button
                onClick={() => {
                  setTheme("light");
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-2 border-2 border-black text-xs font-bold transition-all ${
                  theme === "light"
                    ? "bg-[#FFE600] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-[#f4f4f5] text-black hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <SunIcon className="w-4 h-4 text-black" />
                  <span>Terang (Putih & Hitam)</span>
                </div>
                {theme === "light" && <CheckIcon className="w-3.5 h-3.5 text-black stroke-[3]" />}
              </button>

              <button
                onClick={() => {
                  setTheme("dark");
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-2 border-2 border-black text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "bg-black text-white shadow-[2px_2px_0px_#000]"
                    : "bg-[#27272a] text-white hover:bg-[#3f3f46]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MoonIcon className="w-4 h-4 text-white" />
                  <span>Gelap (Hitam & Abu)</span>
                </div>
                {theme === "dark" && <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>

              <button
                onClick={() => {
                  setTheme("cyber");
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-2.5 py-2 border-2 border-black text-xs font-bold transition-all ${
                  theme === "cyber"
                    ? "bg-[#00F0FF] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-[#fff176] text-black hover:bg-[#ffe082]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FFE600] border-2 border-black" />
                  <span>Cyber (Kuning & Cyan)</span>
                </div>
                {theme === "cyber" && <CheckIcon className="w-3.5 h-3.5 text-black stroke-[3]" />}
              </button>
            </div>

            {/* Custom Palette */}
            <div className="border-t-2 border-black pt-2.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                  <PaletteIcon className="w-3 h-3 text-black" />
                  <span>Warna Aksen (Tombol & Judul)</span>
                </p>
              </div>

              {/* Color Swatches Grid */}
              <div className="grid grid-cols-4 gap-2 mb-2.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => {
                      setCustomColor(c.hex);
                    }}
                    title={c.name}
                    className={`h-7 border-2 border-black transition-all flex items-center justify-center ${
                      theme === "custom" && customColor.toLowerCase() === c.hex.toLowerCase()
                        ? "shadow-[2px_2px_0px_#000] scale-105"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {theme === "custom" && customColor.toLowerCase() === c.hex.toLowerCase() && (
                      <CheckIcon className="w-3.5 h-3.5 text-black stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Free Color Picker */}
              <div className="flex items-center gap-2 p-1.5 bg-[#f4f4f5] border-2 border-black">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-7 h-7 border-2 border-black cursor-pointer bg-transparent"
                  title="Pilih warna bebas"
                />
                <span className="text-[11px] font-mono font-bold uppercase text-black flex-1">
                  Pilih Bebas: {customColor}
                </span>
              </div>

              {/* Realtime Live Preview badge */}
              <div className="mt-2.5 pt-2 border-t border-dashed border-gray-400 flex items-center justify-between text-[10px]">
                <span className="text-gray-600 font-bold">Contoh Warna:</span>
                <span
                  className="px-2.5 py-0.5 border border-black text-black font-black uppercase shadow-[1px_1px_0px_#000]"
                  style={{
                    backgroundColor:
                      theme === "custom"
                        ? customColor
                        : theme === "dark"
                        ? "#00F0FF"
                        : "#FFE600",
                  }}
                >
                  AKSEN AKTIF
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
