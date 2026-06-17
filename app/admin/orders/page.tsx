"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Copy, Check, ArrowDownCircle, ArrowUpCircle, InboxIcon, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";

type Tx = {
  id: string; coin: string; network: string; type: string;
  amount: number; status: string; address: string | null;
  createdAt: string; user: { email: string; username: string };
};

const CC: Record<string, string> = { BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F" };
const coinCol = (c: string) => CC[c] ?? "var(--accent)";

function uc(u: string) {
  const p = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];
  let h = 0; for (let i = 0; i < u.length; i++) h = u.charCodeAt(i) + ((h << 5) - h);
  return p[Math.abs(h) % p.length];
}

const SMAP = {
  pending:  { bg: "rgba(255,181,71,0.10)",  col: "#ffb547", Icon: Clock },
  approved: { bg: "rgba(57,217,138,0.10)",  col: "#39d98a", Icon: CheckCircle2 },
  rejected: { bg: "rgba(255,77,77,0.10)",   col: "#ff4d4d", Icon: XCircle },
} as const;

function Badge({ status }: { status: string }) {
  const s = SMAP[status as keyof typeof SMAP] ?? { bg: "var(--card)", col: "var(--text-2)", Icon: Clock };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: s.bg, color: s.col, whiteSpace: "nowrap" }}>
      <s.Icon size={11} />{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function CopyAddr({ address }: { address: string }) {
  const [c, setC] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--text-2)" }}>{address.slice(0,8)}…{address.slice(-5)}</span>
      <button onClick={() => { navigator.clipboard.writeText(address); setC(true); setTimeout(() => setC(false), 1600); }}
        style={{ width: 24, height: 24, borderRadius: 6, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {c ? <Check size={11} color="var(--accent)" /> : <Copy size={11} color="var(--text-3)" />}
      </button>
    </div>
  );
}

function ClosedAction({ compact = false }: { compact?: boolean }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: compact ? "5px 9px" : "6px 10px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      background: "var(--surface)",
      color: "var(--text-3)",
      border: "1px solid var(--border)",
      whiteSpace: "nowrap"
    }}>
      Finalized
    </span>
  );
}

const TH: React.CSSProperties = { padding: "11px 18px", textAlign: "left", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)", background: "var(--surface)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "14px 18px", borderBottom: "1px solid var(--border)", verticalAlign: "middle" };

