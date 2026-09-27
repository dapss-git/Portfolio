"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "../ThemeContext";
import {
  WhatsAppIcon,
  TelegramIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  BroadcastIcon,
  SaweriaIcon,
  QrCodeIcon,
  WalletIcon,
  CopyIcon,
  CheckIcon,
  ArrowLeftIcon,
  DownloadIcon,
  ShareNodesIcon,
} from "../Icons";

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
        className="relative flex flex-col items-center gap-4 w-full max-w-sm bg-white p-5 rounded-2xl border-3 border-black shadow-[8px_8px_0px_#000] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b-2 border-black">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-[#f4f4f5] hover:bg-gray-200 text-xs font-mono font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <span className="text-xs font-black font-mono tracking-wider uppercase bg-[#FFE600] px-2 py-0.5 rounded border border-black">
            QRIS Pembayaran
          </span>
        </div>

        {/* QRIS Image Card */}
        <div className="w-full rounded-xl overflow-hidden border-2 border-black p-2 bg-white shadow-[3px_3px_0px_#000]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/qris.jpeg"
            alt="QRIS Payment Dafa Pratama"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        <p className="text-[11px] text-gray-700 font-mono text-center font-bold">
          Muhammad Dafa Pratama · Dana / Gopay / OVO / ShopeePay / Bank
        </p>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FFE600] hover:bg-[#ffe033] border-2 border-black text-black font-black font-mono text-sm shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <DownloadIcon className="w-4 h-4" />
          Download Gambar QRIS
        </button>
      </div>
    </div>
  );
}

export default function LinksPage() {
  const [showQris, setShowQris] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setToast(`${label} berhasil disalin!`);
    setTimeout(() => {
      setCopiedText(null);
      setToast(null);
    }, 2000);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://portfolio.daps.my.id/links";
    if (navigator.share) {
      navigator.share({
        title: "Muhammad Dafa Pratama Links",
        text: "Kumpulan link media sosial dan kontak Muhammad Dafa Pratama",
        url,
      }).catch(() => {});
    } else {
      handleCopy(url, "Link Profil");
    }
  };

interface LinkItem {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  highlight?: boolean;
}

