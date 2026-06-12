"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, TrendingUp, TrendingDown, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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

const FILTERS = ["All", "Deposits", "Withdrawals"] as const;

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

function TxDetailSheet({ tx, onClose }: { tx: Tx; onClose: () => void }) {
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

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 rounded-2xl animate-pulse"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: "var(--card2)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 rounded w-24" style={{ background: "var(--card2)" }} />
        <div className="h-3 rounded w-32" style={{ background: "var(--card2)" }} />
      </div>
      <div className="space-y-2 text-right">
        <div className="h-3.5 rounded w-20" style={{ background: "var(--card2)" }} />
        <div className="h-3 rounded w-14 ml-auto" style={{ background: "var(--card2)" }} />
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [selected, setSelected] = useState<Tx | null>(null);

  useEffect(() => {
    fetch("/api/transactions")
      .then(r => r.json())
      .then(d => setTransactions(d.transactions || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter(tx => {
    if (filter === "Deposits") return tx.type === "deposit";
    if (filter === "Withdrawals") return tx.type === "withdraw";
    return true;
  });

  const counts = {
    All: transactions.length,
    Deposits: transactions.filter(t => t.type === "deposit").length,
    Withdrawals: transactions.filter(t => t.type === "withdraw").length,
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 88px", minHeight: "100vh" }}>

      {/* Header */}
      <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
        <button onClick={() => router.back()}
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--card2)", border: "1px solid var(--border)" }}>
          <ArrowLeft size={18} color="var(--text)" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight" style={{ color: "var(--text)" }}>History</h1>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>Your transaction records</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="history-filter-bar"
        style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          padding: 4, marginBottom: 18, borderRadius: 18,
          background: "var(--card)", border: "1px solid var(--border)",
        }}
      >
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="history-filter-button"
            style={{
              flex: "1 1 0", minWidth: 120,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 14px", borderRadius: 14, fontSize: 13, fontWeight: 800,
              cursor: "pointer", transition: "all 0.15s",
              background: filter === f ? "var(--accent)" : "var(--card2)",
              color: filter === f ? "#000" : "var(--text-3)",
              border: `1px solid ${filter === f ? "transparent" : "var(--border)"}`,
            }}>
            {f}
            {counts[f] > 0 && (
              <span className="text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  background: filter === f ? "rgba(0,0,0,0.2)" : "var(--border2)",
                  color: filter === f ? "#000" : "var(--text-3)",
                }}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--card2)" }}>
            <Clock size={24} color="var(--text-3)" />
          </div>
          <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No transactions yet</p>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            {filter === "All" ? "Your transaction history will appear here" : `No ${filter.toLowerCase()} found`}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(tx => {
            const isDeposit = tx.type === "deposit";
            const label = tx.status === "pending"
              ? "Processing"
              : tx.status === "rejected"
                ? "Failed"
                : isDeposit ? "Received" : "Sent";
            const labelColor = tx.status === "rejected"
              ? "var(--red)"
              : tx.status === "pending"
                ? "var(--yellow)"
                : "var(--accent)";
            const labelBg = tx.status === "rejected"
              ? "rgba(240,68,68,0.12)"
              : tx.status === "pending"
                ? "rgba(240,180,41,0.12)"
                : "rgba(57,217,138,0.12)";

            return (
              <button
                key={tx.id}
                onClick={() => setSelected(tx)}
                className="history-tx-row"
                style={{
                  width: "100%", display: "grid",
                  gridTemplateColumns: "44px minmax(0, 1fr) minmax(132px, max-content)",
                  alignItems: "center", columnGap: 12, rowGap: 8,
                  padding: "16px 18px", borderRadius: 18, textAlign: "left", cursor: "pointer",
                  background: "var(--card)", border: "1px solid var(--border)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDeposit ? "rgba(21,163,92,0.12)" : "rgba(240,68,68,0.12)",
                }}>
                  {isDeposit
                    ? <TrendingUp size={18} color="var(--accent)" />
                    : <TrendingDown size={18} color="var(--red)" />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {isDeposit ? "Received" : "Sent"} {tx.coin}
                  </p>
                  <p style={{
                    fontSize: 12, color: "var(--text-3)", marginTop: 5,
                    display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                  }}>
                    <span>{tx.network}</span>
                    <span style={{ color: "var(--border-2)" }}>|</span>
                    <span>
                      {new Date(tx.createdAt).toLocaleString(undefined, {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>

                {/* Amount + status */}
                <div className="history-tx-amount" style={{ textAlign: "right", justifySelf: "end", minWidth: 0 }}>
                  <p className="num" style={{ fontWeight: 900, fontSize: 15, color: isDeposit ? "var(--accent)" : "var(--text)", whiteSpace: "nowrap" }}>
                    {isDeposit ? "+" : "−"}{formatCrypto(tx.amount)} {tx.coin}
                  </p>
                  <span style={{
                    display: "inline-block", marginTop: 7, fontSize: 10, fontWeight: 800,
                    padding: "2px 8px", borderRadius: 99,
                    background: labelBg, color: labelColor, whiteSpace: "nowrap",
                  }}>
                    {label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && <TxDetailSheet tx={selected} onClose={() => setSelected(null)} />}
      <style>{`
        @media (max-width: 520px) {
          .history-filter-bar {
            gap: 6px !important;
            margin-bottom: 16px !important;
          }

          .history-filter-button {
            min-width: 0 !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
          }

          .history-tx-row {
            grid-template-columns: 44px minmax(0, 1fr) !important;
            align-items: start !important;
            padding: 15px 16px !important;
          }

          .history-tx-amount {
            grid-column: 2 !important;
            justify-self: start !important;
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
}
