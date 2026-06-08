"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Shield, TrendingUp, Zap } from "lucide-react";

const FEATURES = [
  { icon: TrendingUp, text: "Live market prices across 15+ coins" },
  { icon: Shield, text: "Secure PIN-protected withdrawals" },
  { icon: Zap, text: "Instant deposit & withdrawal requests" },
];

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser(data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 bg-white text-[#0a1f17]" style={{ fontFamily: "var(--font-manrope, Manrope), sans-serif" }}>

      {/* ── Brand panel (desktop) ── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white"
        style={{ background: "linear-gradient(150deg,#0c8048,#076c45 55%,#053a2b)" }}>
        <div className="absolute -top-28 -right-24 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(39,232,154,.22), transparent 70%)" }} />

        <div className="relative z-10 flex items-center gap-[11px]">
          <span className="w-[34px] h-[34px] rounded-[9px] grid place-items-center shadow-[0_4px_14px_rgba(21,163,92,0.35)]"
            style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" />
              <circle cx="12" cy="11" r="1.9" />
              <path d="M12 12.9V15.4" />
            </svg>
          </span>
          <span style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 19 }}>
            Vault<span style={{ color: "#7deba3" }}>Chain</span>
          </span>
        </div>

        <div className="relative z-10 max-w-[420px]">
          <h2 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: "clamp(26px,2.8vw,33px)", lineHeight: 1.14, letterSpacing: "-0.02em" }}>
            Trade crypto with clarity and confidence.
          </h2>
          <p className="text-white/75 text-[15px] mt-4 leading-relaxed">
            A modern exchange built for security, transparency, and speed — whether it&apos;s your first trade or your thousandth.
          </p>
          <ul className="mt-9 flex flex-col gap-4">
            {FEATURES.map(f => (
              <li key={f.text} className="flex items-center gap-3 text-[15px] text-white/90">
                <span className="w-6 h-6 rounded-full shrink-0 bg-white/15 grid place-items-center">
                  <f.icon size={13} />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-white/60 text-[12.5px]">© 2026 VaultChain. All rights reserved.</div>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 h-[72px] border-b border-[#e4efe9] lg:border-none">
          <div className="lg:hidden flex items-center gap-[11px]">
            <span className="w-[34px] h-[34px] rounded-[9px] grid place-items-center"
              style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" />
                <circle cx="12" cy="11" r="1.9" />
                <path d="M12 12.9V15.4" />
              </svg>
            </span>
            <span style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 18, color: "#0a1f17" }}>
              Vault<span style={{ color: "#15a35c" }}>Chain</span>
            </span>
          </div>
          <Link href="/" className="ml-auto text-[14px] font-medium text-[#51635b] hover:text-[#15a35c] transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to site
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center px-6 sm:px-10 pt-12 pb-10 lg:items-center lg:pt-0">
          <div className="w-full max-w-[420px] fade-up">
            <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 30, letterSpacing: "-0.02em", color: "#0a1f17" }}>
              Welcome back
            </h1>
            <p className="text-[#51635b] text-[15px] mt-2">Sign in to your VaultChain account to keep trading.</p>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
              <label className="block">
                <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">Email address</span>
                <input
                  type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
                />
              </label>

              <label className="block">
                <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">Password</span>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} required placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full h-[46px] pl-3.5 pr-11 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8c84] hover:text-[#15a35c] transition-colors">
                    {showPass ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></svg>
                    )}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13.5px] text-[#51635b] cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#cdd9d2] accent-[#15a35c]" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-[13.5px] font-medium text-[#15a35c] hover:underline">Forgot password?</Link>
              </div>

              {error && (
                <div className="rounded-[10px] bg-red-50 border border-red-100 px-3.5 py-3 text-[13px] font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full h-[48px] rounded-[10px] text-white text-[15px] flex items-center justify-center gap-2 mt-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 600, background: "#15a35c", boxShadow: "0 10px 26px rgba(21,163,92,0.28)" }}
                onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.background = "#0c8048")}
                onMouseLeave={e => !loading && ((e.currentTarget as HTMLElement).style.background = "#15a35c")}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight size={16} /></span>
                )}
              </button>
            </form>

            <p className="text-center text-[14.5px] text-[#51635b] mt-7">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#15a35c] hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
