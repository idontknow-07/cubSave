"use client";

"use client";

import Link from "next/link";
import { COINS } from "@/lib/landing-data";
import { Wrap, Reveal, Eyebrow, Btn, CoinIco } from "./ui";

const POINTS = [
  "Secure, seamless spot & advanced trading",
  "Low, transparent fees — no hidden spreads",
  "24/7 support from a real human team",
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(900px 480px at 80% 0%, rgba(21,163,92,.10), transparent 60%), radial-gradient(700px 420px at 0% 100%, rgba(4,120,87,.07), transparent 60%)" }}
      />
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: "linear-gradient(#e4efe9 1px,transparent 1px),linear-gradient(90deg,#e4efe9 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage: "radial-gradient(1000px 600px at 70% 20%,#000,transparent 75%)",
          maskImage: "radial-gradient(1000px 600px at 70% 20%,#000,transparent 75%)",
        }}
      />
      <Wrap 
        className="relative z-[2] grid lg:grid-cols-2 gap-14 items-center pb-[90px]"
        style={{ paddingTop: "calc(104px + env(safe-area-inset-top, 0px))" }}
      >
        <Reveal>
          <Eyebrow>Crypto Exchange &amp; Trading</Eyebrow>
          <h1 className="font-sora font-bold leading-[1.08] tracking-[-0.02em] text-[clamp(40px,5.4vw,68px)] text-[#0a1f17] mt-[22px]">
            Trade crypto with <span className="text-[#15a35c]">clarity</span> and confidence.
          </h1>
          <p className="text-[#51635b] text-[18px] mt-6 max-w-[520px]">
            SecureChain is a modern exchange built for serious traders and first-timers alike — fast execution, transparent fees, and the tools you need to navigate every market.
          </p>
          <ul className="mt-[30px] flex flex-col gap-3.5">
            {POINTS.map((t) => (
              <li key={t} className="flex items-center gap-3 font-medium text-[15.5px] text-[#0a1f17]">
                <span className="w-6 h-6 rounded-[7px] shrink-0 bg-[#eafaf1] border border-[#cdeedd] grid place-items-center text-[#15a35c]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[13px] h-[13px]"><path d="M20 6 9 17l-5-5" /></svg>
                </span>{t}
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-9">
            <Link href="/signup" className="flex-1 inline-flex items-center justify-center gap-2 font-['Sora'] font-semibold text-[13px] sm:text-[15px] px-3 sm:px-[26px] py-3.5 rounded-[10px] bg-[#15a35c] text-white shadow-[0_10px_26px_rgba(21,163,92,0.28)] hover:bg-[#0c8048] hover:-translate-y-0.5 transition-all whitespace-nowrap">
              Create Account
            </Link>
            <Btn href="#markets" className="flex-1 justify-center text-[13px] sm:text-[15px] px-3 sm:px-[26px] whitespace-nowrap">View Markets</Btn>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative rounded-[20px] p-6 bg-white border border-[#e4efe9] shadow-[0_24px_60px_rgba(10,31,23,0.08)]">
            <div className="flex items-center justify-between mb-[18px]">
              <span className="font-sora font-semibold text-[14px] text-[#51635b]">Live Markets</span>
              <span className="flex items-center gap-[7px] text-[12px] text-[#15a35c] font-semibold">
                <span className="w-[7px] h-[7px] rounded-full bg-[#15a35c] animate-pulse" /> Real-time
              </span>
            </div>
            {COINS.map((c, i) => (
              <div key={c.name} className={`flex items-center justify-between py-[13px] ${i < COINS.length - 1 ? "border-b border-[#eef5f1]" : ""}`}>
                <div className="flex items-center gap-3">
                  <CoinIco sym={c.sym} grad={c.grad} />
                  <div><div className="font-sora font-semibold text-[14.5px] text-[#0a1f17]">{c.name}</div><div className="text-[12px] text-[#7b8c84]">{c.tic}</div></div>
                </div>
                <svg className="w-[62px] h-[26px]" viewBox="0 0 62 26"><polyline fill="none" stroke={c.up ? "#15a35c" : "#e5484d"} strokeWidth="2" points={c.pts} /></svg>
                <div className="text-right">
                  <div className="font-sora font-semibold text-[14.5px] text-[#0a1f17]">$—</div>
                  <div className={`text-[12px] font-semibold ${c.up ? "text-[#15a35c]" : "text-[#e5484d]"}`}>{c.chg}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}
