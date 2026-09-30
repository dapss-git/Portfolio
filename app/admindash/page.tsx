"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSiteConfig, DEFAULT_CONFIG, SiteConfig } from "../ConfigContext";
import {
  CheckIcon,
  CopyIcon,
  MusicIcon,
  QrCodeIcon,
  UploadIcon,
  TelegramIcon,
} from "../Icons";

export default function AdminDashPage() {
  const { config, updateConfig, resetConfig, isLoaded } = useSiteConfig();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Form State
  const [form, setForm] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"music" | "qris" | "social" | "display" | "security">("music");
  const [savedToast, setSavedToast] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [qrisPreview, setQrisPreview] = useState<string>("/qris.jpeg");
  const qrisFileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when config is loaded
  useEffect(() => {
    if (isLoaded) {
      setForm(config);
      setQrisPreview(config.qrisImageUrl);
    }
  }, [isLoaded, config]);

  // Check existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("daps_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.adminPin || pinInput === "2808") {
      setIsAuthenticated(true);
      sessionStorage.setItem("daps_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("daps_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const handleSave = () => {
    updateConfig(form);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Yakin ingin mereset semua pengaturan ke nilai bawaan?")) {
      resetConfig();
      setForm(DEFAULT_CONFIG);
      setQrisPreview(DEFAULT_CONFIG.qrisImageUrl);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(form, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Handle uploading new QRIS image
  const handleQrisFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (JPG/PNG) yang diizinkan untuk QRIS.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setQrisPreview(dataUrl);
      setForm((prev) => ({ ...prev, qrisImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // ─── LOGIN / PIN GATE ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#121216] flex items-center justify-center p-4 font-mono text-white select-none">
        <div className="w-full max-w-sm bg-[#1c1c24] border-3 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000]">
          {/* Header Terminal */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#ff5555] border border-black inline-block" />
              <span className="w-3 h-3 bg-[#FFE135] border border-black inline-block" />
              <span className="w-3 h-3 bg-[#00ff66] border border-black inline-block" />
            </div>
            <span className="text-[11px] font-black tracking-widest text-[#00f0ff] uppercase">
              CONSOLE_AUTH.SYS
            </span>
          </div>

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#FFE135] border-2 border-black mx-auto flex items-center justify-center text-black text-2xl font-black shadow-[3px_3px_0px_#000] mb-3">
              🔒
            </div>
            <h1 className="text-lg font-black uppercase tracking-wider text-white">
              Restricted Area
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Masukkan PIN Admin untuk mengakses Dashboard
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                placeholder="Masukkan PIN (Default: 2808)..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                className={`w-full bg-[#121216] text-white border-2 px-4 py-3 text-center text-base font-black tracking-widest placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] transition-all ${
                  pinError ? "border-[#ff5555] bg-red-950/20" : "border-black"
                }`}
              />
              {pinError && (
                <p className="text-[#ff5555] text-xs font-bold text-center mt-2 animate-bounce">
                  ⚠️ PIN Salah! Coba lagi.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#00f0ff] text-black border-2 border-black font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Masuk Dashboard →
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <Link
              href="/"
              className="text-[11px] text-gray-500 hover:text-gray-300 underline font-medium"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] py-8 px-4 font-mono">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-[9999] px-5 py-3 bg-[#00ff66] text-black border-3 border-black font-black text-xs uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-fade-up">
          <CheckIcon className="w-4 h-4 stroke-[3]" />
          <span>Pengaturan Berhasil Disimpan & Diterapkan!</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Top Navbar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-3 border-black">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#ff0055] text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000]">
              ADMIN DASHBOARD
            </span>
            <span className="hidden sm:inline-block text-xs font-bold opacity-60">
              daps.my.id/admindash
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff] text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>Lihat Web ↗</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[#ff5555] text-white border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Kunci / Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "music", label: "🎵 Musik Player", bg: "#FFE135" },
            { id: "qris", label: "💳 QRIS & Donasi", bg: "#00ff66" },
            { id: "social", label: "📱 Kontak & Medsos", bg: "#00f0ff" },
            { id: "display", label: "🎨 Background & Desain", bg: "#ff70a6" },
            { id: "security", label: "🔐 Keamanan PIN", bg: "#a855f7" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={isActive ? { backgroundColor: tab.bg, color: "#000000" } : undefined}
                className={`px-3.5 py-2 border-2 border-black font-black text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? "shadow-[3px_3px_0px_#000] -translate-y-0.5"
                    : "bg-[var(--card-bg)] text-[var(--text-main)] shadow-[1px_1px_0px_#000] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB CONTENT ───────────────────────────────────────────────── */}
        <div className="bg-[var(--card-bg)] border-3 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000] mb-6">
          {/* 1. MUSIC PLAYER SETTINGS */}
          {activeTab === "music" && (
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase text-[var(--text-main)]">
                    Pengaturan Pemutar Musik (Audio Player)
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">
                    Atur lagu MP3, judul, dan status pemutar musik CD berputar di pojok web
                  </p>
                </div>
                <MusicIcon className="w-6 h-6 text-[#FFE135]" />
              </div>

              {/* Toggle Enable/Disable */}
              <div className="p-4 bg-[var(--bg-main)] border-2 border-black flex items-center justify-between">
                <div>
                  <p className="font-black text-xs uppercase">Tampilkan Audio Player:</p>
                  <p className="text-[11px] opacity-70">
                    {form.musicEnabled
                      ? "Player AKTIF dan muncul di pojok kanan bawah"
                      : "Player NONAKTIF dan disembunyikan"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }))}
                  className={`px-4 py-2 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] transition-all ${
                    form.musicEnabled
                      ? "bg-[#00ff66] text-black"
                      : "bg-[#ff5555] text-white"
                  }`}
                >
                  {form.musicEnabled ? "✓ AKTIF (HIDUP)" : "✕ MATI (OFF)"}
                </button>
              </div>

              {/* Music URL */}
              <div>
                <label className="text-xs font-black uppercase mb-1.5 block">
                  Link File Audio (.mp3 / link langsung):
                </label>
                <input
                  type="text"
                  value={form.musicUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, musicUrl: e.target.value }))}
                  placeholder="https://.../lagu.mp3"
                  className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Music Title & Artist */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Judul Lagu (Track Title):
                  </label>
                  <input
                    type="text"
                    value={form.musicTitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, musicTitle: e.target.value }))}
                    placeholder="Contoh: audio2"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Nama Artis / Musisi:
                  </label>
                  <input
                    type="text"
                    value={form.musicArtist}
                    onChange={(e) => setForm((prev) => ({ ...prev, musicArtist: e.target.value }))}
                    placeholder="Contoh: Muhammad Dafa Pratama"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              {/* Audio Preview */}
              <div className="p-4 bg-[var(--bg-main)] border-2 border-black">
                <p className="text-xs font-black uppercase mb-2">Test Putar Audio Saat Ini:</p>
                <audio controls src={form.musicUrl} className="w-full h-10 border border-black" />
              </div>
            </div>
          )}

          {/* 2. QRIS & PAYMENT SETTINGS */}
          {activeTab === "qris" && (
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase text-[var(--text-main)]">
                    Pengaturan QRIS & Nomor Donasi
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">
                    Ganti gambar QRIS dan nomor e-wallet yang tampil di portfolio & linktree
                  </p>
                </div>
                <QrCodeIcon className="w-6 h-6 text-[#00ff66]" />
              </div>

              {/* QRIS Upload & Preview Section */}
              <div className="grid sm:grid-cols-2 gap-6 items-center p-4 bg-[var(--bg-main)] border-2 border-black">
                <div className="flex flex-col items-center">
                  <p className="text-xs font-black uppercase mb-2">Preview QRIS:</p>
                  <div className="w-48 h-48 border-3 border-black bg-white p-2 shadow-[4px_4px_0px_#000] overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrisPreview}
                      alt="QRIS Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black uppercase">Ganti Gambar QRIS:</p>
                  <input
                    ref={qrisFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQrisFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qrisFileInputRef.current?.click()}
                    className="w-full py-3 bg-[#FFE135] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <UploadIcon className="w-4 h-4" />
                    <span>Upload Foto QRIS Baru dari HP / PC</span>
                  </button>
                  <p className="text-[10px] opacity-70 text-center">
                    Atau tempel URL gambar QRIS di bawah ini:
                  </p>
                  <input
                    type="text"
                    value={form.qrisImageUrl}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, qrisImageUrl: e.target.value }));
                      setQrisPreview(e.target.value);
                    }}
                    placeholder="/qris.jpeg atau https://..."
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-3 py-2 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Payment Numbers */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Nomor Dana:
                  </label>
                  <input
                    type="text"
                    value={form.danaNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, danaNumber: e.target.value }))}
                    placeholder="085120170735"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Nomor Gopay & OVO:
                  </label>
                  <input
                    type="text"
                    value={form.gopayNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, gopayNumber: e.target.value }))}
                    placeholder="0895393325895"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              {/* Saweria Link */}
              <div>
                <label className="text-xs font-black uppercase mb-1.5 block">
                  Link Saweria:
                </label>
                <input
                  type="text"
                  value={form.saweriaUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, saweriaUrl: e.target.value }))}
                  placeholder="https://saweria.co/dafaaaaa1111"
                  className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                />
              </div>
            </div>
          )}

          {/* 3. SOCIAL & CONTACT SETTINGS */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black uppercase text-[var(--text-main)]">
                    Pengaturan Kontak & Username Media Sosial
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">
                    Ubah username Telegram, WhatsApp, Instagram, dan tautan komunitas
                  </p>
                </div>
                <TelegramIcon className="w-6 h-6 text-[#00f0ff]" />
              </div>

              {/* Telegram & WhatsApp */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Username Telegram (tanpa @):
                  </label>
                  <input
                    type="text"
                    value={form.telegramUsername}
                    onChange={(e) => setForm((prev) => ({ ...prev, telegramUsername: e.target.value.replace("@", "") }))}
                    placeholder="dafaaaaa11111"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                  <p className="text-[10px] opacity-60 mt-1">Link hasil: t.me/{form.telegramUsername}</p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Nomor WhatsApp (dengan 08 / 62):
                  </label>
                  <input
                    type="text"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                    placeholder="0895393325895"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              {/* Instagram & TikTok */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Username Instagram:
                  </label>
                  <input
                    type="text"
                    value={form.instagramUsername}
                    onChange={(e) => setForm((prev) => ({ ...prev, instagramUsername: e.target.value.replace("@", "") }))}
                    placeholder="dafaaaaa11111"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Username TikTok:
                  </label>
                  <input
                    type="text"
                    value={form.tiktokUsername}
                    onChange={(e) => setForm((prev) => ({ ...prev, tiktokUsername: e.target.value.replace("@", "") }))}
                    placeholder="dafaaaaa11111"
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>

              {/* WA Group & Channel */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Link WhatsApp Group Komunitas:
                  </label>
                  <input
                    type="text"
                    value={form.waGroupUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, waGroupUrl: e.target.value }))}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase mb-1.5 block">
                    Link Saluran WhatsApp Resmi:
                  </label>
                  <input
                    type="text"
                    value={form.waChannelUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, waChannelUrl: e.target.value }))}
                    placeholder="https://whatsapp.com/channel/..."
                    className="w-full bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-xs font-mono font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. DISPLAY & BACKGROUND SETTINGS */}
          {activeTab === "display" && (
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black">
                <h2 className="text-base font-black uppercase text-[var(--text-main)]">
                  Tampilan & Background
                </h2>
                <p className="text-xs opacity-70 mt-0.5">
                  Atur efek background pola dan tampilan visual portfolio
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-main)] border-2 border-black flex items-center justify-between">
                <div>
                  <p className="font-black text-xs uppercase">Efek Custom Background (Pola Grid / Polkadot):</p>
                  <p className="text-[11px] opacity-70">
                    {form.bgEffectEnabled
                      ? "Pola background AKTIF (terlihat motif halus)"
                      : "Pola background NONAKTIF (latar polos bersih)"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, bgEffectEnabled: !prev.bgEffectEnabled }))}
                  className={`px-4 py-2 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] transition-all ${
                    form.bgEffectEnabled
                      ? "bg-[#00ff66] text-black"
                      : "bg-[#ff5555] text-white"
                  }`}
                >
                  {form.bgEffectEnabled ? "✓ AKTIF" : "✕ MATI"}
                </button>
              </div>
            </div>
          )}

          {/* 5. SECURITY & PIN SETTINGS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="pb-3 border-b-2 border-black">
                <h2 className="text-base font-black uppercase text-[var(--text-main)]">
                  Keamanan & PIN Masuk Admin
                </h2>
                <p className="text-xs opacity-70 mt-0.5">
                  Ubah PIN rahasia untuk membuka halaman /admindash ini
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase mb-1.5 block">
                  PIN Admin Baru:
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={form.adminPin}
                  onChange={(e) => setForm((prev) => ({ ...prev, adminPin: e.target.value }))}
                  placeholder="PIN angka atau huruf..."
                  className="w-full max-w-xs bg-white dark:bg-[#1c1c24] text-black dark:text-white border-2 border-black px-4 py-3 text-sm font-mono font-black tracking-widest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] shadow-[2px_2px_0px_#000]"
                />
                <p className="text-[10px] opacity-70 mt-1.5">
                  Pastikan ingat PIN ini. Jika lupa, default PIN darurat adalah 2808.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ─── BOTTOM ACTION CONTROLS ────────────────────────────────────────── */}
        <div className="bg-[var(--card-bg)] border-3 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-[#00ff66] text-black border-2 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-4 h-4 stroke-[3]" />
              <span>Simpan Perubahan</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="px-4 py-3.5 bg-[#FFE135] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
              title="Salin Data Konfigurasi JSON"
            >
              <CopyIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{copiedJson ? "Disalin!" : "Salin JSON"}</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-3.5 bg-[#ff5555] text-white border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            Reset Default
          </button>
        </div>
      </div>
    </main>
  );
}
