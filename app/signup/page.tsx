"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Shield, Lock, CheckCircle2 } from "lucide-react";
import { COUNTRIES } from "@/components/data";

const ID_TYPES = ["National ID", "Passport", "Driver's License", "SSN", "NIN", "Voter's Card", "Government ID"];

type Step = "form" | "email" | "pin" | "identity";

function Field({ label, type = "text", placeholder, value, onChange, autoComplete }: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; autoComplete?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">{label}</span>
      <input
        type={type} placeholder={placeholder} value={value} autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
      />
    </label>
  );
}

function PasswordField({ label, placeholder, value, onChange, autoComplete }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block mb-4">
      <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"} placeholder={placeholder} value={value} autoComplete={autoComplete}
          onChange={e => onChange(e.target.value)}
          className="w-full h-[46px] pl-3.5 pr-11 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8c84] hover:text-[#15a35c] transition-colors">
          {show
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></svg>
          }
        </button>
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder = "Select…" }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">{label}</span>
      <div className="relative">
        <select
          value={value} onChange={e => onChange(e.target.value)}
          className={`w-full h-[46px] pl-3.5 pr-10 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none appearance-none transition-all focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10 ${value ? "text-[#0a1f17]" : "text-[#9db5a8]"}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o} value={o} className="text-[#0a1f17]">{o}</option>)}
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#7b8c84] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><path d="m6 9 6 6 6-6" /></svg>
      </div>
    </label>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="rounded-[10px] bg-red-50 border border-red-100 px-3.5 py-3 text-[13px] font-semibold text-red-600 mb-4">
      {msg}
    </div>
  );
}

function GreenBtn({ children, onClick, type = "button", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
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

function validateIdFormat(idType: string, idNumber: string): string | null {
  const clean = idNumber.replace(/[\s\-]/g, "");
  switch (idType) {
    case "SSN": return /^\d{9}$/.test(clean) ? (/^(000|666|9\d\d)/.test(clean) ? "This SSN format is not valid." : null) : "SSN must be exactly 9 digits.";
    case "NIN": return /^\d{11}$/.test(clean) ? null : "NIN must be exactly 11 digits.";
    case "Passport": return /^[A-Z0-9]{8,9}$/i.test(clean) ? null : "Passport must be 8–9 alphanumeric characters.";
    case "Voter's Card": return clean.length >= 10 ? null : "Voter's Card must be at least 10 characters.";
    case "National ID": return clean.length >= 8 ? null : "National ID must be at least 8 characters.";
    case "Driver's License": return clean.length >= 6 ? null : "Driver's License must be at least 6 characters.";
    default: return clean.length >= 6 ? null : "ID number must be at least 6 characters.";
  }
}

function SignupInner() {
  const { setUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>("form");

  const [form, setForm] = useState({ email: "", username: "", password: "", country: "", phone: "" });
  const [userId, setUserId] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [resent, setResent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Resume flow after clicking the email link: /signup?step=pin&userId=xxx */
  useEffect(() => {
    const stepParam = params.get("step") as Step | null;
    const userIdParam = params.get("userId");
    const errorParam = params.get("error");

    if (errorParam === "link_expired" && userIdParam) {
      setUserId(userIdParam);
      setStep("email");
      setError("Your verification link expired. Hit Resend to get a fresh one.");
    } else if (errorParam) {
      setError("Invalid or expired verification link. Please try signing up again.");
    } else if (stepParam && userIdParam) {
      setUserId(userIdParam);
      setStep(stepParam);
    }
  }, [params]);

  const steps: Step[] = ["form", "email", "pin", "identity"];
  const stepIdx = steps.indexOf(step);
  const stepLabels = ["Account", "Email", "PIN", "Identity"];

  const goBack = () => {
    if (step === "form") router.push("/");
    else if (step === "email") setStep("form");
    else if (step === "pin") setStep("email");
    else if (step === "identity") setStep("pin");
  };

  const resetToForm = () => {
    setStep("form");
    setForm({ email: "", username: "", password: "", country: "", phone: "" });
    setUserId(""); setEmailTo(""); setError(""); setResent(false);
    setCode(["", "", "", "", "", ""]);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) { setError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Enter a valid email address"); return; }
    if (!form.username.trim()) { setError("Username is required"); return; }
    if (form.username.trim().length < 3) { setError("Username must be at least 3 characters"); return; }
    if (!form.password) { setError("Password is required"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (!form.country) { setError("Please select your country"); return; }
    if (!form.phone.trim()) { setError("Phone number is required"); return; }
    if (form.phone.replace(/\D/g, "").length < 7) { setError("Enter a valid phone number"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUserId(data.userId); setEmailTo(data.email); setStep("email");
    } finally { setLoading(false); }
  };

  const handleCodeInput = (i: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...code]; next[i] = char; setCode(next);
    if (char && i < 5) codeRefs.current[i + 1]?.focus();
    if (!char && i > 0) codeRefs.current[i - 1]?.focus();
  };

  const submitCode = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) { setError("Enter the full 6-digit code"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: fullCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("pin");
    } finally { setLoading(false); }
  };

  const resendCode = async () => {
    setError(""); setResent(false); setLoading(true);
    try {
      await fetch("/api/auth/signup", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setCode(["", "", "", "", "", ""]);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } finally { setLoading(false); }
  };

  const submitPin = async () => {
    if (!/^\d{4,6}$/.test(pin)) { setError("PIN must be 4–6 digits (numbers only)"); return; }
    if (pin !== pinConfirm) { setError("PINs don't match — please re-enter"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/set-pin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setStep("identity");
    } finally { setLoading(false); }
  };

  const submitId = async () => {
    const fmtError = validateIdFormat(idType, idNumber);
    if (!idType) { setError("Please select an ID type"); return; }
    if (fmtError) { setError(fmtError); return; }
    setError(""); setVerifying(true);
    await new Promise(r => setTimeout(r, 2800 + Math.random() * 1400));
    setVerifying(false); setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-id", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, idType, idNumber }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser(data.user); router.push("/dashboard");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-2 bg-white text-[#0a1f17]" style={{ fontFamily: "var(--font-manrope, Manrope), sans-serif" }}>

      {/* Form panel */}
      <div className="flex flex-col min-h-[100dvh] lg:min-h-0 bg-white">
        <div className="flex items-center justify-between px-5 sm:px-10 h-[64px] border-b border-[#e4efe9] lg:border-none shrink-0">
          <div className="lg:hidden flex items-center gap-[10px]">
            <span className="w-[32px] h-[32px] rounded-[8px] grid place-items-center"
              style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]">
                <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" /><circle cx="12" cy="11" r="1.9" /><path d="M12 12.9V15.4" />
              </svg>
            </span>
            <span style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 17, color: "#0a1f17" }}>
              Secure<span style={{ color: "#15a35c" }}>Chain</span>
            </span>
          </div>
          <button onClick={goBack} className="ml-auto text-[14px] font-medium text-[#51635b] hover:text-[#15a35c] transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>

        <div className="flex-1 flex items-start justify-center px-5 sm:px-8 py-8 overflow-y-auto">
          <div className="w-full max-w-[420px]">

            {/* Step bar */}
            <div className="flex gap-2 mb-7">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex-1 flex flex-col gap-1.5">
                  <div className="h-1 rounded-full transition-all duration-300"
                    style={{ background: i <= stepIdx ? "#15a35c" : "#e4efe9" }} />
                  <span className="text-[10px] font-bold text-center uppercase tracking-[0.06em]"
                    style={{ color: i <= stepIdx ? "#15a35c" : "#9db5a8" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1 */}
            {step === "form" && (
              <>
                <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: "clamp(24px,6vw,30px)", letterSpacing: "-0.02em", color: "#0a1f17", marginBottom: 6 }}>
                  Set up your account
                </h1>
                <p className="text-[#51635b] text-[14px] mb-7">Welcome — let&apos;s get you started.</p>
                <form onSubmit={submitForm}>
                  <Field label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={v => setForm({ ...form, email: v })} autoComplete="email" />
                  <Field label="Username" placeholder="satoshi" value={form.username} onChange={v => setForm({ ...form, username: v })} autoComplete="username" />
                  <PasswordField label="Password" placeholder="Create a strong password" value={form.password} onChange={v => setForm({ ...form, password: v })} autoComplete="new-password" />
                  <SelectField label="Country" value={form.country} onChange={v => setForm({ ...form, country: v })} options={COUNTRIES} placeholder="Select your country" />
                  <Field label="Phone number" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={v => setForm({ ...form, phone: v })} autoComplete="tel" />
                  {error && <ErrorBox msg={error} />}
                  <GreenBtn type="submit" disabled={loading}>
                    {loading ? <Spinner /> : <span className="flex items-center gap-2">Continue <ArrowRight size={16} /></span>}
                  </GreenBtn>
                </form>
                <p className="text-center text-[14px] text-[#51635b] mt-6">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-[#15a35c] hover:underline">Sign in</Link>
                </p>
              </>
            )}

            {/* STEP 2: OTP code */}
            {step === "email" && (
              <>
                <div className="w-14 h-14 rounded-[16px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center mb-5">
                  <CheckCircle2 size={26} color="#15a35c" />
                </div>
                <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: "clamp(22px,6vw,28px)", letterSpacing: "-0.02em", color: "#0a1f17", marginBottom: 8 }}>
                  Check your email
                </h1>
                <p className="text-[#51635b] text-[14px] mb-6 leading-relaxed">
                  We sent a 6-digit code to{" "}
                  <strong className="text-[#0a1f17]" style={{ pointerEvents: "none" }}>{emailTo}</strong>.
                  Enter it below.
                </p>

                <div className="flex gap-2 mb-7">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { codeRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={e => handleCodeInput(i, e.target.value)}
                      onKeyDown={e => { if (e.key === "Backspace" && !digit && i > 0) codeRefs.current[i - 1]?.focus(); }}
                      onPaste={e => {
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        const next = [...code];
                        pasted.split("").forEach((c, idx) => { if (idx < 6) next[idx] = c; });
                        setCode(next);
                        codeRefs.current[Math.min(pasted.length, 5)]?.focus();
                        e.preventDefault();
                      }}
                      className="flex-1 min-w-0 h-[54px] text-center font-black rounded-[10px] bg-white outline-none transition-all"
                      style={{
                        fontSize: 22,
                        border: `2px solid ${digit ? "#15a35c" : "#e4efe9"}`,
                        color: "#0a1f17",
                        boxShadow: digit ? "0 0 0 3px rgba(21,163,92,0.08)" : "none",
                      }}
                    />
                  ))}
                </div>

                {error && <ErrorBox msg={error} />}
                {resent && (
                  <div className="rounded-[10px] bg-[#eafaf1] border border-[#cdeedd] px-3.5 py-3 text-[13px] font-semibold text-[#15a35c] mb-4">
                    ✓ New code sent — check your inbox
                  </div>
                )}
                <GreenBtn onClick={submitCode} disabled={loading || code.join("").length < 6}>
                  {loading ? <Spinner /> : <span className="flex items-center gap-2">Verify Email <ArrowRight size={16} /></span>}
                </GreenBtn>
                <button onClick={resendCode} disabled={loading}
                  className="w-full mt-3 py-3 text-[14px] font-medium transition-colors disabled:opacity-50">
                  <span className="text-[#9db5a8]">Didn&apos;t get it?</span>{" "}
                  <span className="font-semibold text-[#15a35c]">Resend code</span>
                </button>
              </>
            )}

            {/* STEP 3: PIN */}
            {step === "pin" && (
              <>
                <div className="w-14 h-14 rounded-[16px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center mb-5">
                  <Lock size={26} color="#15a35c" />
                </div>
                <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: "clamp(22px,6vw,28px)", letterSpacing: "-0.02em", color: "#0a1f17", marginBottom: 8 }}>
                  Create your PIN
                </h1>
                <p className="text-[#51635b] text-[14px] mb-7 leading-relaxed">
                  Set a 4–6 digit PIN. You&apos;ll use this to confirm every withdrawal — keep it private.
                </p>
                <label className="block mb-4">
                  <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">Withdrawal PIN</span>
                  <div className="relative">
                    <input
                      type={showPin ? "text" : "password"} inputMode="numeric" maxLength={6}
                      placeholder="4–6 digits" value={pin}
                      onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full h-[46px] px-3.5 pr-11 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10 tracking-[0.3em]"
                    />
                    <button type="button" onClick={() => setShowPin(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8c84] hover:text-[#15a35c] transition-colors">
                      {showPin
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></svg>
                      }
                    </button>
                  </div>
                </label>
                <label className="block mb-6">
                  <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">Confirm PIN</span>
                  <input
                    type="password" inputMode="numeric" maxLength={6}
                    placeholder="Re-enter your PIN" value={pinConfirm}
                    onChange={e => setPinConfirm(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10 tracking-[0.3em]"
                  />
                </label>
                {error && <ErrorBox msg={error} />}
                <GreenBtn onClick={submitPin} disabled={loading || pin.length < 4}>
                  {loading ? <Spinner /> : <span className="flex items-center gap-2">Set PIN <ArrowRight size={16} /></span>}
                </GreenBtn>
              </>
            )}

            {/* STEP 4: Identity */}
            {step === "identity" && (
              <>
                <div className="w-14 h-14 rounded-[16px] bg-[#eafaf1] border border-[#cdeedd] grid place-items-center mb-5">
                  <Shield size={26} color="#15a35c" />
                </div>
                <h1 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: "clamp(22px,6vw,28px)", letterSpacing: "-0.02em", color: "#0a1f17", marginBottom: 8 }}>
                  Verify your identity
                </h1>
                <p className="text-[#51635b] text-[14px] mb-7 leading-relaxed">
                  A government-issued ID is required to secure your wallet. Your information is encrypted and never shared.
                </p>
                <SelectField
                  label="ID Type"
                  value={idType}
                  onChange={setIdType}
                  options={ID_TYPES}
                  placeholder="Select ID type"
                />
                <label className="block mb-2">
                  <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">ID Number</span>
                  <input
                    placeholder="Enter your ID number" value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/10"
                  />
                </label>
                <p className="text-[12px] text-[#7b8c84] mb-6">
                  Encrypted end-to-end. We never store or share your actual ID document.
                </p>
                {error && <ErrorBox msg={error} />}
                {verifying ? (
                  <div className="w-full h-[48px] rounded-[10px] flex items-center justify-center gap-3 bg-[#eafaf1] border border-[#cdeedd]">
                    <span className="w-4 h-4 rounded-full border-2 border-[#15a35c]/30 border-t-[#15a35c] animate-spin" />
                    <span className="text-[14px] font-semibold text-[#15a35c]">Verifying your ID…</span>
                  </div>
                ) : (
                  <GreenBtn onClick={submitId} disabled={loading || !idType || idNumber.length < 4}>
                    {loading ? <Spinner /> : <span className="flex items-center gap-2">Complete Setup <ArrowRight size={16} /></span>}
                  </GreenBtn>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Brand panel (desktop only) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white"
        style={{ background: "linear-gradient(150deg,#0c8048,#076c45 55%,#053a2b)" }}>
        <div className="absolute -top-28 -left-24 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(39,232,154,.22), transparent 70%)" }} />
        <div className="relative z-10 flex items-center gap-[11px]">
          <span className="w-[34px] h-[34px] rounded-[9px] grid place-items-center"
            style={{ background: "linear-gradient(135deg,#15a35c,#047857)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
              <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" /><circle cx="12" cy="11" r="1.9" /><path d="M12 12.9V15.4" />
            </svg>
          </span>
          <span style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: 19 }}>
            Secure<span style={{ color: "#7deba3" }}>Chain</span>
          </span>
        </div>
        <div className="relative z-10 max-w-[420px]">
          <h2 style={{ fontFamily: "var(--font-sora, Sora), sans-serif", fontWeight: 700, fontSize: "clamp(26px,2.8vw,33px)", lineHeight: 1.14, letterSpacing: "-0.02em" }}>
            Trade crypto with clarity and confidence.
          </h2>
          <p className="text-white/75 text-[15px] mt-4 leading-relaxed">
            A modern exchange built for security, transparency, and speed.
          </p>
          <ul className="mt-9 flex flex-col gap-4">
            {["Bank-grade security & cold storage", "Low, transparent fees — no hidden spreads", "100+ assets across major chains"].map(p => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-white/90">
                <span className="w-6 h-6 rounded-full shrink-0 bg-white/15 grid place-items-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[13px] h-[13px]"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 text-white/60 text-[12.5px]">© 2026 SecureChain. All rights reserved.</div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupInner />
    </Suspense>
  );
}
