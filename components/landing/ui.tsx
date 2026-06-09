"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";

/**
 * Shared design tokens (green + white theme).
 */
export const C = {
  green: "#15a35c",
  greenDark: "#0c8048",
  greenBright: "#12b76a",
  greenDeep: "#047857",
  ink: "#0a1f17",
  body: "#51635b",
  muted: "#7b8c84",
  border: "#e4efe9",
  soft: "#f4faf6",
  tint: "#eafaf1",
} as const;

/* Scroll-reveal hook + wrapper */
export function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.unobserve(el); } },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, shown] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </div>
  );
}

interface CountStatProps {
  target: number;
  suffix?: string;
  label: string;
}

export function CountStat({ target, suffix = "", label }: CountStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      let cur = 0;
      const step = Math.max(1, Math.round(target / 45));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        setVal(cur);
      }, 22);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="text-center px-6 py-9">
      <div className="font-sora font-extrabold text-[clamp(28px,3.4vw,40px)] text-[#15a35c] tracking-tight">{val}{suffix}</div>
      <div className="text-[#7b8c84] text-[13.5px] mt-1.5 font-medium">{label}</div>
    </div>
  );
}

export const Wrap = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`}>{children}</div>
);

export const Eyebrow = ({ children, center }: { children: ReactNode; center?: boolean }) => (
  <span className={`font-sora text-[12px] font-semibold tracking-[0.18em] uppercase text-[#15a35c] inline-flex items-center gap-2 ${center ? "justify-center" : ""}`}>
    <span className="w-[18px] h-px bg-[#15a35c]" />{children}
  </span>
);

interface BtnProps {
  primary?: boolean;
  children: ReactNode;
  href?: string;
  to?: string;
  className?: string;
}

export const Btn = ({ primary, children, href = "#", to, className = "" }: BtnProps) => {
  const cls = `inline-flex items-center justify-center gap-2 font-sora font-semibold text-[15px] px-[26px] py-3.5 rounded-[10px] cursor-pointer transition-all duration-200 ${primary
      ? "bg-[#15a35c] text-white shadow-[0_10px_26px_rgba(21,163,92,0.28)] hover:bg-[#0c8048] hover:-translate-y-0.5"
      : "bg-white text-[#0a1f17] border border-[#e4efe9] hover:border-[#15a35c] hover:text-[#15a35c]"
    } ${className}`;
  return to ? (
    <Link href={to} className={cls}>{children}</Link>
  ) : (
    <a href={href} className={cls}>{children}</a>
  );
};

const LANDING_COIN_CDN: Record<string, string> = {
  "₿": "btc", "Ξ": "eth", "◎": "sol", "B": "bnb", "$": "usdc",
};

interface CoinIcoProps {
  sym: string;
  grad: string;
  size?: number;
  ticker?: string;
}

export function CoinIco({ sym, grad, size = 34, ticker }: CoinIcoProps) {
  const [failed, setFailed] = useState(false);
  const slug = ticker?.toLowerCase() || LANDING_COIN_CDN[sym] || null;
  const url = slug
    ? `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa/svg/color/${slug}.svg`
    : null;
  return (
    <span
      className="rounded-full grid place-items-center shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: grad, flexShrink: 0 }}
    >
      {url && !failed ? (
        <img src={url} alt={sym} width={size * 0.68} height={size * 0.68} onError={() => setFailed(true)} style={{ display: "block" }} />
      ) : (
        <span className="font-sora font-bold text-white" style={{ fontSize: size * 0.36 }}>{sym}</span>
      )}
    </span>
  );
}

export const Logo = ({ light }: { light?: boolean }) => (
  <a href="#top" className={`flex items-center gap-[11px] font-sora font-bold text-[19px] tracking-tight ${light ? "text-white" : "text-[#0a1f17]"}`}>
    <span className="w-[34px] h-[34px] rounded-[9px] grid place-items-center shadow-[0_4px_14px_rgba(21,163,92,0.35)]" style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
      {/* SecureChain mark — blockchain block with a keyhole (Option 3).
          Swap the inner paths for an alternate logo:
          Option 1 (secure shield + link): <path d="M12 2.6 5 5.3V10.6C5 14.8 7.9 17.5 12 19.5 16.1 17.5 19 14.8 19 10.6V5.3Z" /><path d="M10.6 13.4a2.4 2.4 0 0 1 0-3.4l1.4-1.4a2.4 2.4 0 0 1 3.4 3.4l-.7.7" /><path d="M13.4 10.6a2.4 2.4 0 0 1 0 3.4l-1.4 1.4a2.4 2.4 0 0 1-3.4-3.4l.7-.7" />
          Option 2 (chain links): <path d="M9.5 14.5a3.5 3.5 0 0 1 0-5l1.8-1.8a3.5 3.5 0 0 1 5 5l-1 1" /><path d="M14.5 9.5a3.5 3.5 0 0 1 0 5l-1.8 1.8a3.5 3.5 0 0 1-5-5l1-1" /> */}
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[19px] h-[19px]">
        <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" />
        <circle cx="12" cy="11" r="1.9" />
        <path d="M12 12.9V15.4" />
      </svg>
    </span>
    <span>Secure<span className="text-[#15a35c]">Chain</span></span>
  </a>
);

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
  max?: string;
}

export const SectionHeading = ({ eyebrow, title, intro, center, max = "660px" }: SectionHeadingProps) => (
  <Reveal className={`${center ? "mx-auto text-center" : ""} mb-[54px]`}>
    <div style={{ maxWidth: max }} className={center ? "mx-auto" : ""}>
      <Eyebrow center={center}>{eyebrow}</Eyebrow>
      <h2 className="font-sora font-bold leading-[1.1] tracking-[-0.02em] text-[clamp(30px,3.8vw,46px)] text-[#0a1f17] mt-4">{title}</h2>
      {intro && <p className="text-[#51635b] text-[17px] mt-[18px]">{intro}</p>}
    </div>
  </Reveal>
);