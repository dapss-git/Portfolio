"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  thumbnail?: string;
}

export interface SiteConfig {
  // Audio Player & Playlist
  musicEnabled: boolean;
  cdCustomThumbnail: string;
  playlist: Song[];
  activeSongIndex: number;

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
  cdCustomThumbnail: "/hero-banner.jpg",
  playlist: [
    {
      id: "1",
      title: "audio2",
      artist: "Muhammad Dafa Pratama",
      url: "https://raw.githubusercontent.com/dapss-git/uploader/main/upload/audio/audio2.mp3",
      thumbnail: "/hero-banner.jpg",
    },
  ],
  activeSongIndex: 0,

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
        // Migration support if older config had single musicUrl
        if (!parsed.playlist && parsed.musicUrl) {
          parsed.playlist = [
            {
              id: "1",
              title: parsed.musicTitle || "audio2",
              artist: parsed.musicArtist || "Muhammad Dafa Pratama",
              url: parsed.musicUrl,
              thumbnail: "/hero-banner.jpg",
            },
          ];
          parsed.activeSongIndex = 0;
        }
        if (!parsed.cdCustomThumbnail) {
          parsed.cdCustomThumbnail = "/hero-banner.jpg";
        }
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
