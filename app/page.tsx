"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import LoadingScreen from "./LoadingScreen";
import ContactSection from "./ContactSection";
import BirthdayCountdown from "./BirthdayCountdown";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  TelegramIcon,
  FacebookIcon,
  BroadcastIcon,
  ExcelIcon,
  WordIcon,
  ShareNodesIcon,
  WalletIcon,
  QrCodeIcon,
  GraduationCapIcon,
  AccountingIcon,
  SparklesIcon,
  ArrowLeftIcon,
  DownloadIcon,
  SaweriaIcon,
  CopyIcon,
  CheckIcon,
  LinkIcon,
} from "./Icons";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const skills: Skill[] = [
  {
    name: "Microsoft Excel",
    level: 73,
    icon: <ExcelIcon className="w-6 h-6 text-black" />,
    color: "#00ff66",
  },
  {
    name: "Microsoft Word",
    level: 88,
    icon: <WordIcon className="w-6 h-6 text-black" />,
    color: "#00f0ff",
  },
  {
    name: "Social Media Mgmt",
    level: 85,
    icon: <ShareNodesIcon className="w-6 h-6 text-black" />,
    color: "#ff70a6",
  },
];

const stats = [
  { label: "Status", value: "ONLINE", bg: "#00ff66" },
  { label: "Kelas", value: "XI AKL", bg: "#FFE135" },
  { label: "Sekolah", value: "SMK", bg: "#00f0ff" },
];

const socialLinks = [
  {
    icon: <InstagramIcon className="w-5 h-5 text-black" />,
    label: "Instagram",
    href: "https://instagram.com/dafaaaaa11111",
    username: "@dafaaaaa11111",
    bg: "#ff70a6",
  },
  {
    icon: <TikTokIcon className="w-5 h-5 text-black" />,
    label: "TikTok",
    href: "https://tiktok.com/@dafaaaaa11111",
    username: "@dafaaaaa11111",
    bg: "#00f0ff",
  },
  {
    icon: <FacebookIcon className="w-5 h-5 text-black" />,
    label: "Facebook",
    href: "https://facebook.com/dafaaaaa11111",
    username: "dafaaaaa11111",
    bg: "#8338ec",
  },
  {
    icon: <TelegramIcon className="w-5 h-5 text-black" />,
    label: "Telegram",
    href: "https://t.me/dafaaaaa11111",
    username: "@dafaaaaa11111",
    bg: "#00f0ff",
  },
  {
    icon: <WhatsAppIcon className="w-5 h-5 text-black" />,
    label: "WhatsApp",
    href: "https://wa.me/62895393325895",
    username: "+62 895-393-325-895",
    bg: "#00ff66",
  },
  {
    icon: <BroadcastIcon className="w-5 h-5 text-black" />,
    label: "WA Channel",
    href: "https://whatsapp.com/channel/0029Vb89x3U5fM5VSAMCHQ16",
    username: "Channel Dafa",
    bg: "#FFE135",
  },
];

// ─── SkillBar ─────────────────────────────────────────────────────────────────
function SkillBar({ skill }: { skill: Skill }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="bg-[var(--card-bg)] border-2 sm:border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]"
            style={{ background: skill.color }}
          >
            {skill.icon}
          </div>
          <span className="font-mono font-black text-sm sm:text-base text-[var(--text-main)]">
            {skill.name}
          </span>
        </div>
        <span className="font-mono font-black text-xs px-2.5 py-1 bg-black text-white border border-black">
          {skill.level}%
        </span>
      </div>
      <div className="h-4 bg-[var(--bg-main)] border-2 border-black overflow-hidden p-0.5">
        <div
          className="h-full border border-black transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${skill.level}%` : "0%",
            background: skill.color,
          }}
        />
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function FadeSection({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div id={id} className="w-full">
      {children}
    </div>
  );
}

// ─── QRIS Modal ───────────────────────────────────────────────────────────────
function QrisModal({ onClose }: { onClose: () => void }) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/qris.jpeg";
    a.download = "QRIS-DafaPratama.jpeg";
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-5 w-full max-w-sm bg-[var(--card-bg)] border-3 border-black p-5 sm:p-6 shadow-[8px_8px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 border-black pb-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff5555] text-white border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Tutup
          </button>
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
            QRIS PAYMENT
          </span>
        </div>

        {/* QRIS image card */}
        <div className="border-3 border-black shadow-[4px_4px_0px_#000] overflow-hidden bg-white w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/qris.jpeg"
            alt="QRIS Payment Dafa Pratama"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Info */}
        <p className="text-xs font-mono font-bold text-center text-[var(--text-main)]">
          Muhammad Dafa Pratama · Dana / Gopay / OVO / ShopeePay / Bank
        </p>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#00ff66] text-black border-2 border-black font-mono font-black text-sm uppercase shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Download Gambar QRIS</span>
        </button>
      </div>
    </div>
  );
}

