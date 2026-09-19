"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import LoadingScreen from "./LoadingScreen";
import ContactSection from "./ContactSection";
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
    level: 90,
    icon: <ExcelIcon className="w-6 h-6 text-[#00ff88]" />,
    color: "#00ff88",
  },
  {
    name: "Microsoft Word",
    level: 88,
    icon: <WordIcon className="w-6 h-6 text-[#4f8ef7]" />,
    color: "#4f8ef7",
  },
  {
    name: "Social Media Mgmt",
    level: 85,
    icon: <ShareNodesIcon className="w-6 h-6 text-[#e1306c]" />,
    color: "#e1306c",
  },
];

const stats = [
  { label: "Status", value: "ONLINE", color: "#00ff88" },
  { label: "Kelas", value: "XI AKL", color: "#4f8ef7" },
  { label: "Sekolah", value: "SMK", color: "#7c5cbf" },
];

const socialLinks = [
  {
    icon: <InstagramIcon className="w-5 h-5 text-[#e1306c]" />,
    label: "Instagram",
    href: "https://instagram.com/dafaaaaa11111",
    username: "@dafaaaaa11111",
    color: "#e1306c",
  },
  {
    icon: <TikTokIcon className="w-5 h-5 text-white" />,
    label: "TikTok",
    href: "https://tiktok.com/@dafaaaaa11111",
    username: "@dafaaaaa11111",
    color: "#00f2fe",
  },
  {
    icon: <FacebookIcon className="w-5 h-5 text-[#1877f2]" />,
    label: "Facebook",
    href: "https://facebook.com/dafaaaaa11111",
    username: "dafaaaaa11111",
    color: "#1877f2",
  },
  {
    icon: <TelegramIcon className="w-5 h-5 text-[#229ed9]" />,
    label: "Telegram",
    href: "https://t.me/dafaaaaa11111",
    username: "@dafaaaaa11111",
    color: "#229ed9",
  },
  {
    icon: <WhatsAppIcon className="w-5 h-5 text-[#25d366]" />,
    label: "WhatsApp",
    href: "https://wa.me/62895393325895",
    username: "+62 895-393-325-895",
    color: "#25d366",
  },
  {
    icon: <BroadcastIcon className="w-5 h-5 text-[#00d4ff]" />,
    label: "WA Channel",
    href: "https://whatsapp.com/channel/0029Vb89x3U5fM5VSAMCHQ16",
    username: "Channel Dafa",
    color: "#00d4ff",
  },
];

// ─── SkillBar ─────────────────────────────────────────────────────────────────
function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
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
    <div ref={ref} className="group" style={{ animationDelay: `${delay}ms` }}>
      <div className="bg-[#12121a] border border-[#1e1e2e] hover:border-[#4f8ef7]/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              {skill.icon}
            </div>
            <span className="text-sm font-medium text-white font-mono">
              {skill.name}
            </span>
          </div>
          <span
            className="text-xs font-mono font-bold"
            style={{ color: skill.color }}
          >
            {skill.level}%
          </span>
        </div>
        <div className="h-1.5 bg-[#0a0a0f] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: animated ? `${skill.level}%` : "0%",
              background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
              transitionDelay: `${delay}ms`,
              boxShadow: `0 0 10px ${skill.color}60`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper with fade-in ─────────────────────────────────────────────
function FadeSection({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {children}
    </div>
  );
}

