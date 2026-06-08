import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = digits.join("");

  function setDigit(i: number, v: string) {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const n = [...d];
      n[i] = ch;
      return n;
    });
    if (ch && i < 5) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    setDigits(Array(6).fill("").map((_, i) => text[i] ?? ""));
    refs.current[Math.min(text.length, 5)]?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 6) return;
    // TODO: verify `code` against the one your backend emailed the user.
    navigate("/verify-id");
  }

  return (
    <AuthLayout
      brandSide="left"
      title="Verify your email"
      subtitle="We've sent a 6-digit code to the email you signed up with. Enter it below to continue."
      footer={
        <>
          Didn't receive it?{" "}
          <button
            type="button"
            onClick={() => setResent(true)}
            className="text-[#15a35c] font-semibold hover:underline"
          >
            Resend code
          </button>
          {resent && <span className="block mt-1 text-[12.5px] text-[#15a35c]">A new code has been sent.</span>}
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-between">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onPaste={onPaste}
              className="w-12 h-14 text-center text-[22px] font-semibold rounded-[10px] border border-[#e4efe9] outline-none transition-all focus:border-[#15a35c] focus:ring-4 focus:ring-[#15a35c]/12"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={code.length < 6}
          className="mt-7 w-full h-[48px] rounded-[10px] bg-[#15a35c] text-white font-sora font-semibold text-[15px] shadow-[0_10px_26px_rgba(21,163,92,0.28)] transition-all enabled:hover:bg-[#0c8048] enabled:hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify
        </button>
      </form>
    </AuthLayout>
  );
}