"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout, { Field, SelectField } from "./AuthLayout";

const ID_TYPES = [
  "National ID (NIN)",
  "Driver's License",
  "International Passport",
  "Voter's Card",
];

export default function VerifyId() {
  const router = useRouter();
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idType || !idNumber.trim()) return;
    router.push("/dashboard");
  }

  return (
    <AuthLayout
      brandSide="left"
      title="Verify your identity"
      subtitle="Select your ID type and enter the number to complete verification."
      footer={<>This step keeps your account secure and is required to start trading.</>}
    >
      <form onSubmit={handleSubmit}>
        <SelectField
          label="ID type"
          value={idType}
          onChange={setIdType}
          options={ID_TYPES}
          placeholder="Select your ID"
        />
        <Field
          label="ID number"
          placeholder="Enter your ID number"
          value={idNumber}
          onChange={setIdNumber}
        />

        <p className="flex items-start gap-2 text-[12.5px] text-[#7b8c84] mb-5 -mt-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0 text-[#15a35c]"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Your details are encrypted and used only to verify your identity.
        </p>

        <button
          type="submit"
          disabled={!idType || !idNumber.trim()}
          className="w-full h-[48px] rounded-[10px] bg-[#15a35c] text-white font-sora font-semibold text-[15px] shadow-[0_10px_26px_rgba(21,163,92,0.28)] transition-all enabled:hover:bg-[#0c8048] enabled:hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm &amp; continue
        </button>
      </form>
    </AuthLayout>
  );
}
