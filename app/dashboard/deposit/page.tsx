"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FUNCTIONAL_COINS, DEPOSIT_ADDRESSES } from "@/lib/coins";
import { ArrowLeft, Copy, Check, ChevronRight, Wallet, Users } from "lucide-react";
import CoinIcon from "@/components/CoinIcon";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "cv_deposit_draft";

function loadDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveDraft(coin: typeof FUNCTIONAL_COINS[0] | null, amount: string) {
  try {
    if (coin) localStorage.setItem(STORAGE_KEY, JSON.stringify({ coin, amount }));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function clearDraft() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

type DepositType = "external" | "securechain" | null;

export default function DepositPage() {
  const router = useRouter();
  const { user } = useAuth();

  const draft = loadDraft();
  const [step, setStep] = useState(draft?.coin ? 2 : 0);
  const [selectedCoin, setSelectedCoin] = useState<typeof FUNCTIONAL_COINS[0] | null>(draft?.coin ?? null);
  const [depositType, setDepositType] = useState<DepositType>(null);
  const [amount, setAmount] = useState<string>(draft?.amount ?? "");
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveDraft(selectedCoin, amount);
  }, [selectedCoin, amount]);

  const address = selectedCoin ? DEPOSIT_ADDRESSES[selectedCoin.network] || "" : "";

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyId = () => {
    navigator.clipboard.writeText(user?.username || "");
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const submit = async () => {
    setLoading(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "deposit",
          coin: selectedCoin!.coin,
          network: selectedCoin!.network,
          amount: parseFloat(amount),
          address,
        }),
      });
      clearDraft();
      setStep(4);
    } finally { setLoading(false); }
  };

  const back = () => {
    if (step === 0) { router.back(); return; }
    if (step === 1) { setStep(0); setSelectedCoin(null); return; }
    if (step === 2) { setDepositType(null); setStep(1); return; }
    if (step === 3) { setStep(2); return; }
  };

  const progressStep = depositType === "securechain" ? (step === 1 ? 1 : 2) : step;
  const totalSteps = depositType === "securechain" ? 2 : 3;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 100px", background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        {step < 4 && (
          <button
            onClick={back}
            style={{ width: 38, height: 38, borderRadius: 11, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <ArrowLeft size={18} color="var(--text)" />
          </button>
        )}
        <h1 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>
          {step === 4 ? "Deposit Initiated" : "Deposit Crypto"}
        </h1>
      </div>

      {/* Progress bar */}
      {step < 4 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < progressStep ? "var(--accent)" : "var(--card)", transition: "background 0.3s" }} />
          ))}
        </div>
      )}

      {/* Step 0 — Select coin */}
      {step === 0 && (
        <div className="fade-up">
          <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20, fontWeight: 500 }}>
            Select the coin you want to deposit
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FUNCTIONAL_COINS.map(coin => (
              <button
                key={`${coin.coin}-${coin.network}`}
                onClick={() => { setSelectedCoin(coin); setAmount(""); setDepositType(null); setStep(1); }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              >
                <CoinIcon symbol={coin.symbol} size={44} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{coin.coin}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{coin.network}</p>
                </div>
                <ChevronRight size={16} color="var(--text-3)" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Choose deposit type */}
      {step === 1 && selectedCoin && (
        <div className="fade-up">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 24 }}>
            <CoinIcon symbol={selectedCoin.symbol} size={32} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{selectedCoin.coin}</p>
              <p style={{ fontSize: 11, color: "var(--text-3)" }}>{selectedCoin.network}</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16, fontWeight: 500 }}>
            Where are you receiving from?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* External option */}
            <button
              onClick={() => { setDepositType("external"); setStep(2); }}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
            >
              <div style={{ width: 46, height: 46, borderRadius: 14, background: "var(--accent-dim)", border: "1px solid rgba(21,163,92,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Wallet size={20} color="var(--accent)" strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 3 }}>External Wallet / Exchange</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>Deposit from Binance, Coinbase, MetaMask, or any other platform</p>
              </div>
              <ChevronRight size={16} color="var(--text-3)" />
            </button>

            {/* SecureChain option */}
            <button
              onClick={() => { setDepositType("securechain"); setStep(2); }}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
            >
              <div style={{ width: 46, height: 46, borderRadius: 14, background: "var(--accent-dim)", border: "1px solid rgba(21,163,92,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z"/><circle cx="12" cy="11" r="1.9"/><path d="M12 12.9V15.4"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 3 }}>From another SecureChain user</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>Receive from a friend or contact who is also on SecureChain</p>
              </div>
              <ChevronRight size={16} color="var(--text-3)" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — SecureChain receive */}
      {step === 2 && depositType === "securechain" && selectedCoin && (
        <div className="fade-up">
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 24, lineHeight: 1.65 }}>
            Share your <strong style={{ color: "var(--text)" }}>SecureChain ID</strong> with the person sending you {selectedCoin.coin}. They will use it to send funds directly to your wallet.
          </p>

          {/* SecureChain ID card */}
          <div style={{ padding: "24px 20px", borderRadius: 18, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 16, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontWeight: 900, fontSize: 22, color: "#fff" }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 6 }}>
              Your SecureChain ID
            </p>
            <p style={{ fontSize: 22, fontWeight: 900, color: "var(--accent)", marginBottom: 4, letterSpacing: "-0.01em" }}>
              @{user?.username}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18 }}>
              {selectedCoin.coin} · {selectedCoin.network}
            </p>
            <button
              onClick={copyId}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 0", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer",
                background: copiedId ? "var(--accent-dim)" : "var(--card-hover)",
                color: copiedId ? "var(--accent)" : "var(--text-2)",
                border: `1px solid ${copiedId ? "rgba(21,163,92,0.25)" : "var(--border)"}`,
                transition: "all 0.15s",
              }}
            >
              {copiedId ? <Check size={15} /> : <Copy size={15} />}
              {copiedId ? "Copied!" : "Copy SecureChain ID"}
            </button>
          </div>

          {/* Also show wallet address */}
          <div style={{ padding: "16px 18px", borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>
              Or share wallet address
            </p>
            <p style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text-2)", wordBreak: "break-all", lineHeight: 1.7, marginBottom: 12 }}>
              {address}
            </p>
            <button
              onClick={copy}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 0", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
                background: copied ? "var(--accent-dim)" : "var(--surface)",
                color: copied ? "var(--accent)" : "var(--text-3)",
                border: `1px solid ${copied ? "rgba(21,163,92,0.25)" : "var(--border)"}`,
                transition: "all 0.15s",
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Address Copied!" : "Copy Address"}
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => router.replace("/dashboard")}>
            Back to Wallet
          </button>
        </div>
      )}

      {/* Step 2 — External: Enter amount */}
      {step === 2 && depositType === "external" && selectedCoin && (
        <div className="fade-up">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 24 }}>
            <CoinIcon symbol={selectedCoin.symbol} size={32} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{selectedCoin.coin}</p>
              <p style={{ fontSize: 11, color: "var(--text-3)" }}>{selectedCoin.network}</p>
            </div>
          </div>

          <label style={{ display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>
            Amount to deposit
          </label>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input
              type="number" className="input"
              style={{ fontSize: 22, fontWeight: 800, paddingTop: 16, paddingBottom: 16, paddingRight: 64 }}
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 700, color: "var(--text-3)" }}>
              {selectedCoin.symbol}
            </span>
          </div>

          <button
            className="btn btn-primary"
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={() => setStep(3)}
          >
            Get Deposit Address
          </button>
        </div>
      )}

      {/* Step 3 — External: Address + confirm */}
      {step === 3 && depositType === "external" && selectedCoin && (
        <div className="fade-up">
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 20, textAlign: "center" }}>
            Send <strong style={{ color: "var(--text)" }}>{amount} {selectedCoin.symbol}</strong> to this address
          </p>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", borderRadius: 12, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 20 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "#d97706", lineHeight: 1.6 }}>
              Only send <strong>{selectedCoin.coin}</strong> via <strong>{selectedCoin.network}</strong> to this address. Sending the wrong asset results in permanent loss.
            </p>
          </div>

          <div style={{ padding: "18px 20px", borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 10 }}>
              {selectedCoin.network} Deposit Address
            </p>
            <p style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text)", wordBreak: "break-all", lineHeight: 1.7, marginBottom: 14 }}>
              {address}
            </p>
            <button
              onClick={copy}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "11px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
                background: copied ? "var(--accent-dim)" : "var(--card-hover)",
                color: copied ? "var(--accent)" : "var(--text-2)",
                border: `1px solid ${copied ? "rgba(21,163,92,0.25)" : "var(--border)"}`,
                transition: "all 0.15s",
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Address Copied!" : "Copy Address"}
            </button>
          </div>

          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading
              ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                  Processing…
                </span>
              : "I've Sent the Payment"
            }
          </button>
        </div>
      )}

      {/* Step 4 — Done */}
      {step === 4 && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 48 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 0 40px var(--accent-glow)" }}>
            <Check size={36} color="#fff" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 10 }}>Deposit Initiated</h2>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 280, marginBottom: 36 }}>
            Your deposit is being processed. Your balance will update shortly — no action needed.
          </p>
          <button
            className="btn btn-primary"
            style={{ maxWidth: 280, width: "100%" }}
            onClick={() => router.replace("/dashboard")}
          >
            Back to Wallet
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
