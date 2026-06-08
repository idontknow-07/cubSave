"use client";

import { useState } from "react";
import { FAQS } from "@/lib/landing-data";
import { Wrap, Reveal, SectionHeading } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 bg-[#f4faf6] border-y border-[#e4efe9]">
      <Wrap>
        <SectionHeading center eyebrow="Support" title="Frequently asked questions" />
        <div className="max-w-[840px] mx-auto">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q}>
                <div className="border border-[#e4efe9] rounded-[13px] mb-3 overflow-hidden bg-white">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left font-sora font-semibold text-[16px] text-[#0a1f17] px-6 py-[22px] flex items-center justify-between gap-4"
                  >
                    {f.q}
                    <span className={`w-[22px] h-[22px] shrink-0 text-[#15a35c] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? 240 : 0 }}>
                    <p className="px-6 pb-[22px] text-[#51635b] text-[15px]">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}
