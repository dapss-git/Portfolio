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

  const isToday = now.getMonth() === 7 && now.getDate() === 28;

  // Jika sudah lewat 28 Agustus tahun ini dan bukan hari ini, hitung untuk tahun depan
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

// ─── Single Split-Flap Calendar Card (Neobrutalism) ───────────────────────────
function FlipUnit({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, "0");
  const [currentVal, setCurrentVal] = useState(formatted);
  const [prevVal, setPrevVal] = useState(formatted);
  const [flipping, setFlipping] = useState(false);
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    if (formatted !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(formatted);
      setFlipping(true);
      setFlipKey((k) => k + 1);

      const timer = setTimeout(() => {
        setFlipping(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [formatted, currentVal]);

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div
        className="relative w-[56px] h-[66px] sm:w-[68px] sm:h-[76px] rounded-xl select-none"
        style={{ perspective: "600px" }}
      >
        {/* 1. Static Upper Half (Behind flap — shows NEW value top half) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden rounded-t-xl bg-white border-t-2 border-x-2 border-black">
          <div className="w-full h-[66px] sm:h-[76px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-black tracking-wider">
            {currentVal}
          </div>
        </div>

        {/* 2. Static Lower Half (Shows OLD value while flipping, then NEW value) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden rounded-b-xl bg-[#f4f4f5] border-b-2 border-x-2 border-black shadow-[3px_3px_0px_#000]">
          <div className="w-full h-[66px] sm:h-[76px] -mt-[33px] sm:-mt-[38px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-black tracking-wider">
            {flipping ? prevVal : currentVal}
          </div>
        </div>

        {/* 3. The Flipping Flap (Swings down 180deg from top to bottom) */}
        {flipping && (
          <div
            key={flipKey}
            className="absolute top-0 left-0 right-0 h-1/2 animate-flip-card z-10"
            style={{
              transformOrigin: "bottom",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front Face: shows OLD value top half, rotates away */}
            <div
              className="absolute inset-0 overflow-hidden rounded-t-xl bg-white border-t-2 border-x-2 border-black"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="w-full h-[66px] sm:h-[76px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-black tracking-wider">
                {prevVal}
              </div>
              {/* Darkening Shadow Overlay */}
              <div className="absolute inset-0 bg-black/40 animate-flip-shadow-in pointer-events-none" />
            </div>

            {/* Back Face: shows NEW value bottom half, swings down and lands on bottom */}
            <div
              className="absolute inset-0 overflow-hidden rounded-b-xl bg-[#f4f4f5] border-b-2 border-x-2 border-black"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <div className="w-full h-[66px] sm:h-[76px] -mt-[33px] sm:-mt-[38px] flex items-center justify-center font-mono text-2xl sm:text-3xl font-black text-black tracking-wider">
                {currentVal}
              </div>
              {/* Lightening Shadow Overlay */}
              <div className="absolute inset-0 bg-black/40 animate-flip-shadow-out pointer-events-none" />
            </div>
          </div>
        )}

        {/* Center Split Seam */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black z-20" />

        {/* Side mechanical calendar notches */}
        <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-2.5 rounded-r-full bg-black z-30" />
        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-1.5 h-2.5 rounded-l-full bg-black z-30" />
      </div>

      {/* Label */}
      <span className="text-[10px] sm:text-xs font-mono font-black tracking-wider text-black dark:text-zinc-300 mt-2 uppercase">
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
    <div className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#1c1c24] border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[5px_5px_0px_#000] text-black dark:text-white transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#FFE600] border-2 border-black text-black">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black font-mono tracking-wide">
            Ulang Tahun Dafa
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md border-2 border-black bg-[#00F0FF] text-black text-[10px] font-mono font-bold shadow-[1px_1px_0px_#000]">
          {timeLeft.isToday ? "HARI INI!" : "28 Agustus"}
        </span>
      </div>

      {/* Flip Clock Grid */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <FlipUnit value={timeLeft.days} label="Hari" />
        <span className="text-black dark:text-white font-black text-xl font-mono -mt-6">
          :
        </span>
        <FlipUnit value={timeLeft.hours} label="Jam" />
        <span className="text-black dark:text-white font-black text-xl font-mono -mt-6">
          :
        </span>
        <FlipUnit value={timeLeft.minutes} label="Menit" />
        <span className="text-black dark:text-white font-black text-xl font-mono -mt-6">
          :
        </span>
        <FlipUnit value={timeLeft.seconds} label="Detik" />
      </div>

      {/* Footer Subtext */}
      <p className="text-center text-[11px] text-gray-600 dark:text-gray-400 font-mono font-medium mt-3">
        {timeLeft.isToday
          ? "Selamat Ulang Tahun Muhammad Dafa Pratama!"
          : "Menuju 28 Agustus (WIB) · Muhammad Dafa Pratama"}
      </p>
    </div>
  );
}
