"use client";

import { useState, useRef, useCallback } from "react";

interface SliderVerifyProps {
  onVerified: () => void;
}

export default function SliderVerify({ onVerified }: SliderVerifyProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verified, setVerified] = useState(false);
  const [failed, setFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);

  const handleStart = useCallback(
    (clientX: number) => {
      if (verified) return;
      setIsDragging(true);
      setFailed(false);
      startXRef.current = clientX - (progress / 100) * (trackRef.current?.offsetWidth ?? 0);
    },
    [verified, progress]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || verified) return;
      const track = trackRef.current;
      if (!track) return;
      const trackWidth = track.offsetWidth;
      const thumbWidth = 56; // w-14
      const maxX = trackWidth - thumbWidth;
      const rawX = clientX - startXRef.current;
      const clampedX = Math.max(0, Math.min(rawX, maxX));
      const pct = (clampedX / maxX) * 100;
      setProgress(pct);
    },
    [isDragging, verified]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging || verified) return;
    setIsDragging(false);
    if (progress >= 95) {
      setVerified(true);
      setProgress(100);
      setTimeout(() => onVerified(), 500);
    } else {
      setFailed(true);
      setProgress(0);
      setTimeout(() => setFailed(false), 800);
    }
  }, [isDragging, verified, progress, onVerified]);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  const thumbLeft = `calc(${progress}% * (100% - 56px) / 100)`;

  return (
    <div className="select-none">
      <p className="text-xs text-gray-500 mb-2 font-mono text-center">
        {verified
          ? "✅ Terverifikasi!"
          : failed
          ? "❌ Ulangi — geser sampai penuh"
          : "Geser ke kanan untuk kirim pesan →"}
      </p>

      <div
        ref={trackRef}
        className={`relative h-14 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-colors duration-300 ${
          verified
            ? "bg-[#00ff88]/20 border border-[#00ff88]/40"
            : failed
            ? "bg-red-500/20 border border-red-500/40"
            : "bg-[#1e1e2e] border border-[#4f8ef7]/20"
        }`}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Fill gradient */}
        <div
          className="absolute inset-y-0 left-0 transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: verified
              ? "linear-gradient(90deg, rgba(0,255,136,0.3), rgba(0,255,136,0.1))"
              : failed
              ? "linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1))"
              : "linear-gradient(90deg, rgba(79,142,247,0.3), rgba(124,92,191,0.1))",
          }}
        />

        {/* Track text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-xs font-mono font-medium transition-opacity duration-300 ${
              progress > 40 ? "opacity-0" : "opacity-60"
            } ${verified ? "text-[#00ff88]" : "text-gray-500"}`}
          >
            {verified ? "✓ Verified" : "— — — — — — — — — →"}
          </span>
        </div>

        {/* Shimmer on track */}
        {!verified && !failed && (
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        )}

        {/* Thumb */}
        <div
          className={`absolute top-1 bottom-1 w-12 rounded-lg flex items-center justify-center transition-all duration-75 ${
            verified
              ? "bg-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.6)]"
              : failed
              ? "bg-red-500"
              : isDragging
              ? "bg-[#4f8ef7] shadow-[0_0_20px_rgba(79,142,247,0.6)] scale-95"
              : "bg-[#4f8ef7] glow-blue hover:shadow-[0_0_24px_rgba(79,142,247,0.6)]"
          }`}
          style={{ left: thumbLeft }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {verified ? (
            <svg className="w-5 h-5 text-[#0a0a0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
