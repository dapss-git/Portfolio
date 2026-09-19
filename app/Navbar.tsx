"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
  { href: "#payment", label: "Payment" },
];

export default function Navbar({ activeSection }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#1e1e2e]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("#home")}
            className="font-mono text-sm font-bold tracking-wider"
          >
            <span className="text-[#4f8ef7]">&lt;</span>
            <span className="text-white">Dafa</span>
            <span className="text-[#7c5cbf]">Dev</span>
            <span className="text-[#4f8ef7]">/&gt;</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-mono ${
                    isActive
                      ? "text-[#4f8ef7] bg-[#4f8ef7]/10 text-glow-blue"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <span className="text-[#4f8ef7] mr-1 text-xs">&gt;</span>
                  )}
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Burger button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,142,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.5) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`text-2xl font-bold font-mono tracking-wider transition-all duration-200 ${
                  isActive ? "text-[#4f8ef7] text-glow-blue" : "text-gray-300 hover:text-white"
                }`}
                style={{
                  animationDelay: `${i * 80}ms`,
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.3s ${i * 80}ms, transform 0.3s ${i * 80}ms`,
                }}
              >
                <span className="text-[#4f8ef7] text-sm mr-2">0{i + 1}.</span>
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