// ─── PaymentSection ────────────────────────────────────────────────────────────
function PaymentSection() {
  const [showQris, setShowQris] = useState(false);

  return (
    <section id="payment" className="py-24 px-4 bg-[#0d0d14]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-[#7c5cbf] uppercase font-mono mb-3">
            05. Support
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Dukung <span className="text-[#7c5cbf]">Aku</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Jika kamu ingin memberikan apresiasi atau donasi, bisa transfer via:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              label: "Gopay & OVO",
              number: "0895393325895",
              icon: <WalletIcon className="w-6 h-6 text-[#4f8ef7]" />,
              color: "#4f8ef7",
            },
            {
              label: "Dana",
              number: "085120170735",
              icon: <WalletIcon className="w-6 h-6 text-[#7c5cbf]" />,
              color: "#7c5cbf",
            },
          ].map((p) => (
            <div
              key={p.label}
              className="bg-[#12121a] border border-[#1e1e2e] hover:border-[#7c5cbf]/40 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  {p.icon}
                </div>
                <span className="text-sm font-bold text-white">{p.label}</span>
              </div>
              <p
                className="font-mono text-lg tracking-wider"
                style={{ color: p.color }}
              >
                {p.number}
              </p>
            </div>
          ))}
        </div>

        {/* QRIS */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-400">
            <QrCodeIcon className="w-5 h-5 text-[#7c5cbf]" />
            <span>
              Atau scan <span className="text-[#7c5cbf] font-bold">QRIS</span> di sini:
            </span>
          </div>
          {showQris ? (
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/qris.jpeg"
                alt="QRIS Payment"
                className="w-64 h-64 object-contain rounded-xl border border-[#1e1e2e] shadow-[0_0_30px_rgba(124,92,191,0.3)] bg-white p-2"
              />
              <button
                onClick={() => setShowQris(false)}
                className="text-xs text-gray-500 hover:text-white font-mono underline"
              >
                Tutup QRIS
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowQris(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7c5cbf] text-white font-mono text-sm font-bold glow-purple hover:bg-[#6a4daa] transition-all active:scale-95"
            >
              <QrCodeIcon className="w-4 h-4" />
              Tampilkan QRIS
            </button>
          )}
        </div>
      </div>
    </section>
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
        { threshold: 0.4 }
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

      <main className="relative">
        {/* Animated grid background */}
        <div
          className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,142,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center px-4 pt-20 relative overflow-hidden"
        >
          {/* Decorative blobs */}
          <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-[#4f8ef7]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-[#7c5cbf]/10 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="animate-slide-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse-glow" />
                <span className="text-xs font-mono text-[#00ff88]">
                  AVAILABLE FOR COLLAB
                </span>
              </div>

              {/* Name */}
              <div className="mb-4">
                <p className="text-xs tracking-[0.4em] text-[#4f8ef7] uppercase font-mono mb-2">
                  &gt; Hello, I&apos;m
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  {typedText}
                  <span className="text-[#4f8ef7] animate-blink ml-0.5">|</span>
                </h1>
              </div>

              {/* Tag line */}
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Siswa{" "}
                <span className="text-[#4f8ef7] font-semibold">SMK Kelas XI</span>{" "}
                jurusan{" "}
                <span className="text-[#7c5cbf] font-semibold">AKL</span> yang
                antusias di bidang{" "}
                <span className="text-white">administrasi</span>,{" "}
                <span className="text-white">media sosial</span>, dan{" "}
                <span className="text-white">teknologi digital</span>.
              </p>

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
                  className="px-6 py-3 rounded-xl bg-[#4f8ef7] text-white font-bold font-mono text-sm glow-blue hover:bg-[#3a7de8] transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Kirim Pesan</span>
                  <span>→</span>
                </a>
                <a
                  href="https://wa.me/62895393325895"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-transparent border border-[#25d366]/40 text-[#25d366] font-bold font-mono text-sm hover:bg-[#25d366]/10 transition-all active:scale-95 flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25d366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right — Avatar + stats */}
            <div className="animate-slide-right flex flex-col items-center gap-6">
              {/* Avatar container */}
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-72 rounded-2xl overflow-hidden border-2 border-[#4f8ef7]/40 glow-blue animate-float relative bg-[#12121a] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero-banner.jpg"
                    alt="Character Anime Banner"
                    className="w-full h-full object-cover object-top filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/20 pointer-events-none" />

                  {/* Watermark / Dev Badge aesthetic */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-[#4f8ef7]/40">
                    <span className="text-[10px] font-mono text-[#00d4ff] font-bold">
                      ● LIVE · REALTIME
                    </span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-3 -right-3 bg-[#12121a] border border-[#4f8ef7]/30 rounded-xl px-3 py-2 glow-blue">
                  <p className="text-xs font-mono text-[#4f8ef7] font-bold">
                    SMK · XI AKL
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-3 text-center"
                  >
                    <p
                      className="text-xs font-bold font-mono"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="text-xs font-mono text-gray-500">scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-[#4f8ef7] to-transparent" />
          </div>
        </section>

        {/* ── ABOUT SECTION ────────────────────────────────────────── */}
        <FadeSection id="about">
          <section className="py-24 px-4 bg-[#0d0d14]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs tracking-[0.3em] text-[#4f8ef7] uppercase font-mono mb-3">
                  02. About
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Tentang <span className="text-[#4f8ef7]">Aku</span>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Bio card */}
                <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e1e2e]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-xs text-gray-600 font-mono ml-2">
                      about.json
                    </span>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <p>
                      <span className="text-[#4f8ef7]">nama</span>:{" "}
                      <span className="text-[#00ff88]">
                        &quot;Muhammad Dafa Pratama&quot;
                      </span>
                    </p>
                    <p>
                      <span className="text-[#4f8ef7]">sekolah</span>:{" "}
                      <span className="text-[#00ff88]">&quot;SMK&quot;</span>
                    </p>
                    <p>
                      <span className="text-[#4f8ef7]">kelas</span>:{" "}
                      <span className="text-[#00ff88]">
                        &quot;XI (11)&quot;
                      </span>
                    </p>
                    <p>
                      <span className="text-[#4f8ef7]">jurusan</span>:{" "}
                      <span className="text-[#00ff88]">&quot;AKL&quot;</span>
                    </p>
                    <p>
                      <span className="text-[#4f8ef7]">status</span>:{" "}
                      <span className="text-[#00ff88]">
                        &quot;Pelajar Aktif&quot;
                      </span>
                    </p>
                    <p>
                      <span className="text-[#4f8ef7]">passion</span>: [
                    </p>
                    <p className="pl-4 text-[#00ff88]">
                      &quot;Administrasi&quot;,
                    </p>
                    <p className="pl-4 text-[#00ff88]">
                      &quot;Social Media&quot;,
                    </p>
                    <p className="pl-4 text-[#00ff88]">
                      &quot;Teknologi Digital&quot;
                    </p>
                    <p>]</p>
                  </div>
                </div>

                {/* Info tiles */}
                <div className="space-y-4">
                  {[
                    {
                      icon: (
                        <GraduationCapIcon className="w-5 h-5 text-[#4f8ef7]" />
                      ),
                      title: "Pelajar SMK",
                      desc: "Saat ini menempuh pendidikan di SMK Kelas XI jurusan Akuntansi Keuangan dan Lembaga (AKL).",
                      color: "#4f8ef7",
                    },
                    {
                      icon: (
                        <AccountingIcon className="w-5 h-5 text-[#00ff88]" />
                      ),
                      title: "AKL Enthusiast",
                      desc: "Menguasai pembukuan, administrasi keuangan, serta tools seperti Microsoft Excel & Word.",
                      color: "#00ff88",
                    },
                    {
                      icon: (
                        <SparklesIcon className="w-5 h-5 text-[#7c5cbf]" />
                      ),
                      title: "Digital Creator",
                      desc: "Aktif di berbagai platform sosial media sebagai kreator konten digital.",
                      color: "#7c5cbf",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-[#12121a] border border-[#1e1e2e] hover:border-[#4f8ef7]/30 rounded-xl p-4 flex gap-4 transition-all duration-200 hover:-translate-x-1"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${item.color}20` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm mb-1">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social links grid */}
              <div className="mt-10">
                <p className="text-xs text-gray-500 font-mono mb-4 text-center">
                  // Temukan akun resmi ku di:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 bg-[#12121a] border border-[#1e1e2e] hover:border-[#4f8ef7]/50 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `${s.color}18` }}
                      >
                        {s.icon}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white group-hover:text-[#4f8ef7] transition-colors">
                          {s.label}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono truncate">
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
          <section className="py-24 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs tracking-[0.3em] text-[#4f8ef7] uppercase font-mono mb-3">
                  03. Skills
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Keahlian <span className="text-[#4f8ef7]">Ku</span>
                </h2>
              </div>

              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <SkillBar key={skill.name} skill={skill} delay={i * 150} />
                ))}
              </div>

              {/* WA Community */}
              <div className="mt-10 bg-[#12121a] border border-[#25d366]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(37,211,102,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#25d366]/15 flex items-center justify-center">
                    <WhatsAppIcon className="w-6 h-6 text-[#25d366]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      Bergabung di Komunitas Resmi
                    </p>
                    <p className="text-xs text-gray-400">
                      Grup & Saluran WhatsApp
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://chat.whatsapp.com/BA2BZeMGysXGOJI0JxF8Yb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366]/15 border border-[#25d366]/40 text-[#25d366] text-xs font-mono font-bold hover:bg-[#25d366]/25 transition-all active:scale-95"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Join WA Group</span>
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029Vb89x3U5fM5VSAMCHQ16"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/40 text-[#00d4ff] text-xs font-mono font-bold hover:bg-[#00d4ff]/25 transition-all active:scale-95"
                  >
                    <BroadcastIcon className="w-4 h-4" />
                    <span>Follow WA Channel</span>
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
        <footer className="py-8 px-4 border-t border-[#1e1e2e] text-center">
          <p className="text-xs text-gray-600 font-mono">
            Built with modern technology by{" "}
            <span className="text-[#4f8ef7]">Muhammad Dafa Pratama</span> ·{" "}
            {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-gray-700 font-mono mt-1">
            SMK XI AKL · Indonesia
          </p>
        </footer>
      </main>
    </>
  );
}
