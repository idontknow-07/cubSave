"use client";

import { Wrap, CountStat } from "./ui";

export default function Stats() {
  return (
    <section className="bg-[#f4faf6] border-y border-[#e4efe9]">
      <Wrap>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#e4efe9]">
          <CountStat target={180} label="Markets & trading pairs" />
          <CountStat target={100} suffix="+" label="Supported assets" />
          <div className="text-center px-6 py-9">
            <div className="font-sora font-extrabold text-[clamp(28px,3.4vw,40px)] text-[#15a35c] tracking-tight">24/7</div>
            <div className="text-[#7b8c84] text-[13.5px] mt-1.5 font-medium">Customer support</div>
          </div>
          <CountStat target={99} suffix="%" label="Assets in cold storage" />
        </div>
      </Wrap>
    </section>
  );
}
