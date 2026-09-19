"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return 100;
        }
        // Simulate realistic loading speed
        const increment = Math.random() * 12 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(79,142,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scan line effect */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4f8ef7] to-transparent opacity-60"
        style={{ animation: "scan-line 3s linear infinite" }}
      />

      {/* Logo / Name */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Rotating ring */}
        <div className="relative w-28 h-28">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-rotate-slow"
            style={{
              borderTopColor: "#4f8ef7",
              borderRightColor: "#7c5cbf",
            }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: "#00d4ff",
              borderLeftColor: "#4f8ef7",
              animation: "rotate-slow 5s linear infinite reverse",
            }}
          />
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#4f8ef7] animate-pulse-glow" />
          </div>
        </div>

        {/* Name */}
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] text-[#4f8ef7] uppercase mb-2 font-mono">
            Initializing
          </p>
          <h1 className="text-2xl font-bold text-white">
            M. <span className="text-[#4f8ef7] text-glow-blue">Dafa</span> Pratama
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
            <span>Loading portfolio...</span>
            <span className="text-[#4f8ef7]">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-[#1e1e2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f8ef7, #7c5cbf, #00d4ff)",
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7]"
                style={{
                  animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
