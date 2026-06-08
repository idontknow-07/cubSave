"use client";

import { ASSETS } from "@/lib/landing-data";
import { Wrap, Reveal, Eyebrow, CoinIco } from "./ui";

export default function Markets() {
  return (
    <section id="markets" className="py-24 bg-[#f4faf6] border-y border-[#e4efe9]">
      <Wrap className="grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <Eyebrow>One platform, many markets</Eyebrow>
          <h2 className="font-sora font-bold leading-[1.1] tracking-[-0.02em] text-[clamp(28px,3.4vw,42px)] text-[#0a1f17] mt-4">Trade the assets that matter.</h2>
          <p className="text-[#51635b] text-[16.5px] mt-[18px]">Buy, sell, and swap leading cryptocurrencies across major chains — all from a single, unified account.</p>
          <div className="flex gap-[34px] mt-[34px] flex-wrap">
            {([["100+", "Assets listed"], ["180+", "Trading pairs"], ["40+", "Blockchains"]] as const).map(([n, l]) => (
              <div key={l}><div className="font-sora font-extrabold text-[30px] text-[#15a35c]">{n}</div><div className="text-[#7b8c84] text-[13.5px]">{l}</div></div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-3">
          {ASSETS.map((a) => (
            <div key={a.tk} className="flex items-center justify-between gap-4 bg-white border border-[#e4efe9] hover:border-[#cdeedd] hover:shadow-[0_10px_26px_rgba(10,31,23,0.06)] rounded-[13px] px-5 py-4 transition-all">
              <div className="flex items-center gap-3.5">
                <CoinIco sym={a.sym} grad={a.grad} size={38} />
                <div><div className="font-sora font-semibold text-[15px] text-[#0a1f17]">{a.nm}</div><div className="text-[12.5px] text-[#7b8c84]">{a.tk}</div></div>
              </div>
              <div className="flex gap-2">
                {["Buy", "Sell", "Swap"].map((x) => (
                  <span key={x} className="font-sora text-[12.5px] font-medium text-[#51635b] px-3 py-1.5 rounded-[8px] border border-[#e4efe9] hover:text-[#15a35c] hover:border-[#cdeedd] hover:bg-[#f4faf6] transition-all cursor-pointer">{x}</span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </Wrap>
    </section>
  );
}
