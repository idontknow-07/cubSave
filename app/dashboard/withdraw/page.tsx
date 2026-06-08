"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FUNCTIONAL_COINS } from "@/lib/coins";
import { ArrowLeft, Eye, EyeOff, Check, ChevronRight, AlertTriangle } from "lucide-react";
import CoinIcon from "@/components/CoinIcon";
import { formatCrypto } from "@/lib/utils";

type Wallet = { coin: string; network: string; balance: number };

const STEPS = ["Select", "Details", "Confirm", "Done"];
const WITHDRAW_RETURN_KEY = "cv_withdraw_return_to";
const DEFAULT_RETURN_PATH = "/dashboard";

function safeReturnPath(value: string | null) {
  if (!value || !value.startsWith("/dashboard") || value.startsWith("//") || value.startsWith("/dashboard/withdraw")) {
    return DEFAULT_RETURN_PATH;
  }
  return value;
}

function getInitialReturnPath() {
  if (typeof window === "undefined") return DEFAULT_RETURN_PATH;
  try {
    return safeReturnPath(window.sessionStorage.getItem(WITHDRAW_RETURN_KEY));
  } catch {
    return DEFAULT_RETURN_PATH;
  }
}

export default function WithdrawPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<typeof FUNCTIONAL_COINS[0] | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [returnPath] = useState(getInitialReturnPath);

  useEffect(() => {
    fetch("/api/wallet").then(r => r.json()).then(d => setWallets(d.wallets || []));
  }, []);

  useEffect(() => {
    if (step !== 3) return;
    const id = window.setTimeout(() => {
      window.sessionStorage.removeItem(WITHDRAW_RETURN_KEY);
      router.replace(returnPath);
    }, 900);
    return () => window.clearTimeout(id);
  }, [returnPath, router, step]);

  const getBalance = (coin: string, network: string) =>
    wallets.find(w => w.coin === coin && w.network === network)?.balance || 0;

  const back = () => {
    if (step === 0) router.back();
    else { setStep(step - 1); setError(""); }
  };

  const finishAndReturn = () => {
    window.sessionStorage.removeItem(WITHDRAW_RETURN_KEY);
    router.replace(returnPath);
  };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "withdraw",
          coin: selectedCoin!.coin,
          network: selectedCoin!.network,
          amount: parseFloat(amount),
          address,
          pin,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const balance = selectedCoin ? getBalance(selectedCoin.coin, selectedCoin.network) : 0;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 20px 80px", minHeight: "100vh" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={back}
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--card2)", border: "1px solid var(--border)" }}>
          <ArrowLeft size={18} color="var(--text)" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>
            {step === 2 ? "Confirm Withdrawal" : "Send Crypto"}
          </h1>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            {step < 3 ? `Step ${step + 1} of 3` : "Request submitted"}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {step < 3 && (
        <div className="flex gap-1.5 mb-8">
          {STEPS.slice(0, 3).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? "var(--accent)" : "var(--card2)" }} />
          ))}
        </div>
      )}

      {/* ── Step 0 — Select coin ── */}
      {step === 0 && (
        <div className="fade-up">
          <p className="text-sm font-medium mb-5" style={{ color: "var(--text-2)" }}>
            Choose which coin to send
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FUNCTIONAL_COINS.map(coin => {
              const bal = getBalance(coin.coin, coin.network);
              const empty = bal === 0;
              return (
                <button
                  key={`${coin.coin}-${coin.network}`}
                  onClick={() => { setSelectedCoin(coin); setStep(1); }}
                  disabled={empty}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 16,
                    padding: "18px 20px", borderRadius: 18, textAlign: "left",
                    background: "var(--card)", border: "1px solid var(--border)",
                    cursor: empty ? "not-allowed" : "pointer",
                    opacity: empty ? 0.38 : 1,
                    transition: "border-color 0.12s, transform 0.12s",
                  }}
                  onMouseEnter={e => { if (!empty) { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <CoinIcon symbol={coin.symbol} size={52} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 3 }}>{coin.coin}</p>
                    <p style={{ fontSize: 13, color: "var(--text-3)" }}>{coin.network}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p className="num" style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>
                      {formatCrypto(bal)}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3 }}>{coin.symbol}</p>
                  </div>
                  {!empty && <ChevronRight size={16} color="var(--text-3)" style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 1 — Amount & address ── */}
      {step === 1 && selectedCoin && (
        <div className="fade-up">
          {/* Coin header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", borderRadius: 16, marginBottom: 28,
            background: "var(--card)", border: "1px solid var(--border)",
          }}>
            <CoinIcon symbol={selectedCoin.symbol} size={44} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{selectedCoin.coin}</p>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{selectedCoin.network}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 2 }}>Available</p>
              <p className="num" style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>
                {formatCrypto(balance)} <span style={{ color: "var(--text-3)", fontWeight: 600 }}>{selectedCoin.symbol}</span>
              </p>
            </div>
          </div>

          {/* Address field */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>
              Recipient Address
            </label>
            <input
              className="input"
              style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: "0.02em" }}
              placeholder={`Enter ${selectedCoin.network} wallet address`}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Amount field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>
              Amount
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                className="input num"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ fontSize: 22, fontWeight: 800, paddingTop: 18, paddingBottom: 18, paddingRight: 100 }}
              />
              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setAmount(String(balance))}
                  style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8, background: "var(--accent-dim)", border: "1px solid rgba(170,255,71,0.2)", color: "var(--accent)", cursor: "pointer", letterSpacing: "0.05em" }}
                >
                  MAX
                </button>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)" }}>{selectedCoin.symbol}</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", borderRadius: 14, marginBottom: 24, background: "var(--yellow-dim)", border: "1px solid rgba(255,181,71,0.2)" }}>
            <AlertTriangle size={15} style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 13, color: "var(--yellow)", lineHeight: 1.55 }}>
              Double-check the address. Crypto sent to the wrong address cannot be recovered.
            </p>
          </div>

          <button
            className="btn btn-primary"
            disabled={!amount || !address || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
            onClick={() => setStep(2)}
          >
            Continue to Confirm
          </button>
        </div>
      )}

      {/* ── Step 2 — PIN confirmation ── */}
      {step === 2 && selectedCoin && (
        <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Summary card */}
          <div style={{ padding: "18px 20px", borderRadius: 18, marginBottom: 24, background: "var(--card)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", marginBottom: 14 }}>
              Transaction Summary
            </p>
            {[
              { label: "Coin", value: `${selectedCoin.coin} (${selectedCoin.network})` },
              { label: "Amount", value: `${amount} ${selectedCoin.symbol}` },
              { label: "To", value: address, mono: true },
            ].map((row, i) => (
              <div key={row.label}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
                  paddingTop: i > 0 ? 12 : 0, marginTop: i > 0 ? 12 : 0,
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                }}>
                <span style={{ fontSize: 13, color: "var(--text-3)", flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textAlign: "right", wordBreak: "break-all", fontFamily: row.mono ? "monospace" : "inherit" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* PIN section */}
          <div style={{
            padding: "28px 24px 24px", borderRadius: 18,
            background: "var(--card)", border: "1px solid var(--border)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
          }}>
            {/* Lock icon */}
            <div style={{
              width: 60, height: 60, borderRadius: 18, marginBottom: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(240,180,41,0.12)", border: "1px solid rgba(240,180,41,0.2)",
            }}>
              <span style={{ fontSize: 26 }}>🔐</span>
            </div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>
              Withdrawal PIN
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>
              Enter your PIN to confirm
            </p>

            {/* PIN input */}
            <div style={{ position: "relative", width: "100%", marginBottom: 12 }}>
              <input
                type={showPin ? "text" : "password"}
                className="input num"
                placeholder="••••"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value)}
                onKeyDown={e => e.key === "Enter" && pin && submit()}
                style={{ textAlign: "center", fontSize: 28, fontWeight: 900, letterSpacing: "0.35em", paddingTop: 18, paddingBottom: 18, paddingRight: 48 }}
              />
              <button
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
                onClick={() => setShowPin(!showPin)}>
                {showPin
                  ? <EyeOff size={18} color="var(--text-3)" />
                  : <Eye size={18} color="var(--text-3)" />}
              </button>
            </div>

            {error && (
              <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, marginBottom: 12, background: "rgba(240,68,68,0.1)", border: "1px solid rgba(240,68,68,0.2)" }}>
                <AlertTriangle size={14} style={{ color: "var(--red)", flexShrink: 0 }} />
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--red)" }}>{error}</p>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 4 }}
              onClick={submit}
              disabled={!pin || loading}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                    Processing...
                  </span>
                : "Confirm Withdrawal"}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3 — Done ── */}
      {step === 3 && (
        <div className="fade-up flex flex-col items-center text-center pt-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 glow-green"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-h))" }}>
            <Check size={40} color="#000" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black mb-3" style={{ color: "var(--text)" }}>Request Submitted!</h2>
          <p className="text-sm mb-3 max-w-xs" style={{ color: "var(--text-2)" }}>
            Your withdrawal of <span className="font-bold" style={{ color: "var(--text)" }}>
              {amount} {selectedCoin?.symbol}
            </span> is being processed.
          </p>
          <p className="text-xs mb-10" style={{ color: "var(--text-3)" }}>
            Returning you now.
          </p>
          <button className="btn btn-primary" onClick={finishAndReturn}>
            {returnPath === DEFAULT_RETURN_PATH ? "Back to Home" : "Back to Previous Page"}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
