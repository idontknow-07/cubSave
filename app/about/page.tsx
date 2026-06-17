import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

const VALUES = [
  {
    title: "Security First",
    body: "Every architectural decision starts with security. Cold storage, multi-layer encryption, and continuous threat monitoring are built into the platform from the ground up — not bolted on.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Radical Transparency",
    body: "We publish clear fee schedules, straightforward terms, and honest status updates. No hidden spreads. No surprise charges. What you see is exactly what you get.",
    icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  {
    title: "Accessibility",
    body: "Digital assets should be available to everyone, not just experienced traders. We obsess over onboarding, simplicity, and making advanced features feel approachable.",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    title: "Continuous Improvement",
    body: "The crypto landscape moves fast. We ship new features regularly, respond to user feedback directly, and treat every release as a commitment — not a milestone.",
    icon: "M13 2 3 14h7l-1 8 10-12h-7l1-8z",
  },
];

const MILESTONES = [
  { year: "2024 Q1", event: "SecureChain founded — concept, architecture, and initial infrastructure established." },
  { year: "2024 Q2", event: "Core wallet engine built. Multi-coin support and PIN-secured withdrawals implemented." },
  { year: "2024 Q3", event: "Beta launched to a closed group of testers. Real-time CoinGecko pricing integration shipped." },
  { year: "2024 Q4", event: "Public launch. KYC/ID verification, email notifications, and admin panel released." },
  { year: "2025", event: "FCA crypto asset firm registration in progress. Platform expansion planned for EU and North America." },
];

export default function AboutPage() {
  return (
    <div className="bg-white text-[#0a1f17] font-manrope antialiased">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-[#f4faf6] to-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] mb-5">
            About SecureChain
          </span>
          <h1 className="font-sora text-[42px] md:text-[52px] font-black leading-[1.1] tracking-tight text-[#0a1f17] mb-6">
            Built to give people real control over their crypto.
          </h1>
          <p className="text-[17px] text-[#51635b] leading-relaxed max-w-2xl mx-auto">
            SecureChain is a United Kingdom–based cryptocurrency platform focused on security,
            transparency, and genuine accessibility. We believe managing digital assets should feel
            as natural as online banking — and we&apos;re building toward that standard.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 border-t border-[#e4efe9]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] block mb-4">Our mission</span>
            <h2 className="font-sora text-[32px] md:text-[36px] font-black leading-[1.15] mb-5">
              Making self-custody safe and simple for everyone.
            </h2>
            <p className="text-[15.5px] text-[#51635b] leading-relaxed mb-4">
              Most people avoid crypto because it feels complicated and risky. The platforms that exist
              either overwhelm beginners or underserve experienced traders. SecureChain was created to
              close that gap.
            </p>
            <p className="text-[15.5px] text-[#51635b] leading-relaxed">
              Our platform gives users full ownership of their assets, with the kind of security
              infrastructure you&apos;d expect from an institutional product — wrapped in an interface
              that anyone can understand on day one.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Supported coins", value: "10+" },
              { label: "Avg. deposit time", value: "< 3 min" },
              { label: "Uptime", value: "99.9%" },
              { label: "Support response", value: "< 1 hour" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-[#e4efe9] bg-[#f4faf6] p-6 text-center">
                <p className="font-sora text-[28px] font-black text-[#15a35c]">{value}</p>
                <p className="text-[13px] text-[#7b8c84] mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[#f4faf6] border-t border-[#e4efe9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] block mb-4">What we stand for</span>
            <h2 className="font-sora text-[32px] md:text-[38px] font-black leading-[1.15]">Our core values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(({ title, body, icon }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#e4efe9] p-7 shadow-[0_2px_10px_rgba(10,31,23,0.03)]">
                <div className="w-11 h-11 rounded-[14px] bg-[#eafaf1] flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#15a35c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                    <path d={icon} />
                  </svg>
                </div>
                <h3 className="font-sora font-bold text-[17px] mb-2 text-[#0a1f17]">{title}</h3>
                <p className="text-[14.5px] text-[#51635b] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 border-t border-[#e4efe9]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] block mb-4">The team</span>
          <h2 className="font-sora text-[32px] md:text-[38px] font-black leading-[1.15] mb-6">
            Built by people who care about getting this right.
          </h2>
          <p className="text-[15.5px] text-[#51635b] leading-relaxed mb-4">
            SecureChain is developed and operated by an organisation of professionals with backgrounds
            spanning fintech engineering, cybersecurity, product design, and digital finance.
          </p>
          <p className="text-[15.5px] text-[#51635b] leading-relaxed mb-4">
            In line with our security-first approach, individual team details are kept confidential
            and are not publicly disclosed. This is a deliberate policy to protect staff privacy and
            maintain operational security — a standard practice across the crypto and fintech sector.
          </p>
          <p className="text-[15.5px] text-[#51635b] leading-relaxed">
            Institutional partners, investors, or regulators may request team credentials through our
            official contact channel.
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] bg-[#15a35c] text-white font-bold text-[15px] hover:bg-[#0c8048] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-[#f4faf6] border-t border-[#e4efe9]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] block mb-4">Our journey</span>
            <h2 className="font-sora text-[32px] md:text-[38px] font-black leading-[1.15]">How we got here</h2>
          </div>
          <div className="relative pl-8 border-l-2 border-[#e4efe9] space-y-8">
            {MILESTONES.map(({ year, event }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-[#15a35c] border-4 border-white shadow" />
                <span className="text-[12px] font-bold text-[#15a35c] uppercase tracking-widest block mb-1">{year}</span>
                <p className="text-[15px] text-[#374b42] leading-relaxed">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#0a1f17] text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-sora text-[30px] md:text-[36px] font-black mb-4">Ready to get started?</h2>
          <p className="text-[#9fb3a9] text-[16px] mb-8 leading-relaxed">
            Join a platform built on security, transparency, and respect for your assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center px-7 py-3.5 rounded-[14px] bg-[#15a35c] text-white font-bold text-[15px] hover:bg-[#12b76a] transition-colors">
              Create Free Account
            </Link>
            <Link href="/legal" className="inline-flex items-center justify-center px-7 py-3.5 rounded-[14px] border border-white/20 text-white font-bold text-[15px] hover:bg-white/5 transition-colors">
              View Compliance
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
