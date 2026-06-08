"use client";

import { type ReactNode } from "react";
import { Wrap, Reveal, Eyebrow } from "./ui";
import { type Row } from "@/lib/landing-data";

interface SplitSectionProps {
  id: string;
  reverse?: boolean;
  soft?: boolean;
  eyebrow: string;
  title: string;
  intro: string;
  rows: Row[];
  cta?: ReactNode;
  glyph: ReactNode;
}

export default function SplitSection({ id, reverse, soft, eyebrow, title, intro, rows, cta, glyph }: SplitSectionProps) {
  return (
    <section id={id} className={`py-24 ${soft ? "bg-[#f4faf6] border-y border-[#e4efe9]" : "bg-white"}`}>
      <Wrap className="grid lg:grid-cols-2 gap-14 items-center">
        <Reveal className={reverse ? "lg:order-2" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-sora font-bold leading-[1.1] tracking-[-0.02em] text-[clamp(26px,3vw,38px)] text-[#0a1f17] mt-4">{title}</h2>
          <p className="text-[#51635b] text-[16.5px] mt-4">{intro}</p>
          <div className="mt-[26px] flex flex-col gap-4">
            {rows.map((r) => (
              <div key={r.h} className="flex gap-3.5 items-start">
                <span className="w-[38px] h-[38px] shrink-0 rounded-[10px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center text-[#15a35c]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d={r.p} /></svg>
                </span>
                <div>
                  <h4 className="font-sora text-[15.5px] font-semibold text-[#0a1f17] mb-0.5">{r.h}</h4>
                  <p className="text-[#51635b] text-[14px]">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
          {cta && <div className="mt-[30px]">{cta}</div>}
        </Reveal>

        <Reveal delay={100} className={reverse ? "lg:order-1" : ""}>
          <div className="relative rounded-[20px] min-h-[340px] bg-white border border-[#e4efe9] shadow-[0_24px_60px_rgba(10,31,23,0.06)] overflow-hidden grid place-items-center">
            <div className="absolute inset-0" style={{ background: "radial-gradient(600px 300px at 70% 20%, rgba(21,163,92,.12), transparent 60%)" }} />
            <div className="absolute inset-0 z-[1] flex items-center justify-center text-[#15a35c]">{glyph}</div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  );
}
