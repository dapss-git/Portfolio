"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PlayIcon, PauseIcon, MusicIcon, XIcon } from "./Icons";
import { useSiteConfig } from "./ConfigContext";

const AVATAR_URL = "/hero-banner.jpg";

// ─── CSS Animation (injected once into <style>) ──────────────────────────────
const SPIN_STYLE = `
  @keyframes cd-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes cd-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,240,255,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(0,240,255,0); }
  }
  .cd-spinning {
    animation: cd-spin 4s linear infinite;
  }
  .cd-paused {
    animation-play-state: paused;
  }
  .playing-pulse {
    animation: cd-pulse 1.5s ease-in-out infinite;
  }
`;

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer() {
  const { config } = useSiteConfig();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync audio time to state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      // autoplay blocked, ignore
    }
  }, [isPlaying]);

  // Click on progress bar to seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!mounted || dismissed || !config.musicEnabled) return null;

  return (
    <>
      {/* Inject spin keyframes once */}
      <style>{SPIN_STYLE}</style>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={config.musicUrl} preload="metadata" loop={false} />

      {/* ─── Minimized pill ──────────────────────────────────────────── */}
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className={`fixed bottom-6 right-6 z-[998] w-14 h-14 rounded-full border-3 border-black shadow-[4px_4px_0px_#000] overflow-hidden transition-all hover:scale-110 active:scale-95 ${
            isPlaying ? "playing-pulse" : ""
          }`}
          title="Buka pemutar musik"
        >
          {/* CD disc effect */}
          <div
            className={`w-full h-full relative ${isPlaying ? "cd-spinning" : ""}`}
          >
            {/* Album art */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_URL}
              alt="Now Playing"
              className="w-full h-full object-cover object-top"
            />
            {/* CD center hole */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-black opacity-80" />
            </div>
            {/* Radial CD grooves */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "repeating-conic-gradient(rgba(255,255,255,0.04) 0deg 1deg, transparent 1deg 4deg)",
              }}
            />
          </div>

          {/* Playing indicator dot */}
          {isPlaying && (
            <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#00ff66] rounded-full border border-black animate-pulse" />
          )}
        </button>
      ) : (
        /* ─── Full Player Card ───────────────────────────────────────── */
        <div className="fixed bottom-6 right-6 z-[998] w-72 bg-[var(--card-bg)] border-3 border-black shadow-[6px_6px_0px_#000] font-mono text-[var(--text-main)]">
          {/* Header bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b-2 border-black bg-[#00f0ff]">
            <div className="flex items-center gap-1.5">
              <MusicIcon className="w-3.5 h-3.5 text-black" />
              <span className="text-[11px] font-black uppercase tracking-wider text-black">
                Now Playing
              </span>
            </div>
            <div className="flex items-center gap-1">
              {/* Minimize */}
              <button
                onClick={() => setMinimized(true)}
                className="w-6 h-6 flex items-center justify-center border-2 border-black bg-[#FFE135] hover:bg-yellow-300 active:opacity-70 transition-all text-black font-black text-xs shadow-[1px_1px_0px_#000]"
                title="Kecilkan"
              >
                _
              </button>
              {/* Close */}
              <button
                onClick={() => {
                  audioRef.current?.pause();
                  setDismissed(true);
                }}
                className="w-6 h-6 flex items-center justify-center border-2 border-black bg-[#ff5555] hover:bg-red-400 active:opacity-70 transition-all text-white shadow-[1px_1px_0px_#000]"
                title="Tutup"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 flex gap-4 items-center">
            {/* CD Disc */}
            <div
              className={`relative w-16 h-16 flex-shrink-0 rounded-full border-3 border-black shadow-[3px_3px_0px_#000] overflow-hidden ${
                isPlaying ? "cd-spinning" : ""
              }`}
            >
              {/* Album art */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR_URL}
                alt="Album art"
                className="w-full h-full object-cover object-top"
              />
              {/* CD groove rings */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "repeating-conic-gradient(rgba(255,255,255,0.05) 0deg 1deg, transparent 1deg 4deg)",
                }}
              />
              {/* Center hole */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-black opacity-90" />
              </div>
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase truncate text-[var(--text-main)] leading-tight">
                {config.musicTitle}
              </p>
              <p className="text-[10px] text-[var(--text-main)] opacity-60 truncate mt-0.5">
                {config.musicArtist}
              </p>
              {/* Time */}
              <p className="text-[10px] text-[var(--text-main)] opacity-50 mt-1 font-bold">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="h-3 bg-[var(--bg-main)] border-2 border-black cursor-pointer overflow-hidden"
            >
              <div
                className="h-full bg-[#00f0ff] border-r-2 border-black transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Play/Pause Button */}
          <div className="px-4 pb-4 flex justify-center">
            <button
              onClick={togglePlay}
              className={`flex items-center justify-center gap-2 w-full py-2.5 border-2 border-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
                isPlaying
                  ? "bg-[#FFE135] text-black"
                  : "bg-[#00ff66] text-black"
              }`}
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