interface LinkCategory {
  category: string;
  color: string;
  links: LinkItem[];
}

  const linkSections: LinkCategory[] = [
    {
      category: "WhatsApp & Komunitas",
      color: "#25d366",
      links: [
        {
          title: "WhatsApp Chat Pribadi",
          subtitle: "Kirim pesan / ngobrol langsung",
          icon: <WhatsAppIcon className="w-5 h-5 text-[#25d366]" />,
          href: "https://wa.me/62895393325895",
          highlight: true,
          badge: "Chat Dafa",
        },
        {
          title: "WhatsApp Group Komunitas",
          subtitle: "Gabung ke grup diskusi & silaturahmi",
          icon: <WhatsAppIcon className="w-5 h-5 text-[#25d366]" />,
          href: "https://chat.whatsapp.com/BA2BZeMGysXGOJI0JxF8Yb",
          badge: "Group WA",
        },
        {
          title: "WhatsApp Saluran Resmi",
          subtitle: "Info update & pengumuman terbaru",
          icon: <BroadcastIcon className="w-5 h-5 text-[#00d4ff]" />,
          href: "https://whatsapp.com/channel/0029Vb89x3U5fM5VSAMCHQ16",
          badge: "Channel",
        },
      ],
    },
    {
      category: "Media Sosial Resmi",
      color: "#00F0FF",
      links: [
        {
          title: "Telegram Pribadi",
          subtitle: "@dafaaaaa11111",
          icon: <TelegramIcon className="w-5 h-5 text-[#229ed9]" />,
          href: "https://t.me/dafaaaaa11111",
        },
        {
          title: "Instagram",
          subtitle: "@dafaaaaa11111",
          icon: <InstagramIcon className="w-5 h-5 text-[#e1306c]" />,
          href: "https://instagram.com/dafaaaaa11111",
        },
        {
          title: "TikTok",
          subtitle: "@dafaaaaa11111",
          icon: <TikTokIcon className="w-5 h-5 text-black dark:text-white" />,
          href: "https://tiktok.com/@dafaaaaa11111",
        },
        {
          title: "Facebook",
          subtitle: "Dafa Pratama",
          icon: <FacebookIcon className="w-5 h-5 text-[#1877f2]" />,
          href: "https://facebook.com/dafaaaaa11111",
        },
      ],
    },
    {
      category: "Dukungan & Donasi",
      color: "#FFE600",
      links: [
        {
          title: "Saweria Dafa",
          subtitle: "saweria.co/dafaaaaa1111",
          icon: <SaweriaIcon className="w-6 h-6" />,
          href: "https://saweria.co/dafaaaaa1111",
          badge: "Saweria",
        },
      ],
    },
  ];

  return (
    <>
      {showQris && <QrisModal onClose={() => setShowQris(false)} />}

      <main className="min-h-screen py-8 px-4 flex flex-col items-center">
        {/* Toast */}
        {toast && (
          <div className="fixed top-5 z-50 px-4 py-2 bg-[#FFE600] text-black border-2 border-black rounded-xl font-mono text-xs font-black shadow-[4px_4px_0px_#000] animate-fade-up">
            {toast}
          </div>
        )}

        <div className="w-full max-w-md flex flex-col items-center">
          {/* Top Bar (Back to Home & Theme Switcher) */}
          <div className="w-full flex items-center justify-between mb-6 pb-3 border-b-2 border-black">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white dark:bg-[#18181f] text-black dark:text-white font-mono text-xs font-black shadow-[2px_2px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Website Portfolio</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                title="Bagikan Halaman Ini"
                className="p-1.5 rounded-lg border-2 border-black bg-white dark:bg-[#18181f] text-black dark:text-white shadow-[2px_2px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <ShareNodesIcon className="w-4 h-4" />
              </button>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Profile Header (Neobrutalism Card) */}
          <div className="w-full bg-white dark:bg-[#1c1c24] border-3 border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000] text-black dark:text-white mb-6 text-center flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full border-3 border-black overflow-hidden shadow-[3px_3px_0px_#000] bg-[#FFE600]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-banner.jpg"
                  alt="Muhammad Dafa Pratama"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00F0FF] border-2 border-black flex items-center justify-center text-xs font-black shadow-[1px_1px_0px_#000]">
                ✓
              </span>
            </div>

            {/* Name & Badge */}
            <h1 className="text-xl font-black font-mono tracking-tight mb-1">
              Muhammad Dafa Pratama
            </h1>
            <p className="text-xs font-bold font-mono text-[#0066FF] dark:text-[#00F0FF] mb-2">
              @dafaaaaa11111
            </p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 font-mono max-w-xs leading-relaxed bg-[#f4f4f5] dark:bg-[#27272a] p-2.5 rounded-xl border border-black">
              Siswa SMK Kelas XI AKL · Digital Creator & Content Creator
            </p>
          </div>

          {/* Links Sections */}
          <div className="w-full flex flex-col gap-6">
            {linkSections.map((sec) => (
              <div key={sec.category} className="w-full">
                <p className="text-xs font-black font-mono uppercase tracking-wider mb-2.5 px-1 text-black dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 border-2 border-black rounded-sm" style={{ backgroundColor: sec.color }} />
                  <span>{sec.category}</span>
                </p>

                <div className="flex flex-col gap-2.5">
                  {sec.links.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-black bg-white dark:bg-[#1c1c24] text-black dark:text-white shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg border-2 border-black bg-[#f4f4f5] dark:bg-[#27272a] flex-shrink-0 group-hover:scale-105 transition-transform">
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black font-mono leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-mono text-gray-600 dark:text-gray-400 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded border border-black bg-[#FFE600] text-black font-mono text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Transfer & QRIS Cards */}
            <div className="w-full">
              <p className="text-xs font-black font-mono uppercase tracking-wider mb-2.5 px-1 text-black dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 border-2 border-black rounded-sm bg-[#FF5C8D]" />
                <span>Transfer Langsung & QRIS</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                {[
                  {
                    label: "Gopay & OVO",
                    number: "0895393325895",
                    icon: <WalletIcon className="w-4 h-4" />,
                  },
                  {
                    label: "Dana",
                    number: "085120170735",
                    icon: <WalletIcon className="w-4 h-4" />,
                  },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="p-3 rounded-xl border-2 border-black bg-white dark:bg-[#1c1c24] text-black dark:text-white shadow-[3px_3px_0px_#000] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold font-mono text-gray-600 dark:text-gray-400">
                        {p.label}
                      </span>
                      <p className="text-xs font-black font-mono tracking-wider">
                        {p.number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(p.number, p.label)}
                      className="px-2.5 py-1.5 rounded-lg border-2 border-black bg-[#FFE600] text-black text-[11px] font-mono font-bold shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
                    >
                      {copiedText === p.label ? (
                        <>
                          <CheckIcon className="w-3 h-3 text-black" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3 h-3 text-black" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* QRIS Button */}
              <button
                onClick={() => setShowQris(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-black bg-[#FFE600] text-black shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border-2 border-black bg-white">
                    <QrCodeIcon className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black font-mono">Buka QRIS Fullscreen</p>
                    <p className="text-[11px] font-mono text-gray-800">Scan & download gambar QRIS</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-black border border-black bg-white px-2.5 py-1 rounded-lg">
                  Lihat QRIS →
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center text-xs text-gray-500 dark:text-gray-400 font-mono pb-8">
            <p className="font-bold text-black dark:text-white">
              Muhammad Dafa Pratama
            </p>
            <p className="text-[11px] mt-1">
              portfolio.daps.my.id · Neobrutalism Edition
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
