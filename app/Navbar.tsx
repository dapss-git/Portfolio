"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "./ThemeContext";
import { LanguageSwitcher, useLanguage } from "./LanguageContext";
import { LinkIcon } from "./Icons";

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#skills", label: t.nav.skills },
    { href: "#contact", label: t.nav.contact },
    { href: "#payment", label: t.nav.support },
  ];

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-[var(--card-bg)] border-b-2 sm:border-b-3 border-black shadow-[0_4px_0px_#000]"
            : "bg-[var(--bg-main)]/90 backdrop-blur-md border-b-2 border-black"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("#home")}
            style={{ backgroundColor: "var(--accent-primary)" }}
            className="font-mono text-sm sm:text-base font-black tracking-wider px-3 py-1.5 text-black border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <span>&lt;Dafa/&gt;</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  style={isActive ? { backgroundColor: "var(--accent-primary)" } : undefined}
                  className={`px-3 py-1.5 rounded-none text-xs font-bold font-mono uppercase tracking-wide border-2 transition-all ${
                    isActive
                      ? "text-black border-black shadow-[2px_2px_0px_#000] -translate-y-0.5"
                      : "bg-transparent text-[var(--text-main)] border-transparent hover:border-black hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Link to Linktree page */}
            <Link
              href="/links"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff66] text-black border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ml-1"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{t.nav.linktree}</span>
            </Link>

            {/* Link to Uploader page */}
            <Link
              href="/uploader"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff] text-black border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>↑ Kirim File</span>
            </Link>

            {/* Language & Theme switchers */}
            <div className="ml-2 pl-2 border-l-2 border-black flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Right side for mobile: Language + Theme switcher + Burger button */}
          <div className="flex md:hidden items-center gap-1.5">
            <LanguageSwitcher />
            <ThemeSwitcher />

            <Link
              href="/links"
              className="px-2.5 py-1.5 bg-[#00ff66] text-black border-2 border-black font-mono font-black text-xs shadow-[2px_2px_0px_#000]"
              title="Linktree"
            >
              <LinkIcon className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="w-10 h-10 flex flex-col items-center justify-center gap-1 bg-[var(--card-bg)] border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span
                className={`block w-5 h-0.5 bg-[var(--text-main)] transition-all duration-200 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[var(--text-main)] transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[var(--text-main)] transition-all duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-200 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "var(--bg-main)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-4 px-6 pt-16">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                style={isActive ? { backgroundColor: "var(--accent-primary)" } : undefined}
                className={`w-full max-w-xs py-3 text-lg font-black font-mono uppercase tracking-wider border-2 border-black transition-all ${
                  isActive
                    ? "text-black shadow-[4px_4px_0px_#000]"
                    : "bg-[var(--card-bg)] text-[var(--text-main)] shadow-[3px_3px_0px_#000]"
                }`}
              >
                <span className="text-[#ff0055] mr-2">0{i + 1}.</span>
                {link.label}
              </button>
            );
          })}

          <Link
            href="/links"
            onClick={() => setMenuOpen(false)}
            className="w-full max-w-xs py-3 text-lg font-black font-mono uppercase tracking-wider border-2 border-black bg-[#00ff66] text-black shadow-[4px_4px_0px_#000] text-center flex items-center justify-center gap-2"
          >
            <LinkIcon className="w-5 h-5" />
            <span>{t.nav.linktree}</span>
          </Link>

          <Link
            href="/uploader"
            onClick={() => setMenuOpen(false)}
            className="w-full max-w-xs py-3 text-lg font-black font-mono uppercase tracking-wider border-2 border-black bg-[#00f0ff] text-black shadow-[4px_4px_0px_#000] text-center flex items-center justify-center gap-2"
          >
            <span>↑ Kirim File / Uploader</span>
          </Link>
        </div>
      </div>
    </>
  );
}
