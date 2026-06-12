"use client";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { formatCrypto } from "@/lib/utils";

type Tx = {
  id: string;
  coin: string;
  network: string;
  type: string;
  amount: number;
  status: string;
  address: string | null;
  createdAt: string;
};

function fakeHash(id: string, coin: string) {
  const chars = "abcdef0123456789";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    const code = id.charCodeAt(i % id.length) + i * 7 + coin.charCodeAt(i % coin.length);
    hash += chars[code % chars.length];
  }
  return coin === "BTC" ? hash.substring(0, 64) : "0x" + hash.substring(0, 62);
}

function fakeBlockHeight(createdAt: string) {
  const base = 849000;
  const d = new Date(createdAt).getTime();
  return (base + Math.floor((d % 999999) / 100)).toLocaleString();
}

function fakeConfirmations(createdAt: string) {
  const ms = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(ms / 60000);
  return Math.min(mins * 3 + 12, 512).toLocaleString();
}

function fakeNetworkFee(coin: string) {
  const fees: Record<string, string> = {
    BTC: "0.00003 BTC", ETH: "0.00042 ETH", USDT: "1.20 USDT", BNB: "0.00015 BNB",
  };
  return fees[coin] || "0.001";
}

function fakeProcessingTime(createdAt: string) {
  const code = createdAt.charCodeAt(10) % 3;
  return ["0m 58s", "1m 23s", "2m 07s"][code];
}

export default function TxDetailSheet({ tx, onClose }: { tx: Tx; onClose: () => void }) {
  const isDeposit = tx.type === "deposit";
  const txHash = fakeHash(tx.id, tx.coin);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "flex-end",
        backdropFilter: "blur(4px)",
      }}
      className="ios-sheet-pb"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 520, margin: "0 auto",
          background: "var(--surface)", borderRadius: "24px 24px 0 0",
          border: "1px solid var(--border)", borderBottom: "none",
          padding: "0 0 40px",
          maxHeight: "92dvh", overflowY: "auto",
          animation: "slideUp 0.25s ease",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "var(--border-2)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 16px" }}>
          <button onClick={onClose}
            style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: "var(--text-3)", 
              background: "none", 
              border: "none", 
              cursor: "pointer",
              padding: "4px 0"
            }}>
            Cancel
          </button>
          <p style={{ fontWeight: 800, fontSize: 17, color: "var(--text)" }}>Transaction Details</p>
          <button onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} color="var(--text-3)" />
          </button>
        </div>

        {/* Status hero */}
        <div style={{ textAlign: "center", padding: "12px 20px 20px" }}>
          <div style={{
            width: 60, height: 60, borderRadius: 20, margin: "0 auto 12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: tx.status === "rejected"
              ? "rgba(240,68,68,0.12)"
              : tx.status === "pending"
                ? "rgba(240,180,41,0.12)"
                : isDeposit ? "rgba(21,163,92,0.12)" : "rgba(57,217,138,0.12)",
          }}>
            {tx.status === "rejected"
              ? <AlertCircle size={28} color="var(--red)" />
              : tx.status === "pending"
                ? <Loader2 size={28} color="var(--yellow)" style={{ animation: "spin 1.4s linear infinite" }} />
                : <CheckCircle2 size={28} color="var(--accent)" />}
          </div>
          <p style={{ fontWeight: 900, fontSize: 22, color: "var(--text)", letterSpacing: "-0.01em" }}>
            {tx.status === "pending" ? "Processing" : tx.status === "rejected" ? "Failed" : isDeposit ? "Received" : "Sent"}
          </p>
          <p className="num" style={{ fontSize: 28, fontWeight: 900, color: isDeposit ? "var(--accent)" : "var(--text)", marginTop: 4 }}>
            {isDeposit ? "+" : "−"}{formatCrypto(tx.amount)} {tx.coin}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>{tx.network}</p>
        </div>

        {/* Details */}
        <div style={{ margin: "0 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          {[
            { label: "Date", value: new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) },
            { label: "Processing time", value: tx.status === "pending" ? "In progress" : fakeProcessingTime(tx.createdAt) },
            { label: "Network fee", value: fakeNetworkFee(tx.coin) },
            { label: "Block height", value: fakeBlockHeight(tx.createdAt) },
            { label: "Confirmations", value: tx.status === "pending" ? "Pending" : fakeConfirmations(tx.createdAt) },
          ].map((row, i, arr) => (
            <div key={row.label}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "13px 16px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>{row.label}</span>
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* TX hash */}
        <div style={{ margin: "10px 16px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "13px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            Transaction Hash
          </p>
          <p style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-2)", wordBreak: "break-all", lineHeight: 1.5 }}>
            {txHash}
          </p>
        </div>

        {tx.address && (
          <div style={{ margin: "10px 16px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "13px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              {isDeposit ? "From address" : "To address"}
            </p>
            <p style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-2)", wordBreak: "break-all", lineHeight: 1.5 }}>
              {tx.address}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity:0; } to { transform: translateY(0); opacity:1; } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
