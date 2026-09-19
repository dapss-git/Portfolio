"use client";

import { useState } from "react";
import SliderVerify from "./SliderVerify";
import {
  WhatsAppIcon,
  TelegramIcon,
  InstagramIcon,
  TikTokIcon,
} from "./Icons";

type SendStatus = "idle" | "verified" | "loading" | "success" | "error";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", message: "" });
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerified = () => setStatus("verified");

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) return;
    if (status !== "verified") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Gagal mengirim pesan");
      }

      setStatus("success");
      setForm({ name: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim pesan. Coba lagi.";
      setErrorMsg(msg);
      setTimeout(() => setStatus("verified"), 3000);
    }
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-[#4f8ef7] uppercase font-mono mb-3">
            04. Contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hubungi <span className="text-[#4f8ef7]">Aku</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Ada pertanyaan atau mau ngobrol? Kirim pesan langsung ke sini!
          </p>
        </div>

        {/* Social quick links with Vector Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "WhatsApp",
              icon: <WhatsAppIcon className="w-6 h-6 text-[#25d366]" />,
              href: "https://wa.me/62895393325895",
              color: "#25d366",
            },
            {
              label: "Telegram",
              icon: <TelegramIcon className="w-6 h-6 text-[#229ed9]" />,
              href: "https://t.me/dafaaaaa11111",
              color: "#229ed9",
            },
            {
              label: "Instagram",
              icon: <InstagramIcon className="w-6 h-6 text-[#e1306c]" />,
              href: "https://instagram.com/dafaaaaa11111",
              color: "#e1306c",
            },
            {
              label: "TikTok",
              icon: <TikTokIcon className="w-6 h-6 text-white" />,
              href: "https://tiktok.com/@dafaaaaa11111",
              color: "#ffffff",
            },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2.5 py-4 rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#4f8ef7]/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${s.color}15` }}
              >
                {s.icon}
              </div>
              <span className="text-xs font-semibold text-gray-300 group-hover:text-white font-mono transition-colors">
                {s.label}
              </span>
            </a>
          ))}
        </div>

        {/* Contact form card */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 md:p-8">
          {/* Status bar */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#1e1e2e]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-600 font-mono ml-2">message.ts</span>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#00ff88]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-[#00ff88] font-bold text-lg">Pesan Terkirim!</p>
                <p className="text-gray-400 text-sm mt-1">
                  Aku akan balas secepatnya via WhatsApp / Telegram.
                </p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 px-5 py-2 rounded-lg bg-[#1e1e2e] text-sm text-gray-400 hover:text-white font-mono transition-colors"
              >
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-xs text-[#4f8ef7] font-mono mb-1.5 block">
                  const name =
                </label>
                <input
                  type="text"
                  placeholder='"Nama kamu..."'
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  disabled={status === "loading"}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] focus:border-[#4f8ef7]/60 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs text-[#4f8ef7] font-mono mb-1.5 block">
                  const message =
                </label>
                <textarea
                  placeholder='"Ketik pesanmu di sini..."'
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  disabled={status === "loading"}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2e] focus:border-[#4f8ef7]/60 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none transition-colors resize-none disabled:opacity-50"
                />
              </div>

              {/* Error message */}
              {errorMsg && (
                <p className="text-xs text-red-400 font-mono text-center">{errorMsg}</p>
              )}

              {/* Slider verify */}
              <div className="mt-2">
                {(status === "idle" || status === "error") ? (
                  <SliderVerify onVerified={handleVerified} />
                ) : status === "verified" ? (
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-[#00ff88] font-mono font-semibold">Siap dikirim!</span>
                  </div>
                ) : null}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={status !== "verified" || !form.name.trim() || !form.message.trim()}
                className={`w-full py-4 rounded-xl font-bold font-mono text-sm transition-all duration-300 relative overflow-hidden ${
                  status === "loading"
                    ? "bg-[#4f8ef7]/50 text-white cursor-wait"
                    : status === "verified" && form.name.trim() && form.message.trim()
                    ? "bg-[#4f8ef7] text-white glow-blue hover:bg-[#3a7de8] active:scale-95"
                    : "bg-[#1e1e2e] text-gray-600 cursor-not-allowed"
                }`}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-3">
                    <span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                      style={{ animation: "rotate-slow 0.8s linear infinite" }}
                    />
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Pesan →"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
