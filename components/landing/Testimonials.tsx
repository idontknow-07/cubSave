"use client";

import { TESTIMONIALS } from "@/lib/landing-data";
import { Wrap, Reveal, SectionHeading } from "./ui";

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-white">
      <Wrap>
        <SectionHeading
          eyebrow="What traders say"
          title="Trusted by a growing community."
          intro="Real experiences from people who manage their crypto on SecureChain every day."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.n} delay={i * 80}>
              <div className="h-full rounded-[16px] p-7 bg-white border border-[#e4efe9] shadow-[0_2px_10px_rgba(10,31,23,0.03)]">
                <div className="text-[#15a35c] text-[13px] tracking-[2px] mb-3.5">★★★★★</div>
                <p className="text-[#374b42] text-[15px] leading-relaxed">{t.q}</p>
                <div className="flex items-center gap-3.5 mt-[22px]">
                  <span className="w-[42px] h-[42px] rounded-full grid place-items-center font-sora font-bold text-white text-[15px]" style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>{t.av}</span>
                  <div>
                    <div className="font-sora font-semibold text-[14.5px] text-[#0a1f17]">{t.n}</div>
                    <div className="text-[12.5px] text-[#7b8c84]">Verified user</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