// ─── PaymentSection ────────────────────────────────────────────────────────────
function PaymentSection() {
  const [showQris, setShowQris] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(num);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {showQris && <QrisModal onClose={() => setShowQris(false)} />}

      <section id="payment" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-[#8338ec] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-xs font-black uppercase mb-3">
              05. Support &amp; Donasi
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-main)] mb-3">
              Dukung{" "}
              <span
                style={{ backgroundColor: "var(--accent-primary)" }}
                className="px-2 py-0.5 text-black border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                Aku
              </span>
            </h2>
            <p className="text-sm font-mono opacity-80 text-[var(--text-main)]">
              Dukungan atau donasi dapat disalurkan melalui nomor e-wallet atau scan QRIS di bawah:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {[
              {
                label: "Gopay & OVO",
                number: "0895393325895",
                icon: <WalletIcon className="w-5 h-5 text-black" />,
                bg: "#00f0ff",
              },
              {
                label: "Dana",
                number: "085120170735",
                icon: <WalletIcon className="w-5 h-5 text-black" />,
                bg: "#FFE135",
              },
            ].map((p) => (
              <div
                key={p.label}
                className="bg-[var(--card-bg)] border-2 sm:border-3 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]"
                    style={{ background: p.bg }}
                  >
                    {p.icon}
                  </div>
                  <span className="font-mono font-black text-sm uppercase text-[var(--text-main)]">
                    {p.label}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t-2 border-black">
                  <span className="font-mono text-base font-black text-[var(--text-main)]">
                    {p.number}
                  </span>
                  <button
                    onClick={() => handleCopy(p.number)}
                    title="Salin nomor"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff66] text-black border-2 border-black text-xs font-mono font-black uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    {copied === p.number ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Disalin</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Saweria Card */}
          <a
            href="https://saweria.co/dafaaaaa1111"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 bg-[#FFE135] text-black border-2 sm:border-3 border-black p-4 sm:p-5 mb-4 shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
              <SaweriaIcon className="w-7 h-7" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-mono font-black text-sm uppercase">Saweria Tip &amp; Donasi</p>
              <p className="text-xs font-mono font-bold opacity-80">saweria.co/dafaaaaa1111</p>
            </div>
            <span className="px-3 py-1.5 bg-black text-white border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#000]">
              Buka →
            </span>
          </a>

          {/* QRIS Card */}
          <button
            onClick={() => setShowQris(true)}
            className="w-full bg-[var(--card-bg)] border-2 sm:border-3 border-black p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#00ff66] border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]">
                  <QrCodeIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-mono font-black text-sm uppercase text-[var(--text-main)]">
                    Scan Pembayaran QRIS
                  </p>
                  <p className="text-xs font-mono opacity-70 text-[var(--text-main)]">
                    Klik untuk membuka QRIS fullscreen
                  </p>
                </div>
              </div>

              {/* QRIS thumbnail */}
              <div className="w-14 h-14 bg-white border-2 border-black overflow-hidden flex-shrink-0 shadow-[2px_2px_0px_#000]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qris.jpeg"
                  alt="QRIS Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-center gap-2 bg-[#00f0ff] py-2 border-2 border-black text-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#000]">
              <QrCodeIcon className="w-4 h-4" />
              <span>Lihat QRIS Fullscreen</span>
            </div>
          </button>
        </div>
      </section>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("");
  const fullText = "Muhammad Dafa Pratama";

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = ["home", "about", "skills", "contact", "payment"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      <LoadingScreen />
      <Navbar activeSection={activeSection} />

      <main className="relative pt-16">
        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <section
          id="home"
          className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 py-12 relative"
        >
          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              {/* Name */}
              <div className="mb-4">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] opacity-70 mb-2">
                  &gt; Halo, Saya
                </p>
                <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-main)] leading-tight uppercase">
                  {typedText}
                  <span
                    style={{ backgroundColor: "var(--accent-primary)" }}
                    className="text-black px-1 ml-1 border-2 border-black inline-block animate-pulse"
                  >
                    _
                  </span>
                </h1>
              </div>

              {/* Tag line */}
              <div className="bg-[var(--card-bg)] border-2 sm:border-3 border-black p-4 shadow-[4px_4px_0px_#000] mb-6">
                <p className="text-sm sm:text-base font-mono text-[var(--text-main)] leading-relaxed">
                  Siswa <span className="bg-[#FFE135] text-black px-1 font-black">SMK Kelas XI</span> jurusan{" "}
                  <span className="bg-[#00f0ff] text-black px-1 font-black">AKL</span> yang
                  fokus pada bidang administrasi, pengelolaan media sosial, dan teknologi digital.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{ backgroundColor: "var(--accent-primary)" }}
                  className="px-5 py-3 text-black font-black font-mono text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                >
                  <span>Kirim Pesan</span>
                  <span>→</span>
                </a>
                <a
                  href="https://wa.me/62895393325895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#00ff66] text-black font-black font-mono text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-black" />
                  <span>WhatsApp</span>
                </a>
                <Link
                  href="/links"
                  className="px-5 py-3 bg-[#FFE135] text-black font-black font-mono text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4 text-black" />
                  <span>Bio / Linktree</span>
                </Link>
              </div>
            </div>

            {/* Right — Avatar + stats + Countdown */}
            <div className="flex flex-col items-center gap-5">
              {/* Avatar container with Neobrutalism frame */}
              <div className="relative">
                <div className="w-64 h-64 sm:w-72 sm:h-72 border-3 sm:border-4 border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero-banner.jpg"
                    alt="Character Banner"
                    className="w-full h-full object-cover object-top filter brightness-100 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-[#00f0ff] border-2 border-black px-3 py-1 shadow-[3px_3px_0px_#000]">
                  <p className="text-xs font-mono text-black font-black">
                    SMK · XI AKL
                  </p>
                </div>
              </div>

              {/* Realtime Birthday Countdown */}
              <BirthdayCountdown />

              {/* Stats tiles */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="border-2 border-black p-2.5 text-center shadow-[3px_3px_0px_#000]"
                    style={{ background: s.bg }}
                  >
                    <p className="text-xs font-black font-mono text-black">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-black font-mono font-bold uppercase mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT SECTION ────────────────────────────────────────── */}
        <FadeSection id="about">
          <section className="py-20 px-4 border-t-2 border-black bg-[var(--card-bg)]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-block px-3 py-1 bg-[#00f0ff] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-xs font-black uppercase mb-3">
                  02. About
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
                  Tentang{" "}
                  <span
                    style={{ backgroundColor: "var(--accent-primary)" }}
                    className="px-2 py-0.5 text-black border-2 border-black shadow-[3px_3px_0px_#000]"
                  >
                    Aku
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Bio card */}
                <div className="bg-[var(--bg-main)] border-2 sm:border-3 border-black p-5 sm:p-6 shadow-[5px_5px_0px_#000]">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border border-black bg-[#ff5555] inline-block" />
                      <span className="w-3 h-3 border border-black bg-[#FFE135] inline-block" />
                      <span className="w-3 h-3 border border-black bg-[#00ff66] inline-block" />
                    </div>
                    <span className="text-xs font-mono font-black uppercase text-[var(--text-main)]">
                      profil.json
                    </span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm space-y-2 text-[var(--text-main)]">
                    <p>
                      <span className="text-[#ff0055] font-black">&quot;nama&quot;</span>:{" "}
                      <span className="font-bold">&quot;Muhammad Dafa Pratama&quot;</span>,
                    </p>
                    <p>
                      <span className="text-[#ff0055] font-black">&quot;sekolah&quot;</span>:{" "}
                      <span className="font-bold">&quot;SMK Swasta&quot;</span>,
                    </p>
                    <p>
                      <span className="text-[#ff0055] font-black">&quot;kelas&quot;</span>:{" "}
                      <span className="font-bold">&quot;XI (11)&quot;</span>,
                    </p>
                    <p>
                      <span className="text-[#ff0055] font-black">&quot;jurusan&quot;</span>:{" "}
                      <span className="font-bold">&quot;Akuntansi dan Keuangan Lembaga (AKL)&quot;</span>,
                    </p>
                    <p>
                      <span className="text-[#ff0055] font-black">&quot;status&quot;</span>:{" "}
                      <span className="font-bold">&quot;Pelajar Aktif&quot;</span>,
                    </p>
                    <p>
                      <span className="text-[#ff0055] font-black">&quot;minat&quot;</span>: [
                    </p>
                    <p className="pl-4 font-bold">&quot;Administrasi Keuangan&quot;,</p>
                    <p className="pl-4 font-bold">&quot;Manajemen Media Sosial&quot;,</p>
                    <p className="pl-4 font-bold">&quot;Teknologi Digital&quot;</p>
                    <p>]</p>
                  </div>
                </div>

                {/* Info tiles */}
                <div className="space-y-3">
                  {[
                    {
                      icon: <GraduationCapIcon className="w-5 h-5 text-black" />,
                      title: "Pelajar SMK Swasta",
                      desc: "Menempuh pendidikan di SMK Swasta Kelas XI jurusan Akuntansi Keuangan dan Lembaga (AKL).",
                      bg: "#00f0ff",
                    },
                    {
                      icon: <AccountingIcon className="w-5 h-5 text-black" />,
                      title: "Keahlian AKL",
                      desc: "Menguasai dasar pembukuan, administrasi transaksi, Microsoft Excel, dan Microsoft Word.",
                      bg: "#00ff66",
                    },
                    {
                      icon: <SparklesIcon className="w-5 h-5 text-black" />,
                      title: "Digital & Social Media",
                      desc: "Aktif mengelola media sosial, konten komunitas digital, dan interaksi online.",
                      bg: "#FFE135",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-[var(--bg-main)] border-2 border-black p-4 flex gap-4 items-center shadow-[4px_4px_0px_#000] hover:-translate-x-1 transition-all"
                    >
                      <div
                        className="w-11 h-11 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#000]"
                        style={{ background: item.bg }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-mono font-black text-sm text-[var(--text-main)] uppercase">
                          {item.title}
                        </p>
                        <p className="text-xs font-mono text-[var(--text-main)] opacity-80 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social links grid */}
              <div className="mt-10">
                <p className="text-xs font-mono font-black uppercase text-center mb-4 text-[var(--text-main)]">
                  Akun Sosial Media &amp; Komunitas
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group"
                      style={{ background: s.bg }}
                    >
                      <div className="w-8 h-8 bg-white border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]">
                        {s.icon}
                      </div>
                      <div className="overflow-hidden text-left">
                        <p className="text-xs font-black font-mono uppercase text-black">
                          {s.label}
                        </p>
                        <p className="text-[10px] font-mono text-black font-bold truncate opacity-80">
                          {s.username}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeSection>

        {/* ── SKILLS SECTION ───────────────────────────────────────── */}
        <FadeSection id="skills">
          <section className="py-20 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-block px-3 py-1 bg-[#ff70a6] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-xs font-black uppercase mb-3">
                  03. Skills
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-main)]">
                  Keahlian{" "}
                  <span
                    style={{ backgroundColor: "var(--accent-primary)" }}
                    className="px-2 py-0.5 text-black border-2 border-black shadow-[3px_3px_0px_#000]"
                  >
                    Ku
                  </span>
                </h2>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>

              {/* WA Community Card */}
              <div className="mt-8 bg-[var(--card-bg)] border-2 sm:border-3 border-black p-5 sm:p-6 shadow-[5px_5px_0px_#000]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#00ff66] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                    <WhatsAppIcon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-mono font-black text-sm uppercase text-[var(--text-main)]">
                      Komunitas &amp; Saluran WhatsApp
                    </p>
                    <p className="text-xs font-mono text-[var(--text-main)] opacity-70">
                      Grup diskusi dan update seputar aktivitas Dafa
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://chat.whatsapp.com/BA2BZeMGysXGOJI0JxF8Yb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#00ff66] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-black" />
                    <span>Gabung Grup WA</span>
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029Vb89x3U5fM5VSAMCHQ16"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#00f0ff] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <BroadcastIcon className="w-4 h-4 text-black" />
                    <span>Ikuti Saluran WA</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </FadeSection>

        {/* ── CONTACT SECTION ──────────────────────────────────────── */}
        <FadeSection id="contact">
          <ContactSection />
        </FadeSection>

        {/* ── PAYMENT SECTION ──────────────────────────────────────── */}
        <FadeSection id="payment">
          <PaymentSection />
        </FadeSection>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer className="py-8 px-4 border-t-2 sm:border-t-3 border-black bg-[var(--card-bg)] text-center">
          <p className="text-xs font-mono font-bold text-[var(--text-main)]">
            Dibuat oleh{" "}
            <span
              style={{ backgroundColor: "var(--accent-primary)" }}
              className="text-black px-1.5 py-0.5 border border-black font-black"
            >
              Muhammad Dafa Pratama
            </span>{" "}
            · {new Date().getFullYear()}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Link
              href="/links"
              className="text-xs font-mono font-black underline text-[var(--text-main)] hover:text-[#00f0ff]"
            >
              Halaman Linktree
            </Link>
            <span className="text-[var(--text-main)]">·</span>
            <span className="text-[10px] font-mono text-[var(--text-main)] opacity-70">
              SMK XI AKL · Indonesia
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
