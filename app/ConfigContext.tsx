"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface SiteConfig {
  // Audio Player
  musicEnabled: boolean;
  musicUrl: string;
  musicTitle: string;
  musicArtist: string;

  // Background & Display
  bgEffectEnabled: boolean;

  // QRIS & Payment
  qrisImageUrl: string;
  danaNumber: string;
  gopayNumber: string;
  saweriaUrl: string;

  // Social & Contacts
  telegramUsername: string;
  whatsappNumber: string;
  instagramUsername: string;
  tiktokUsername: string;
  facebookUsername: string;
  waGroupUrl: string;
  waChannelUrl: string;

  // Admin Security
  adminPin: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  musicEnabled: true,
  musicUrl: "https://raw.githubusercontent.com/dapss-git/uploader/main/upload/audio/audio2.mp3",
  musicTitle: "audio2",
  musicArtist: "Muhammad Dafa Pratama",

  bgEffectEnabled: true,

  qrisImageUrl: "/qris.jpeg",
  danaNumber: "085120170735",
  gopayNumber: "0895393325895",
  saweriaUrl: "https://saweria.co/dafaaaaa1111",

  telegramUsername: "dafaaaaa11111",
  whatsappNumber: "0895393325895",
  instagramUsername: "dafaaaaa11111",
  tiktokUsername: "dafaaaaa11111",
  facebookUsername: "dafaaaaa11111",
  waGroupUrl: "https://chat.whatsapp.com/BA2BZeMGysXGOJI0JxF8Yb",
  waChannelUrl: "https://whatsapp.com/channel/0029Vb89x3U5fM5VSAMCHQ16",

  adminPin: "2808",
};

interface ConfigContextType {
  config: SiteConfig;
  updateConfig: (patch: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  isLoaded: boolean;
}

const ConfigContext = createContext<ConfigContextType>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  resetConfig: () => {},
  isLoaded: false,
});

const STORAGE_KEY = "daps_admin_config";

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Failed to load site config:", e);
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = (patch: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save site config:", e);
      }
      return updated;
    });
  };

  const resetConfig = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig, isLoaded }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(ConfigContext);
}
