import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./ui";

/* ---------- Brand side panel (desktop only) ---------- */
function BrandPanel({ className = "" }: { className?: string }) {
  const points = [
    "Bank-grade security & cold storage",
    "Low, transparent fees — no hidden spreads",
    "100+ assets across major chains",
  ];
  return (
    <div className={`relative hidden lg:flex flex-col justify-between p-12 overflow-hidden text-white ${className}`} style={{ background: "linear-gradient(150deg,#0c8048,#076c45 55%,#053a2b)" }}>
      {/* one subtle glow for depth */}
      <div className="absolute -top-28 -right-24 w-[380px] h-[380px] rounded-full" style={{ background: "radial-gradient(circle, rgba(39,232,154,.22), transparent 70%)" }} />

      <div className="relative z-10">
        <Logo light />
      </div>

      <div className="relative z-10 max-w-[420px]">
        <h2 className="font-sora font-bold text-[33px] leading-[1.14] tracking-[-0.02em]">Trade crypto with clarity and confidence.</h2>
        <p className="text-white/75 text-[15px] mt-4 leading-relaxed">A modern exchange built for security, transparency, and speed — whether it's your first trade or your thousandth.</p>
        <ul className="mt-9 flex flex-col gap-4">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-[15px] text-white/90">
              <span className="w-6 h-6 rounded-full shrink-0 bg-white/15 grid place-items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[13px] h-[13px]"><path d="M20 6 9 17l-5-5" /></svg>
              </span>{p}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 text-white/60 text-[12.5px]">© 2026 VaultChain. All rights reserved.</div>
    </div>
  );
}

/* ---------- Layout shell ---------- */
interface AuthLayoutProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  brandSide?: "left" | "right";
}

export default function AuthLayout({ title, subtitle, children, footer, brandSide = "left" }: AuthLayoutProps) {
  const right = brandSide === "right";
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-manrope text-[#0a1f17]">
      <BrandPanel className={right ? "lg:order-2" : ""} />
      <div className={`flex flex-col ${right ? "lg:order-1" : ""}`}>
        {/* top bar (mobile logo + back home) */}
        <div className="flex items-center justify-between px-6 sm:px-10 h-[72px] border-b border-[#e4efe9] lg:border-none">
          <div className="lg:hidden"><Logo /></div>
          <Link to="/" className="ml-auto text-[14px] font-medium text-[#51635b] hover:text-[#15a35c] transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to site
          </Link>
        </div>
        {/* form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[420px]">
            <h1 className="font-sora font-bold text-[30px] tracking-[-0.02em]">{title}</h1>
            <p className="text-[#51635b] text-[15px] mt-2">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <p className="text-[#51635b] text-[14.5px] mt-7 text-center">{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable text field ---------- */
interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

export function Field({ label, type = "text", placeholder, value, onChange, autoComplete }: FieldProps) {
  return (
    <label className="block mb-4">
      <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[46px] px-3.5 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/12"
      />
    </label>
  );
}

/* ---------- Password field with show/hide ---------- */
interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}

export function PasswordField({ label, placeholder, value, onChange, autoComplete }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <label className="block mb-4">
      <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[46px] pl-3.5 pr-11 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none transition-all placeholder:text-[#9db5a8] focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/12"
        />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8c84] hover:text-[#15a35c] transition-colors">
          {show ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></svg>
          )}
        </button>
      </div>
    </label>
  );
}

/* ---------- Reusable select field ---------- */
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}

export function SelectField({ label, value, onChange, options, placeholder = "Select…" }: SelectFieldProps) {
  return (
    <label className="block mb-4">
      <span className="block text-[13.5px] font-medium text-[#0a1f17] mb-1.5">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[46px] pl-3.5 pr-10 rounded-[10px] bg-white border border-[#e4efe9] text-[15px] outline-none appearance-none transition-all focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/12 ${value ? "text-[#0a1f17]" : "text-[#9db5a8]"}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-[#0a1f17]">{o}</option>
          ))}
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#7b8c84] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"><path d="m6 9 6 6 6-6" /></svg>
      </div>
    </label>
  );
}

/* ---------- Google button + divider (UI only) ---------- */
export function SocialRow() {
  return (
    <>
      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-[#e4efe9]" />
        <span className="text-[12.5px] text-[#7b8c84]">or</span>
        <span className="h-px flex-1 bg-[#e4efe9]" />
      </div>
      <button type="button" className="w-full h-[46px] rounded-[10px] border border-[#e4efe9] bg-white text-[14px] font-medium text-[#0a1f17] flex items-center justify-center gap-2.5 hover:border-[#cdeedd] hover:bg-[#f4faf6] transition-all">
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" /></svg>
        Continue with Google
      </button>
    </>
  );
}