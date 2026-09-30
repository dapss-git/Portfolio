"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PlayIcon, PauseIcon, MusicIcon, XIcon } from "./Icons";
import { useSiteConfig, Song } from "./ConfigContext";

// ─── CSS Animation (injected once into <style>) ──────────────────────────────
const SPIN_STYLE = `
  @keyframes cd-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes cd-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,240,255,0.6); }
    50%       { box-shadow: 0 0 0 10px rgba(0,240,255,0); }
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
  const { config, updateConfig } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false); // Default is CD-only view!
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const playlist: Song[] = config.playlist && config.playlist.length > 0
    ? config.playlist
    : [
        {
          id: "1",
          title: "audio2",
          artist: "Muhammad Dafa Pratama",
          url: "https://raw.githubusercontent.com/dapss-git/uploader/main/upload/audio/audio2.mp3",
          thumbnail: config.cdCustomThumbnail || "/hero-banner.jpg",
        },
      ];

  const activeIndex =
    typeof config.activeSongIndex === "number" && config.activeSongIndex < playlist.length
      ? config.activeSongIndex
      : 0;

  const currentSong = playlist[activeIndex] || playlist[0];
  const cdThumbnail = currentSong?.thumbnail || config.cdCustomThumbnail || "/hero-banner.jpg";

  // Sync audio time to state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      // Auto-play next song in playlist
      if (playlist.length > 1) {
        const nextIndex = (activeIndex + 1) % playlist.length;
        updateConfig({ activeSongIndex: nextIndex });
        setTimeout(() => {
          audioRef.current?.play().catch(() => {});
        }, 150);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0;
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [activeIndex, playlist, updateConfig]);

  const togglePlay = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
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
        // autoplay blocked
      }
    },
    [isPlaying]
  );

  const selectSong = (index: number) => {
    updateConfig({ activeSongIndex: index });
    setCurrentTime(0);
    setTimeout(() => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 150);
  };

  const playPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (activeIndex - 1 + playlist.length) % playlist.length;
    selectSong(prevIndex);
  };

  const playNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (activeIndex + 1) % playlist.length;
    selectSong(nextIndex);
  };

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

  if (!mounted || !config.musicEnabled) return null;

  return (
    <>
      <style>{SPIN_STYLE}</style>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong?.url}
        preload="metadata"
        loop={playlist.length === 1}
      />

      {/* ─── DEFAULT VIEW: FLOATING CD DISC ──────────────────────────── */}
      {!isOpen ? (
        <div className="fixed bottom-6 right-6 z-[998] group flex flex-col items-end">
          {/* Tooltip */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-2 px-2.5 py-1 bg-black text-white text-[10px] font-mono font-black border border-black shadow-[2px_2px_0px_#000] whitespace-nowrap">
            {isPlaying ? `▶ Sedang diputar: ${currentSong?.title}` : "Klik CD untuk buka playlist 🎵"}
          </div>

          <div className="relative">
            {/* Clickable CD Disc */}
            <button
              onClick={() => setIsOpen(true)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-black shadow-[5px_5px_0px_#000] overflow-hidden transition-transform hover:scale-105 active:scale-95 bg-black ${
                isPlaying ? "playing-pulse" : ""
              }`}
              title="Buka daftar lagu"
            >
              <div
                className={`w-full h-full relative ${isPlaying ? "cd-spinning" : ""}`}
              >
                {/* CD Vinyl Grooves Background */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, #222 0%, #111 60%, #050505 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full opacity-40 pointer-events-none"
                  style={{
                    background:
                      "repeating-radial-gradient(circle, rgba(255,255,255,0.08) 0px, transparent 2px, transparent 4px)",
                  }}
                />

                {/* Center Thumbnail Art */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-black overflow-hidden shadow-inner bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cdThumbnail}
                      alt="CD Art"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Center spindle hole */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white border border-black" />
                </div>
              </div>
            </button>

            {/* Quick Play/Pause Badge Button */}
            <button
              onClick={(e) => togglePlay(e)}
              className={`absolute -top-1 -left-1 w-7 h-7 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] hover:scale-110 active:scale-90 transition-all ${
                isPlaying ? "bg-[#FFE135] text-black" : "bg-[#00ff66] text-black"
              }`}
              title={isPlaying ? "Jeda" : "Putar"}
            >
              {isPlaying ? (
                <PauseIcon className="w-3.5 h-3.5" />
              ) : (
                <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ─── EXPANDED VIEW: PLAYLIST BOX ─────────────────────────────── */
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[998] w-80 sm:w-88 max-w-[calc(100vw-2rem)] bg-[var(--card-bg)] border-3 sm:border-4 border-black shadow-[8px_8px_0px_#000] font-mono text-[var(--text-main)] animate-fade-up">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b-2 border-black bg-[#00f0ff]">
            <div className="flex items-center gap-1.5 min-w-0">
              <MusicIcon className="w-4 h-4 text-black flex-shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wider text-black truncate">
                Music Playlist ({playlist.length})
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 flex items-center justify-center border-2 border-black bg-[#ff5555] hover:bg-red-400 active:opacity-70 transition-all text-white shadow-[1px_1px_0px_#000] flex-shrink-0 ml-2"
              title="Kecilkan ke CD"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Currently Playing Card */}
          <div className="p-3.5 bg-[var(--bg-main)] border-b-2 border-black flex items-center gap-3">
            {/* Spinning mini CD */}
            <div
              onClick={(e) => togglePlay(e)}
              className={`relative w-12 h-12 flex-shrink-0 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] overflow-hidden cursor-pointer ${
                isPlaying ? "cd-spinning" : ""
              }`}
              title="Klik untuk Play/Pause"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cdThumbnail}
                alt="Track art"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-white border border-black" />
              </div>
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase truncate text-[var(--text-main)]">
                {currentSong?.title || "Tidak ada lagu"}
              </p>
              <p className="text-[10px] text-[var(--text-main)] opacity-70 truncate mt-0.5">
                {currentSong?.artist || "Artis"}
              </p>
              <p className="text-[9px] text-[var(--text-main)] opacity-60 font-bold mt-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-3 pt-2.5 pb-1">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="h-2.5 bg-black/10 dark:bg-white/10 border-2 border-black cursor-pointer overflow-hidden"
            >
              <div
                className="h-full bg-[#00f0ff] border-r border-black"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls Bar: Prev - Play/Pause - Next */}
          <div className="px-3 py-2 flex items-center justify-center gap-2">
            <button
              onClick={playPrev}
              className="px-3 py-1.5 bg-[var(--card-bg)] text-[var(--text-main)] border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              title="Lagu Sebelumnya"
            >
              ⏮
            </button>
            <button
              onClick={(e) => togglePlay(e)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
                isPlaying ? "bg-[#FFE135] text-black" : "bg-[#00ff66] text-black"
              }`}
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-3.5 h-3.5" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-3.5 h-3.5" />
                  <span>Putar</span>
                </>
              )}
            </button>
            <button
              onClick={playNext}
              className="px-3 py-1.5 bg-[var(--card-bg)] text-[var(--text-main)] border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              title="Lagu Selanjutnya"
            >
              ⏭
            </button>
          </div>

          {/* Playlist List Header */}
          <div className="px-3 py-1.5 bg-black/5 dark:bg-white/5 border-t-2 border-b-2 border-black flex items-center justify-between text-[10px] font-black uppercase">
            <span>Daftar Lagu ({playlist.length})</span>
            <span className="opacity-60 text-[9px]">Pilih untuk putar</span>
          </div>

          {/* Playlist Scrollable Items */}
          <div className="max-h-48 overflow-y-auto divide-y divide-black/20">
            {playlist.map((song, i) => {
              const isSelected = i === activeIndex;
              return (
                <button
                  key={song.id || i}
                  onClick={() => selectSong(i)}
                  className={`w-full px-3 py-2 flex items-center gap-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-[#FFE135] text-black font-black"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)]"
                  }`}
                >
                  <span className="text-[10px] font-black w-4 flex-shrink-0">
                    {isSelected && isPlaying ? "▶" : `${i + 1}.`}
                  </span>

                  {/* Tiny thumbnail */}
                  <div className="w-7 h-7 rounded-full border border-black overflow-hidden flex-shrink-0 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.thumbnail || config.cdCustomThumbnail || "/hero-banner.jpg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate leading-tight">{song.title}</p>
                    <p className="text-[9px] opacity-70 truncate">{song.artist}</p>
                  </div>

                  {isSelected && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-black text-[#00ff66] font-bold border border-black flex-shrink-0">
                      Aktif
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
