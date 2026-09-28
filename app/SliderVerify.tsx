"use client";

import { useState, useRef } from "react";
import { useLanguage } from "./LanguageContext";

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

  const THUMB_WIDTH = 48;

  const getMaxDist = () => {
    if (!trackRef.current) return 240;
    return Math.max(0, trackRef.current.clientWidth - THUMB_WIDTH - 6);
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
    const touchXOnTrack = e.clientX - rect.left - 3;
    const maxDist = getMaxDist();

    const targetX = Math.max(0, Math.min(touchXOnTrack - THUMB_WIDTH / 2, maxDist));
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
      }, 350);
    } else {
      setFailed(true);
      dragXRef.current = 0;
      setDragX(0);
      setTimeout(() => setFailed(false), 700);
    }
  };

  const maxDist = getMaxDist();
  const progressPct = maxDist > 0 ? (dragX / maxDist) * 100 : 0;
  const { t } = useLanguage();

  return (
    <div className="select-none touch-none">
      <p className="text-xs font-mono font-bold uppercase tracking-wider mb-2 text-center text-[var(--text-main)]">
        {verified
          ? t.contact.sliderVerified
          : failed
          ? t.contact.sliderFailed
          : t.contact.sliderIdle}
      </p>

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative h-14 border-2 border-black shadow-[3px_3px_0px_#000] p-1 touch-none cursor-pointer transition-colors ${
          verified
            ? "bg-[#00ff66]"
            : failed
            ? "bg-[#ff4444]"
            : "bg-[var(--card-bg)]"
        }`}
      >
        {/* Progress Fill */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: `${dragX + THUMB_WIDTH}px`,
            background: verified
              ? "#00ff66"
              : failed
              ? "#ff6666"
              : "#00f0ff",
            transition: isDragging ? "none" : "width 0.2s ease-out",
          }}
        />

        {/* Track hint label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-xs font-mono font-black tracking-widest uppercase transition-opacity duration-150 ${
              progressPct > 35 ? "opacity-0" : "opacity-75 text-black"
            }`}
          >
            {t.contact.sliderHint}
          </span>
        </div>

        {/* Draggable Thumb */}
        <div
          className={`absolute top-1 bottom-1 w-12 border-2 border-black flex items-center justify-center pointer-events-none touch-none select-none z-10 font-black ${
            verified
              ? "bg-black text-[#00ff66]"
              : failed
              ? "bg-black text-[#ff4444]"
              : isDragging
              ? "bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]"
              : "bg-[#FFE135] text-black shadow-[2px_2px_0px_#000]"
          }`}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {verified ? (
            <svg
              className="w-6 h-6 stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
