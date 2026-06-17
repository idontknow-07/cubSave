import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const CONTACT_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+44 20 3970 7422",
    sub: "Mon – Fri, 9am – 6pm GMT",
    href: "tel:+442039707422",
    cta: "Call us",
    color: "#15a35c",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "support@securechain.app",
    sub: "We reply within 24 hours",
    href: "mailto:support@securechain.app",
    cta: "Send email",
    color: "#627EEA",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "WhatsApp",
    value: "Chat with support",
    sub: "Available 24/7",
    href: "https://wa.me/601165244875",
    cta: "Open WhatsApp",
    color: "#25D366",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white text-[#0a1f17] font-manrope antialiased min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 bg-gradient-to-b from-[#f4faf6] to-white border-b border-[#e4efe9]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] mb-5">
            Get in touch
          </span>
          <h1 className="font-sora text-[38px] md:text-[48px] font-black leading-[1.1] tracking-tight mb-5">
            We&apos;re here to help.
          </h1>
          <p className="text-[16px] text-[#51635b] leading-relaxed">
            Our support team is available around the clock. Reach out by phone, email, or WhatsApp — we aim to respond to every enquiry promptly.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 mb-20">
          {CONTACT_CARDS.map(({ icon, label, value, sub, href, cta, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center text-center p-8 rounded-2xl border border-[#e4efe9] bg-white shadow-[0_2px_10px_rgba(10,31,23,0.03)] hover:border-[#c5dfd0] hover:shadow-[0_4px_20px_rgba(10,31,23,0.07)] transition-all"
            >
              <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mb-5" style={{ background: color + "15", color }}>
                {icon}
              </div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase mb-2" style={{ color }}>{label}</p>
              <p className="font-sora font-bold text-[16px] text-[#0a1f17] mb-1">{value}</p>
              <p className="text-[13px] text-[#7b8c84] mb-5">{sub}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-[10px] transition-colors" style={{ background: color + "15", color }}>
                {cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </a>
          ))}
        </div>

        {/* Office address */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-[#f4faf6] rounded-2xl border border-[#e4efe9] p-8">
            <div className="w-12 h-12 rounded-[16px] bg-[#eafaf1] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#15a35c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3 className="font-sora font-bold text-[18px] text-[#0a1f17] mb-3">Registered Office</h3>
            <address className="not-italic text-[15px] text-[#51635b] leading-relaxed">
              SecureChain Ltd<br />
              71–75 Shelton Street<br />
              Covent Garden<br />
              London, WC2H 9JQ<br />
              United Kingdom
            </address>
            <p className="text-[12.5px] text-[#7b8c84] mt-4">
              This is our registered business address. For all formal and legal correspondence please use the address above.
            </p>
          </div>

          <div className="bg-[#f4faf6] rounded-2xl border border-[#e4efe9] p-8">
            <div className="w-12 h-12 rounded-[16px] bg-[#eafaf1] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#15a35c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="font-sora font-bold text-[18px] text-[#0a1f17] mb-3">Support Hours</h3>
            <div className="space-y-3 text-[15px] text-[#51635b]">
              <div className="flex justify-between">
                <span>Phone & Live Chat</span>
                <span className="font-semibold text-[#0a1f17]">Mon–Fri, 9am–6pm</span>
              </div>
              <div className="flex justify-between">
                <span>Email Support</span>
                <span className="font-semibold text-[#0a1f17]">24 / 7</span>
              </div>
              <div className="flex justify-between">
                <span>WhatsApp</span>
                <span className="font-semibold text-[#0a1f17]">24 / 7</span>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-[#e4efe9]">
              <p className="text-[12.5px] text-[#7b8c84]">
                All times are in GMT (London time). During UK public holidays, email and WhatsApp support remain active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance note */}
      <section className="py-14 px-6 bg-[#f4faf6] border-t border-[#e4efe9]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[14px] text-[#7b8c84] leading-relaxed">
            For regulatory enquiries, contact <a href="mailto:compliance@securechain.app" className="text-[#15a35c] font-semibold hover:underline">compliance@securechain.app</a>. For data protection requests under UK GDPR, contact <a href="mailto:privacy@securechain.app" className="text-[#15a35c] font-semibold hover:underline">privacy@securechain.app</a>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
