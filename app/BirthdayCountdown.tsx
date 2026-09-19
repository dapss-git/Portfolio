"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "./Icons";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
}

function calculateTimeUntilBirthday(): TimeRemaining {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Target: 28 Agustus jam 00:00:00 (Bulan Agustus = index 7)
  let target = new Date(currentYear, 7, 28, 0, 0, 0);

  const isToday =
    now.getMonth() === 7 && now.getDate() === 28;

  // Jika tanggal 28 Agustus tahun ini sudah lewat dan bukan hari ini, hitung untuk tahun depan
  if (now.getTime() > target.getTime() && !isToday) {
    target = new Date(currentYear + 1, 7, 28, 0, 0, 0);
  }

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isToday };
}

// ─── Single Split-Flap Calendar Card ──────────────────────────────────────────
function FlipUnit({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, "0");
  const [current, setCurrent] = useState(formatted);
  const [previous, setPrevious] = useState(formatted);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (formatted !== current) {
      setPrevious(current);
      setCurrent(formatted);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 560);
      return () => clearTimeout(timer);
    }
  }, [formatted, current]);

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div
        className="relative w-[56px] h-[64px] sm:w-[68px] sm:h-[76px] rounded-xl select-none"
        style={{ perspective: "450px" }}
      >
        {/* 1. Static Background Top (Shows CURRENT new value top half) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden rounded-t-xl bg-[#1a1a2b] border-t border-x border-[#2d2d42]">
          <div className="w-full h-[64px] sm:h-[76px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
            {current}
          </div>
        </div>

        {/* 2. Static Background Bottom (Shows PREVIOUS while flipping, then CURRENT) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden rounded-b-xl bg-[#11111d] border-b border-x border-[#2d2d42]">
          <div className="w-full h-[64px] sm:h-[76px] -mt-[32px] sm:-mt-[38px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
            {isFlipping ? previous : current}
          </div>
        </div>

        {/* 3. Flipping Upper Flap (Folds down over bottom half) */}
        {isFlipping && (
          <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden rounded-t-xl bg-[#1a1a2b] border-t border-x border-[#2d2d42] animate-flip-top z-10 shadow-lg">
            <div className="w-full h-[64px] sm:h-[76px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
              {previous}
            </div>
          </div>
        )}

        {/* 4. Flipping Lower Flap (Slaps into place with new value) */}
        {isFlipping && (
          <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden rounded-b-xl bg-[#11111d] border-b border-x border-[#2d2d42] animate-flip-bottom z-10 shadow-lg">
            <div className="w-full h-[64px] sm:h-[76px] -mt-[32px] sm:-mt-[38px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-white tracking-wider">
              {current}
            </div>
          </div>
        )}

        {/* Center Split Seam */}
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#0a0a0f] z-20 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

        {/* Side mechanical calendar notches */}
        <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-2 rounded-r-full bg-[#0a0a0f] z-30 border-r border-[#2d2d42]" />
        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-1.5 h-2 rounded-l-full bg-[#0a0a0f] z-30 border-l border-[#2d2d42]" />
      </div>

      {/* Label */}
      <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#4f8ef7] mt-2 uppercase">
        {label}
      </span>
    </div>
  );
}

// ─── Main Birthday Countdown Component ────────────────────────────────────────
export default function BirthdayCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeUntilBirthday);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeUntilBirthday());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm bg-[#12121a]/95 backdrop-blur-md border border-[#1e1e2e] hover:border-[#4f8ef7]/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-[0_0_25px_rgba(79,142,247,0.12)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#4f8ef7]/15 border border-[#4f8ef7]/30">
            <CalendarIcon className="w-3.5 h-3.5 text-[#4f8ef7]" />
          </div>
          <span className="text-xs font-bold font-mono text-white tracking-wider">
            ULTAH: 28 AGUSTUS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
          <span className="text-[10px] font-mono text-[#00ff88] font-semibold">
            {timeLeft.isToday ? "HARI INI!" : "REALTIME"}
          </span>
        </div>
      </div>

      {/* Flip Clock Grid */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
        <FlipUnit value={timeLeft.days} label="Hari" />
        <span className="text-[#4f8ef7] font-bold text-lg sm:text-xl font-mono -mt-5">
          :
        </span>
        <FlipUnit value={timeLeft.hours} label="Jam" />
        <span className="text-[#4f8ef7] font-bold text-lg sm:text-xl font-mono -mt-5">
          :
        </span>
        <FlipUnit value={timeLeft.minutes} label="Menit" />
        <span className="text-[#4f8ef7] font-bold text-lg sm:text-xl font-mono -mt-5">
          :
        </span>
        <FlipUnit value={timeLeft.seconds} label="Detik" />
      </div>

      {/* Footer Subtext */}
      <p className="text-center text-[11px] text-gray-500 font-mono mt-3">
        {timeLeft.isToday
          ? "Selamat Ulang Tahun Muhammad Dafa Pratama!"
          : "Hitung mundur menuju hari ulang tahun Muhammad Dafa Pratama"}
      </p>
    </div>
  );
}
