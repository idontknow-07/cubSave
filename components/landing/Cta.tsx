import { Wrap, Reveal, Eyebrow, Btn } from "./ui";

export default function Cta() {
  return (
    <section className="relative text-center py-[84px] bg-white overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(700px 360px at 50% 30%, rgba(21,163,92,.12), transparent 65%)" }} />
      <Reveal className="relative z-[1]">
        <Wrap className="max-w-[620px]">
          <Eyebrow center>Get started today</Eyebrow>
          <h2 className="font-['Sora'] font-bold leading-[1.1] tracking-[-0.02em] text-[clamp(30px,4vw,46px)] text-[#0a1f17] mt-3.5">Start trading on CubSave.</h2>
          <p className="text-[#51635b] text-[17px] mt-[18px] mb-8">Create your account in minutes and join a community trading with clarity and confidence.</p>
          <div className="flex gap-3 justify-center">
            <Btn primary to="/signup" className="flex-1 justify-center text-[13px] sm:text-[15px] px-3 sm:px-[26px] whitespace-nowrap">Create Account</Btn>
            <Btn href="#faq" className="flex-1 justify-center text-[13px] sm:text-[15px] px-3 sm:px-[26px] whitespace-nowrap">Contact Sales</Btn>
          </div>
        </Wrap>
      </Reveal>
    </section>
  );
}