export default function OrdersPage() {
  const [tab, setTab] = useState<"withdraw" | "deposit" | "transfer">("withdraw");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    const p = new URLSearchParams({ type: tab });
    if (search) p.set("search", search);
    const r = await fetch(`/api/admin/transactions?${p}`);
    const d = await r.json();
    setTxs(d.transactions || []);
    setLoading(false);
  }, [tab, search]);

  useEffect(() => { load(); }, [load]);

  const update = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    await fetch("/api/admin/transactions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    await load();
    setUpdating(null);
  };

  const pending  = txs.filter(t => t.status === "pending").length;
  const approved = txs.filter(t => t.status === "approved").length;
  const rejected = txs.filter(t => t.status === "rejected").length;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>Orders</h1>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>Review and manage withdrawal, deposit & transfer requests</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ l: "Pending", n: pending, col: "#ffb547", bg: "rgba(255,181,71,0.10)" }, { l: "Approved", n: approved, col: "#39d98a", bg: "rgba(57,217,138,0.10)" }, { l: "Rejected", n: rejected, col: "#ff4d4d", bg: "rgba(255,77,77,0.10)" }].map(s => (
              <span key={s.l} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, background: s.bg, color: s.col, fontSize: 13, fontWeight: 800 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.col }} />
                {s.n} {s.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="orders-controls" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", alignSelf: "flex-start" }}>
          {(["withdraw","deposit","transfer"] as const).map(t => {
            const a = tab === t;
            const Icon = t === "withdraw" ? ArrowUpCircle : (t === "deposit" ? ArrowDownCircle : InboxIcon);
            return (
              <button key={t} onClick={() => { setLoading(true); setTab(t); }}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: a ? "var(--surface)" : "transparent", color: a ? "var(--text)" : "var(--text-3)", transition: "all 0.12s" }}>
                <Icon size={14} color={a ? (t === "withdraw" ? "#ff4d4d" : (t === "deposit" ? "var(--accent)" : "#3b82f6")) : "var(--text-3)"} />
                {t === "withdraw" ? "Withdrawals" : (t === "deposit" ? "Deposits" : "Transfers")}
              </button>
            );
          })}
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: 380 }}>
          <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 38, paddingTop: 10, paddingBottom: 10, fontSize: 15, width: "100%" }} placeholder="Search by username or email…" value={search} onChange={e => { setLoading(true); setSearch(e.target.value); }} />
        </div>
      </div>

      {/* Desktop table */}
      <div className="orders-table" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["User","Coin","Amount",tab === "transfer" ? "To User" : "Address","Status","Date","Actions"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i}>{[200,100,80,160,90,110,140].map((w,j) => (
                    <td key={j} style={TD}>
                      <div style={{ height: 13, borderRadius: 6, width: w, background: "var(--surface)", animation: "shimmer 1.3s infinite", backgroundSize: "600px 100%", backgroundImage: "linear-gradient(90deg, var(--card) 25%, var(--card-hover) 50%, var(--card) 75%)" }} />
                      {j===0&&<div style={{ height: 11, borderRadius: 6, width: 140, background: "var(--surface)", marginTop: 5, animation: "shimmer 1.3s infinite", backgroundSize: "600px 100%", backgroundImage: "linear-gradient(90deg, var(--card) 25%, var(--card-hover) 50%, var(--card) 75%)" }} />}
                    </td>
                  ))}</tr>
                ))
              ) : txs.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "80px 0", textAlign: "center" }}>
                  <InboxIcon size={36} style={{ color: "var(--border-2)", display: "block", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-3)" }}>No {tab} requests found</p>
                </td></tr>
              ) : txs.map(tx => (
                <tr key={tx.id} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"} style={{ transition: "background 0.1s" }}>
                  <td style={TD}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: uc(tx.user.username), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{tx.user.username[0]?.toUpperCase()}</div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.user.username}</p>
                        <p style={{ fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={TD}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800, background: coinCol(tx.coin)+"18", color: coinCol(tx.coin) }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: coinCol(tx.coin) }} />{tx.coin}
                    </span>
                    <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{tx.network}</p>
                  </td>
                  <td style={TD}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{tx.amount}</p>
                    <p style={{ fontSize: 12, color: "var(--text-3)" }}>{tx.coin}</p>
                  </td>
                  <td style={TD}>{tx.address ? <CopyAddr address={tx.address} /> : <span style={{ color: "var(--text-3)" }}>—</span>}</td>
                  <td style={TD}><Badge status={tx.status} /></td>
                  <td style={TD}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>{new Date(tx.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                    <p style={{ fontSize: 12, color: "var(--text-3)" }}>{new Date(tx.createdAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</p>
                  </td>
                  <td style={TD}>
                    {updating === tx.id ? <Loader2 size={16} className="animate-spin" color="var(--text-3)" /> : (
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {tx.status === "pending" ? (
                          <>
                            <button onClick={() => update(tx.id,"approved")} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(57,217,138,0.10)", color: "#39d98a", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Approve</button>
                            <button onClick={() => update(tx.id,"rejected")} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(255,77,77,0.10)", color: "#ff4d4d", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>Reject</button>
                          </>
                        ) : <ClosedAction />}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="orders-mobile" style={{ display: "none", flexDirection: "column", gap: 10 }}>
        {txs.length === 0 && !loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <InboxIcon size={32} style={{ color: "var(--border-2)", display: "block", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 14, color: "var(--text-3)" }}>No {tab} requests</p>
          </div>
        ) : txs.map(tx => (
          <div key={tx.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: uc(tx.user.username), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{tx.user.username[0]?.toUpperCase()}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{tx.user.username}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>{tx.user.email}</p>
                </div>
              </div>
              <Badge status={tx.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 11px" }}>
                <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 3 }}>Coin</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: coinCol(tx.coin) }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: coinCol(tx.coin) }}>{tx.coin}</span>
                  <span style={{ fontSize: 11, color: "var(--text-3)" }}>{tx.network}</span>
                </div>
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 11px" }}>
                <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 3 }}>Amount</p>
                <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text)" }}>{tx.amount} {tx.coin}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{new Date(tx.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {updating===tx.id ? <Loader2 size={14} className="animate-spin" color="var(--text-3)" /> : (
                  tx.status === "pending" ? (
                    <>
                      <button onClick={()=>update(tx.id,"approved")} style={{ padding:"5px 10px",borderRadius:7,fontSize:12,fontWeight:700,background:"rgba(57,217,138,0.10)",color:"#39d98a",border:"none",cursor:"pointer" }}>Approve</button>
                      <button onClick={()=>update(tx.id,"rejected")} style={{ padding:"5px 10px",borderRadius:7,fontSize:12,fontWeight:700,background:"rgba(255,77,77,0.10)",color:"#ff4d4d",border:"none",cursor:"pointer" }}>Reject</button>
                    </>
                  ) : <ClosedAction compact />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .orders-table { display: none !important; }
          .orders-mobile { display: flex !important; }
        }
        @keyframes shimmer { from { background-position: -600px 0; } to { background-position: 600px 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
