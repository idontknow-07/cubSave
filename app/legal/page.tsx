import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

const FRAMEWORKS = [
  {
    badge: "UK FCA",
    badgeColor: "#15a35c",
    title: "Financial Conduct Authority — Crypto Asset Registration",
    status: "Registration in Progress",
    statusColor: "#f59e0b",
    body: `SecureChain is actively pursuing registration with the Financial Conduct Authority (FCA) as a crypto asset business under the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017.

Our application covers the provision of crypto asset exchange and custodian wallet services in compliance with the FCA's defined activity categories. During the registration period, SecureChain operates under the framework set out in Schedule 7 of the Regulations and maintains full AML/CFT controls consistent with FCA expectations.

Enquiries related to our regulatory status may be directed to compliance@securechain.app.`,
  },
  {
    badge: "HMRC",
    badgeColor: "#627EEA",
    title: "HMRC Anti-Money Laundering Registration",
    status: "Registered",
    statusColor: "#15a35c",
    body: `SecureChain is registered with His Majesty's Revenue and Customs (HMRC) as a Money Service Business (MSB) for Anti-Money Laundering purposes under the Money Laundering Regulations.

All transactions on the platform are subject to ongoing monitoring in line with HMRC's AML compliance requirements, including suspicious activity reporting obligations to the National Crime Agency (NCA).`,
  },
  {
    badge: "UK GDPR",
    badgeColor: "#9945FF",
    title: "Data Protection & UK GDPR",
    status: "Compliant",
    statusColor: "#15a35c",
    body: `SecureChain processes personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

Users have the right to access, correct, or request deletion of their personal data at any time. Data is processed solely for the purposes of account management, regulatory compliance, security monitoring, and service improvement. We do not sell or share personal data with third parties for marketing purposes.

Our full Privacy Policy is available below.`,
  },
  {
    badge: "AML / KYC",
    badgeColor: "#F7931A",
    title: "Anti-Money Laundering & Know Your Customer",
    status: "Active Policy",
    statusColor: "#15a35c",
    body: `SecureChain applies a risk-based AML/KYC framework across all user accounts. Key elements include:

• Identity Verification (KYC): All users are required to complete identity verification before accessing full deposit and withdrawal functionality. We collect government-issued ID and proof of address.

• Transaction Monitoring: All deposits, withdrawals, and transfers are subject to automated and manual monitoring for suspicious patterns.

• Sanctions Screening: User identities and transaction counterparties are screened against UK, EU, and UN sanctions lists.

• Suspicious Activity Reporting (SAR): We are legally obligated to report suspicious activity to the NCA and cooperate fully with law enforcement requests.`,
  },
];

const POLICIES = [
  {
    title: "Terms of Service",
    points: [
      "SecureChain provides cryptocurrency custody and exchange services to verified users aged 18 and over.",
      "Users are responsible for maintaining the security of their account credentials and withdrawal PIN.",
      "SecureChain reserves the right to freeze or terminate accounts that violate our AML/KYC policies or applicable law.",
      "We apply a network fee to all outbound transfers. Fee details are displayed at the time of withdrawal.",
      "Minimum withdrawal amounts apply and are denominated in USD-equivalent value. Thresholds are displayed within the platform.",
      "SecureChain is not liable for losses resulting from user error, network congestion, or incorrect destination addresses.",
      "These terms are governed by the laws of England and Wales.",
    ],
  },
  {
    title: "Privacy Policy — Summary",
    points: [
      "We collect your name, email address, government-issued ID, and transaction data for the purposes of account management and regulatory compliance.",
      "Your data is stored securely using industry-standard encryption and is never sold to third parties.",
      "Transaction records are retained for a minimum of 5 years in line with UK AML regulations.",
      "You may request a copy of your personal data or submit a deletion request by contacting privacy@securechain.app.",
      "We use cookies solely for session management and security purposes. No third-party advertising cookies are used.",
      "Our servers are hosted within the United Kingdom and European Economic Area.",
    ],
  },
];

export default function LegalPage() {
  return (
    <div className="bg-white text-[#0a1f17] font-manrope antialiased">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 bg-gradient-to-b from-[#f4faf6] to-white border-b border-[#e4efe9]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] mb-5">
            Legal & Compliance
          </span>
          <h1 className="font-sora text-[40px] md:text-[50px] font-black leading-[1.1] tracking-tight mb-5">
            Operating to the highest regulatory standard.
          </h1>
          <p className="text-[16.5px] text-[#51635b] leading-relaxed max-w-2xl mx-auto">
            SecureChain is committed to full regulatory compliance within the United Kingdom.
            This page outlines our current registrations, active applications, and the legal
            frameworks that govern how we operate.
          </p>
        </div>
      </section>

      {/* Regulatory Frameworks */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] block mb-4">Regulatory standing</span>
            <h2 className="font-sora text-[30px] md:text-[36px] font-black leading-[1.15]">Compliance frameworks</h2>
          </div>
          <div className="space-y-6">
            {FRAMEWORKS.map(({ badge, badgeColor, title, status, statusColor, body }) => (
              <div key={title} className="rounded-2xl border border-[#e4efe9] bg-white p-8 shadow-[0_2px_10px_rgba(10,31,23,0.03)]">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[11px] font-black tracking-[0.14em] uppercase px-2.5 py-1 rounded-md text-white" style={{ background: badgeColor }}>
                    {badge}
                  </span>
                  <span className="text-[12px] font-bold px-3 py-1 rounded-full border" style={{ color: statusColor, borderColor: statusColor + "40", background: statusColor + "10" }}>
                    {status}
                  </span>
                </div>
                <h3 className="font-sora font-bold text-[18px] text-[#0a1f17] mb-4">{title}</h3>
                <div className="text-[14.5px] text-[#51635b] leading-relaxed whitespace-pre-line">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-20 px-6 bg-[#f4faf6] border-t border-[#e4efe9]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#15a35c] block mb-4">User agreements</span>
            <h2 className="font-sora text-[30px] md:text-[36px] font-black leading-[1.15]">Terms & Privacy</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {POLICIES.map(({ title, points }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#e4efe9] p-7 shadow-[0_2px_10px_rgba(10,31,23,0.03)]">
                <h3 className="font-sora font-bold text-[18px] text-[#0a1f17] mb-5">{title}</h3>
                <ul className="space-y-3">
                  {points.map((p, i) => (
                    <li key={i} className="flex gap-3 text-[14px] text-[#51635b] leading-relaxed">
                      <span className="text-[#15a35c] font-bold mt-0.5 shrink-0">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 border-t border-[#e4efe9]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-sora text-[26px] font-black mb-4">Regulatory & compliance enquiries</h2>
          <p className="text-[15px] text-[#51635b] leading-relaxed mb-6">
            For regulatory enquiries, legal requests, or compliance-related matters, contact our team directly.
            We aim to respond to all formal correspondence within 2 business days.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:compliance@securechain.app" className="inline-flex items-center justify-center px-6 py-3 rounded-[12px] bg-[#f4faf6] border border-[#e4efe9] text-[#0a1f17] font-semibold text-[14px] hover:bg-[#eafaf1] transition-colors">
              compliance@securechain.app
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-[12px] bg-[#15a35c] text-white font-bold text-[14px] hover:bg-[#0c8048] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
