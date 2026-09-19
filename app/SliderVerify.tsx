"use client";

import { useState, useRef } from "react";

interface SliderVerifyProps {
  onVerified: () => void;
}

export default function SliderVerify({ onVerified }: SliderVerifyProps) {
  const [verified, setVerified] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragXRef = useRef(0);
  const verifiedRef = useRef(false);

  const THUMB_WIDTH = 48; // 48px width of thumb

  const getMaxDist = () => {
    if (!trackRef.current) return 240;
    // 8px = 4px padding on each side
    return Math.max(0, trackRef.current.clientWidth - THUMB_WIDTH - 8);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (verifiedRef.current) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    setFailed(false);

    const rect = track.getBoundingClientRect();
    const touchXOnTrack = e.clientX - rect.left - 4; // account for 4px padding
    const maxDist = getMaxDist();

    // If tapped near or ahead of current position, update position immediately
    const targetX = Math.max(0, Math.min(touchXOnTrack - THUMB_WIDTH / 2, maxDist));
    // If touched near current thumb, keep offset smoothly
    if (Math.abs(touchXOnTrack - dragXRef.current) < THUMB_WIDTH) {
      startXRef.current = e.clientX - dragXRef.current;
    } else {
      dragXRef.current = targetX;
      setDragX(targetX);
      startXRef.current = e.clientX - targetX;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || verifiedRef.current) return;
    const maxDist = getMaxDist();
    const rawX = e.clientX - startXRef.current;
    const clampedX = Math.max(0, Math.min(rawX, maxDist));
    dragXRef.current = clampedX;
    setDragX(clampedX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || verifiedRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const maxDist = getMaxDist();
    const isCompleted = maxDist > 0 && dragXRef.current >= maxDist * 0.85;

    if (isCompleted) {
      verifiedRef.current = true;
      setVerified(true);
      dragXRef.current = maxDist;
      setDragX(maxDist);
      setTimeout(() => {
        onVerified();
      }, 400);
    } else {
      setFailed(true);
      dragXRef.current = 0;
      setDragX(0);
      setTimeout(() => setFailed(false), 800);
    }
  };

  const maxDist = getMaxDist();
  const progressPct = maxDist > 0 ? (dragX / maxDist) * 100 : 0;

  return (
    <div className="select-none touch-none">
      <p className="text-xs text-gray-400 mb-2 font-mono text-center">
        {verified
          ? "Terverifikasi!"
          : failed
          ? "Kurang jauh — geser sampai penuh"
          : "Geser ke kanan untuk verifikasi"}
      </p>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative h-14 rounded-2xl overflow-hidden p-1 touch-none cursor-pointer transition-colors duration-300 ${
          verified
            ? "bg-[#00ff88]/15 border border-[#00ff88]/40 cursor-default"
            : failed
            ? "bg-red-500/15 border border-red-500/40"
            : "bg-[#161622] border border-[#2a2a3e] hover:border-[#4f8ef7]/40"
        }`}
      >
        {/* Progress Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-2xl pointer-events-none"
          style={{
            width: `${dragX + THUMB_WIDTH}px`,
            background: verified
              ? "linear-gradient(90deg, rgba(0,255,136,0.3), rgba(0,255,136,0.1))"
              : failed
              ? "linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,0.1))"
              : "linear-gradient(90deg, rgba(79,142,247,0.35), rgba(124,92,191,0.2))",
            transition: isDragging ? "none" : "width 0.25s ease-out",
          }}
        />

        {/* Track hint label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-xs font-mono tracking-widest uppercase transition-opacity duration-200 ${
              progressPct > 35 ? "opacity-0" : "opacity-50 text-gray-400"
            }`}
          >
            Geser ke kanan →
          </span>
        </div>

        {/* Draggable Thumb */}
        <div
          className={`absolute top-1 bottom-1 w-12 rounded-xl flex items-center justify-center pointer-events-none touch-none select-none z-10 transition-shadow duration-200 ${
            verified
              ? "bg-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.6)]"
              : failed
              ? "bg-red-500"
              : isDragging
              ? "bg-[#4f8ef7] shadow-[0_0_20px_rgba(79,142,247,0.8)] scale-95"
              : "bg-[#4f8ef7] shadow-[0_0_15px_rgba(79,142,247,0.4)]"
          }`}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? "none" : "transform 0.25s ease-out",
          }}
        >
          {verified ? (
            <svg
              className="w-5 h-5 text-[#0d0d14]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
