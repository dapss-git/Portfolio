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
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerified = () => setStatus("verified");

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) return;
    if (status !== "verified") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Gagal mengirim pesan");
      }

      setStatus("success");
      setForm({ name: "", contact: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim pesan. Coba lagi.";
      setErrorMsg(msg);
      setTimeout(() => setStatus("verified"), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 bg-[#FFE135] text-black border-2 border-black shadow-[2px_2px_0px_#000] font-mono text-xs font-black uppercase mb-3">
            04. Contact
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-main)] mb-3">
            Hubungi <span className="bg-[#00f0ff] px-2 py-0.5 text-black border-2 border-black shadow-[3px_3px_0px_#000]">Aku</span>
          </h2>
          <p className="text-sm font-mono opacity-80 text-[var(--text-main)]">
            Ada pertanyaan atau ingin kolaborasi? Kirim pesan langsung ke bot Telegram ku!
          </p>
        </div>

        {/* Social quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "WhatsApp",
              icon: <WhatsAppIcon className="w-5 h-5 text-black" />,
              href: "https://wa.me/62895393325895",
              bg: "#00ff66",
            },
            {
              label: "Telegram",
              icon: <TelegramIcon className="w-5 h-5 text-black" />,
              href: "https://t.me/dafaaaaa11111",
              bg: "#00f0ff",
            },
            {
              label: "Instagram",
              icon: <InstagramIcon className="w-5 h-5 text-black" />,
              href: "https://instagram.com/dafaaaaa11111",
              bg: "#ff70a6",
            },
            {
              label: "TikTok",
              icon: <TikTokIcon className="w-5 h-5 text-black" />,
              href: "https://tiktok.com/@dafaaaaa11111",
              bg: "#ffbe0b",
            },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-3.5 px-2 border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all group"
              style={{ background: s.bg }}
            >
              <div className="w-8 h-8 rounded-none border border-black bg-white flex items-center justify-center">
                {s.icon}
              </div>
              <span className="text-xs font-black font-mono uppercase text-black tracking-wide">
                {s.label}
              </span>
            </a>
          ))}
        </div>

        {/* Contact form card */}
        <div className="bg-[var(--card-bg)] border-2 sm:border-3 border-black shadow-[5px_5px_0px_#000] p-6 md:p-8">
          {/* Status bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black bg-[#ff5555] inline-block" />
              <span className="w-3.5 h-3.5 border-2 border-black bg-[#FFE135] inline-block" />
              <span className="w-3.5 h-3.5 border-2 border-black bg-[#00ff66] inline-block" />
            </div>
            <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--text-main)]">
              FORM_PESAN.SYS
            </span>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center bg-[#00ff66]/10 border-2 border-black p-6 shadow-[3px_3px_0px_#000]">
              <div className="w-14 h-14 bg-[#00ff66] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <svg
                  className="w-8 h-8 text-black stroke-[3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-black font-mono uppercase text-[var(--text-main)]">
                  Pesan Berhasil Terkirim!
                </p>
                <p className="text-xs font-mono text-[var(--text-main)] mt-2">
                  Notifikasi sudah langsung masuk ke Telegram ku. Aku akan respon ke kontak yang kamu berikan.
                </p>
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 px-5 py-2.5 bg-[#FFE135] text-black border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-mono font-black uppercase text-[var(--text-main)] mb-1.5 block">
                  Nama Lengkap / Panggilan:
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama kamu..."
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  disabled={status === "loading"}
                  className="w-full bg-[var(--bg-main)] border-2 border-black px-4 py-3 text-sm font-mono font-medium text-[var(--text-main)] placeholder-gray-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-white dark:focus:bg-[#121218] transition-all disabled:opacity-50"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="text-xs font-mono font-black uppercase text-[var(--text-main)] mb-1.5 block">
                  Kontak Balasan (No. WA / Username Telegram):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 08123456789 atau @username"
                  value={form.contact}
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                  disabled={status === "loading"}
                  className="w-full bg-[var(--bg-main)] border-2 border-black px-4 py-3 text-sm font-mono font-medium text-[var(--text-main)] placeholder-gray-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-white dark:focus:bg-[#121218] transition-all disabled:opacity-50"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-mono font-black uppercase text-[var(--text-main)] mb-1.5 block">
                  Pesan:
                </label>
                <textarea
                  placeholder="Tulis pesan atau keperluan kamu..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  disabled={status === "loading"}
                  className="w-full bg-[var(--bg-main)] border-2 border-black px-4 py-3 text-sm font-mono font-medium text-[var(--text-main)] placeholder-gray-500 shadow-[2px_2px_0px_#000] focus:outline-none focus:bg-white dark:focus:bg-[#121218] transition-all resize-none disabled:opacity-50"
                />
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="p-3 bg-[#ff5555] text-white border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000]">
                  Error: {errorMsg}
                </div>
              )}

              {/* Slider verify */}
              <div className="mt-2">
                {status === "idle" || status === "error" ? (
                  <SliderVerify onVerified={handleVerified} />
                ) : status === "verified" ? (
                  <div className="flex items-center justify-center gap-2 p-3 bg-[#00ff66] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                    <svg className="w-5 h-5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-mono font-black uppercase tracking-wider">
                      Terverifikasi — Siap Dikirim!
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={
                  status !== "verified" ||
                  !form.name.trim() ||
                  !form.contact.trim() ||
                  !form.message.trim()
                }
                className={`w-full py-4 font-black font-mono uppercase tracking-wider text-sm border-2 border-black transition-all ${
                  status === "loading"
                    ? "bg-[#FFE135] text-black opacity-80 cursor-wait shadow-[2px_2px_0px_#000]"
                    : status === "verified" &&
                      form.name.trim() &&
                      form.contact.trim() &&
                      form.message.trim()
                    ? "bg-[#00f0ff] text-black shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    : "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-[2px_2px_0px_#000]"
                }`}
              >
                {status === "loading" ? "Mengirim Pesan..." : "Kirim Pesan Sekarang →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
