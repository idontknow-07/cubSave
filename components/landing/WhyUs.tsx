"use client";

import { FEATURES } from "@/lib/landing-data";
import { Wrap, Reveal, SectionHeading } from "./ui";

export default function WhyUs() {
  return (
    <section id="why" className="py-24 bg-white">
      <Wrap>
        <SectionHeading
          eyebrow="Why CubSave"
          title="Built for traders who value security and speed."
          intro="Everything we ship is designed around three things: protecting your assets, keeping costs transparent, and getting out of your way so you can trade."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 80}>
              <div className="h-full rounded-[16px] p-[30px_26px] bg-white border border-[#e4efe9] shadow-[0_2px_10px_rgba(10,31,23,0.03)] hover:shadow-[0_18px_40px_rgba(10,31,23,0.08)] hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-[50px] h-[50px] rounded-[13px] mb-[22px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center text-[#15a35c]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d={f.p} /></svg>
                </div>
                <h3 className="font-sora font-bold text-[18px] text-[#0a1f17] mb-2.5">{f.t}</h3>
                <p className="text-[#51635b] text-[14.5px]">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
