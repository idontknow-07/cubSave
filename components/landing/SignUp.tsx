import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { Field, PasswordField, SelectField, SocialRow } from "./AuthLayout";
import ReCaptcha from "../components/reCaptcha";
import { COUNTRIES } from "../data";

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [mobile, setMobile] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  // useCallback so the ReCaptcha effect doesn't re-run on every keystroke
  const handleCaptcha = useCallback((token: string | null) => setCaptchaToken(token), []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree || !captchaToken) return;
    // TODO: send the form data AND `captchaToken` to your backend.
    // Your backend must verify the token with Google before creating the account:
    // POST https://www.google.com/recaptcha/api/siteverify  (secret + response=captchaToken)
    console.log("signup", { firstName, lastName, email, password, country, mobile, captchaToken });
    navigate("/");
  }

  return (
    <AuthLayout
      brandSide="left"
      title="Set up your account"
      subtitle="Welcome, let's get started."
      footer={<>Already have an account? <Link to="/login" className="text-[#15a35c] font-semibold hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" placeholder="Enter your first name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
          <Field label="Last name" placeholder="Enter your last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
        </div>

        <Field label="Email" type="email" placeholder="Enter your email" value={email} onChange={setEmail} autoComplete="email" />
        <PasswordField label="Password" placeholder="Create a password" value={password} onChange={setPassword} autoComplete="new-password" />
        <SelectField label="Country" value={country} onChange={setCountry} options={COUNTRIES} placeholder="Choose a country" />
        <Field label="Mobile number" type="tel" placeholder="Enter your mobile number" value={mobile} onChange={setMobile} autoComplete="tel" />

        <ReCaptcha onChange={handleCaptcha} />

        <label className="flex items-start gap-2.5 text-[13px] text-[#51635b] mb-6 cursor-pointer select-none">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-[#cdd9d2] accent-[#15a35c]" />
          <span>I agree to VaultChain&apos;s <a href="#" className="text-[#15a35c] font-medium hover:underline">Terms</a>, <a href="#" className="text-[#15a35c] font-medium hover:underline">Privacy</a>, and policy.</span>
        </label>

        <button type="submit" disabled={!agree || !captchaToken} className="w-full h-[48px] rounded-[10px] bg-[#15a35c] text-white font-sora font-semibold text-[15px] shadow-[0_10px_26px_rgba(21,163,92,0.28)] transition-all enabled:hover:bg-[#0c8048] enabled:hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
          Sign up
        </button>
      </form>

      <SocialRow />
    </AuthLayout>
  );
}