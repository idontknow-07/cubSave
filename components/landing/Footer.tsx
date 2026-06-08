import { FOOTER_COLS } from "@/lib/landing-data";
import { Wrap, Logo } from "./ui";

export default function Footer() {
  return (
    <footer className="bg-[#0a1f17] pt-[60px] pb-[34px]">
      <Wrap>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Logo light />
            <p className="text-[#9fb3a9] text-[14px] mt-4 max-w-[300px]">A modern cryptocurrency exchange built for secure, transparent, and seamless trading.</p>
          </div>
          {FOOTER_COLS.map(([h, links]) => (
            <div key={h}>
              <h5 className="font-sora text-[13px] tracking-[0.1em] uppercase text-[#6f867c] mb-[18px]">{h}</h5>
              {links.map(([t, href]) => (
                <a key={t} href={href} className="block text-[#9fb3a9] text-[14.5px] mb-3 hover:text-[#27e89a] transition-colors">{t}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-[26px] flex justify-center items-center">
          <p className="text-[#6f867c] text-[13px]">
            © 2026 VaultChain. All rights reserved.
          </p>
        </div>
      </Wrap>
    </footer>
  );
}
