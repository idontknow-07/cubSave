"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, KeyRound } from "lucide-react";

type Step = "email" | "code" | "done";

function GreenBtn({ children, type = "button", disabled = false, onClick }: {
  children: React.ReactNode; type?: "button" | "submit"; disabled?: boolean; onClick?: () => void;
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className="w-full h-[48px] rounded-[10px] text-white text-[15px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5"
      style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 600, background: "#15a35c", boxShadow: "0 10px 26px rgba(21,163,92,0.28)" }}>
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      Please wait…
    </span>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return <div className="rounded-[10px] bg-red-50 border border-red-100 px-3.5 py-3 text-[13px] font-semibold text-red-600 mb-4">{msg}</div>;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>("email");
  const [email, setEmail]     = useState("");
  const [code, setCode]       = useState("");
  const [newPw, setNewPw]     = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStep("code");
    } finally { setLoading(false); }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("done");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen ios-safe-top bg-[#f4faf6] flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "var(--font-manrope, Manrope), sans-serif" }}>
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center gap-[11px] mb-10">
          <span className="w-[34px] h-[34px] rounded-[9px] grid place-items-center"
            style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" /><circle cx="12" cy="11" r="1.9" /><path d="M12 12.9V15.4" />
            </svg>
          </span>
          <span style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 18, color: "#0a1f17" }}>
            Secure<span style={{ color: "#15a35c" }}>Chain</span>
          </span>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e4efe9] p-8 shadow-[0_8px_32px_rgba(10,31,23,0.06)]">

          {/* Step 1 — Enter email */}
          {step === "email" && (
            <>
              <div className="w-12 h-12 rounded-[14px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center mb-5">
                <Mail size={22} color="#15a35c" />
              </div>
              <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", color: "#0a1f17", marginBottom: 8 }}>
                Forgot your password?
              </h1>
              <p className="text-[#51635b] text-[14px] mb-7 leading-relaxed">
                Enter the email address linked to your account and we&apos;ll send you a reset code.
              </p>
              <form onSubmit={submitEmail}>
                <label className="block mb-5">
                  <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">Email address</span>
                  <input
                    type="email" required placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
                  />
                </label>
                {error && <ErrorBox msg={error} />}
                <GreenBtn type="submit" disabled={loading}>
                  {loading ? <Spinner /> : <span className="flex items-center gap-2">Send Reset Code <ArrowRight size={16} /></span>}
                </GreenBtn>
              </form>
            </>
          )}

          {/* Step 2 — Enter code + new password */}
          {step === "code" && (
            <>
              <div className="w-12 h-12 rounded-[14px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center mb-5">
                <KeyRound size={22} color="#15a35c" />
              </div>
              <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", color: "#0a1f17", marginBottom: 8 }}>
                Reset your password
              </h1>
              <p className="text-[#51635b] text-[14px] mb-7 leading-relaxed">
                Check <strong className="text-[#0a1f17]">{email}</strong> for your 6-digit reset code.
              </p>
              <form onSubmit={submitReset}>
                <label className="block mb-4">
                  <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">Reset Code</span>
                  <input
                    type="text" inputMode="numeric" maxLength={6} required
                    placeholder="6-digit code" value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10 tracking-[0.3em]"
                  />
                </label>
                <label className="block mb-5">
                  <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">New Password</span>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"} required minLength={8}
                      placeholder="At least 8 characters" value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      className="w-full h-[46px] pl-3.5 pr-11 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8c84] hover:text-[#15a35c] transition-colors">
                      {showPw
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></svg>
                      }
                    </button>
                  </div>
                </label>
                {error && <ErrorBox msg={error} />}
                <GreenBtn type="submit" disabled={loading || code.length < 6}>
                  {loading ? <Spinner /> : <span className="flex items-center gap-2">Reset Password <ArrowRight size={16} /></span>}
                </GreenBtn>
              </form>
            </>
          )}

          {/* Step 3 — Done */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#eafaf1] border border-[#cdeedd] grid place-items-center mx-auto mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#15a35c" strokeWidth="2.5" className="w-8 h-8"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 24, color: "#0a1f17", marginBottom: 8 }}>
                Password reset!
              </h2>
              <p className="text-[#51635b] text-[14px] mb-7">Your password has been updated. You can now sign in.</p>
              <GreenBtn onClick={() => router.push("/login")}>
                <span className="flex items-center gap-2">Go to Sign In <ArrowRight size={16} /></span>
              </GreenBtn>
            </div>
          )}
        </div>

        <p className="text-center text-[14px] text-[#51635b] mt-6">
          Remember it?{" "}
          <Link href="/login" className="font-semibold text-[#15a35c] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
