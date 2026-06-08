import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { Field, PasswordField, SocialRow } from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to your auth backend here.
    // For now this just demonstrates the flow.
    console.log("login", { email, password, remember });
    navigate("/");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your VaultChain account to keep trading."
      footer={<>Don&apos;t have an account? <Link to="/signup" className="text-[#15a35c] font-semibold hover:underline">Create one</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <Field label="Email address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />
        <PasswordField label="Password" placeholder="••••••••" value={password} onChange={setPassword} autoComplete="current-password" />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-[13.5px] text-[#51635b] cursor-pointer select-none">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-[#cdd9d2] accent-[#15a35c]" />
            Remember me
          </label>
          <a href="#" className="text-[13.5px] font-medium text-[#15a35c] hover:underline">Forgot password?</a>
        </div>

        <button type="submit" className="w-full h-[48px] rounded-[10px] bg-[#15a35c] text-white font-sora font-semibold text-[15px] shadow-[0_10px_26px_rgba(21,163,92,0.28)] hover:bg-[#0c8048] hover:-translate-y-0.5 transition-all">
          Sign In
        </button>
      </form>

      <SocialRow />
    </AuthLayout>
  );
}