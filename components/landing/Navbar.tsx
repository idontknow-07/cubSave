"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/landing-data";
import { Wrap, Logo } from "./ui";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> });
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
    }
    setDeferredPrompt(null);
    setInstalling(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/85 backdrop-blur-[14px] border-b border-[#e4efe9]">
      <Wrap className="flex items-center justify-between h-[72px]">
        <Logo />
        <nav className="hidden lg:flex items-center gap-[34px]">
          {NAV_ITEMS.map(([t, h]) => (
            <a key={t} href={h} className="text-[14.5px] font-medium text-[#51635b] hover:text-[#0a1f17] transition-colors">{t}</a>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {canInstall && (
            <button
              onClick={install}
              disabled={installing}
              className="inline-flex items-center gap-2 font-sora font-semibold text-[13.5px] px-4 py-[9px] rounded-[9px] border border-[#e4efe9] bg-white text-[#0a1f17] hover:border-[#15a35c] hover:text-[#15a35c] transition-all disabled:opacity-60"
            >
              {installing ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#15a35c]/30 border-t-[#15a35c] animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path d="M12 15V3M8 11l4 4 4-4M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
                </svg>
              )}
              Install App
            </button>
          )}
          <Link href="/login" className="font-sora font-semibold text-[14.5px] text-[#0a1f17] hover:text-[#15a35c] transition-colors">Sign In</Link>
          <Link href="/signup" className="inline-flex items-center justify-center font-sora font-semibold text-[14.5px] px-[22px] py-[11px] rounded-[10px] bg-[#15a35c] text-white shadow-[0_10px_26px_rgba(21,163,92,0.28)] hover:bg-[#0c8048] hover:-translate-y-0.5 transition-all">Get Started</Link>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="lg:hidden text-[#0a1f17]" aria-label="menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </Wrap>

      {open && (
        <div className="lg:hidden flex flex-col gap-4 bg-white px-6 py-5 border-b border-[#e4efe9]">
          {NAV_ITEMS.map(([t, h]) => (
            <a key={t} href={h} onClick={() => setOpen(false)} className="text-[15px] font-medium text-[#51635b]">{t}</a>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="font-sora font-semibold text-[#15a35c]">Sign In</Link>
          {canInstall && (
            <button onClick={install} className="text-left font-sora font-semibold text-[14px] text-[#15a35c] flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 15V3M8 11l4 4 4-4M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
              </svg>
              Install App
            </button>
          )}
        </div>
      )}
    </header>
  );
}
