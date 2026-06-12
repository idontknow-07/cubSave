"use client";
import { useEffect, useState } from "react";
import { FUNCTIONAL_COINS } from "@/lib/coins";
import { formatCrypto } from "@/lib/utils";
import { X, Loader2, Users, Search, Plus, ChevronRight, Clock, CheckCircle2, XCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import CoinIcon from "@/components/CoinIcon";

type UW = { id: string; email: string; username: string; wallets: { coin: string; network: string; balance: number }[] };

type Tx = {
  id: string; coin: string; network: string; type: string;
  amount: number; status: string; address: string | null;
  createdAt: string;
};

type Modal = {
  userId: string;
  username: string;
  coin: string | null;
  network: string | null;
  tab: "credit" | "history";
} | null;

const CC: Record<string, string> = { BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F" };
const cc = (c: string) => CC[c] ?? "var(--accent)";

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

function StatusBadge({ status }: { status: string }) {
  const s = SMAP[status as keyof typeof SMAP] ?? { bg: "var(--card)", col: "var(--text-2)", Icon: Clock };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: s.bg, color: s.col, whiteSpace: "nowrap" }}>
      <s.Icon size={10} />{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function UserCard({ user, onManage }: { user: UW; onManage: () => void }) {
  const bal = (coin: string, net: string) =>
    user.wallets.find(w => w.coin === coin && w.network === net)?.balance ?? 0;

  return (
    <div
      style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", transition: "border-color 0.15s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: uc(user.username), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
          {user.username[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.username}</p>
          <p style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
        </div>
        <button
          onClick={onManage}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 99, background: "var(--accent-dim)", border: "1px solid rgba(170,255,71,0.15)", color: "var(--accent)", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}
        >
          Manage <ChevronRight size={13} />
        </button>
      </div>

      <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {FUNCTIONAL_COINS.map(c => {
          const b = bal(c.coin, c.network);
          const color = cc(c.coin);
          return (
            <div key={`${c.coin}-${c.network}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CoinIcon symbol={c.symbol} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{c.coin}</p>
                <p style={{ fontSize: 11, color: "var(--text-3)" }}>{c.network}</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 800, color: b > 0 ? "var(--text)" : "var(--text-3)" }}>
                {formatCrypto(b)} <span style={{ fontSize: 11, fontWeight: 600, color }}>{c.symbol}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CreditPage() {
  const [users,      setUsers]      = useState<UW[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState<Modal>(null);
  const [amount,     setAmount]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  // History tab state
  const [history,      setHistory]      = useState<Tx[]>([]);
  const [histLoading,  setHistLoading]  = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/credit");
    const d = await r.json();
    setUsers(d.users || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const loadHistory = async (userId: string) => {
    setHistLoading(true);
    const r = await fetch(`/api/admin/transactions?userId=${encodeURIComponent(userId)}`);
    const d = await r.json();
    setHistory(d.transactions || []);
    setHistLoading(false);
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openManage = (user: UW) => {
    setModal({ userId: user.id, username: user.username, coin: null, network: null, tab: "credit" });
    setAmount(""); setError("");
    loadHistory(user.id);
  };

  const switchTab = (tab: "credit" | "history") => {
    if (!modal) return;
    setModal({ ...modal, tab, coin: null, network: null });
    setAmount(""); setError("");
  };

  const submit = async () => {
    if (!modal?.coin || !amount) return;
    setSubmitting(true); setError("");
    try {
      const r = await fetch("/api/admin/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: modal.userId, coin: modal.coin, network: modal.network, amount }),
      });
      if (!r.ok) { setError((await r.json()).error); return; }
      setModal(null); setAmount(""); await load();
    } finally { setSubmitting(false); }
  };

  const creditStep = !modal ? 0 : !modal.coin ? 1 : 2;

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>Credit Management</h1>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>Adjust user wallet balances across all networks</p>
          </div>
          {!loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: "var(--card)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--text-2)" }}>
              <Users size={13} color="var(--accent)" />
              {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {users.length > 0 && (
        <div style={{ position: "relative", maxWidth: 340, marginBottom: 24 }}>
          <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
          <input className="input" style={{ paddingLeft: 38, paddingTop: 9, paddingBottom: 9, fontSize: 14 }}
            placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {/* User grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {[1,2].map(i => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, height: 240 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--surface)" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 13, background: "var(--surface)", borderRadius: 6, width: "50%" }} />
                  <div style={{ height: 11, background: "var(--surface)", borderRadius: 6, width: "70%" }} />
                </div>
              </div>
              {[1,2,3].map(j => <div key={j} style={{ height: 32, background: "var(--surface)", borderRadius: 8, marginBottom: 8 }} />)}
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "80px 0" }}>
          <Users size={40} color="var(--border-2)" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-3)" }}>No users found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {filtered.map(user => (
            <UserCard key={user.id} user={user} onManage={() => openManage(user)} />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }} onClick={() => setModal(null)} />

          <div className="fade-up" style={{ position: "relative", width: "100%", maxWidth: 460, background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: uc(modal.username), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {modal.username[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", margin: 0 }}>{modal.username}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>User management</p>
                </div>
              </div>
              <button onClick={() => setModal(null)} style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={15} color="var(--text-3)" />
              </button>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 4, padding: "14px 20px 0", flexShrink: 0 }}>
              {(["credit", "history"] as const).map(t => (
                <button key={t} onClick={() => switchTab(t)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: modal.tab === t ? "var(--accent)" : "var(--surface)", color: modal.tab === t ? "#fff" : "var(--text-3)", transition: "all 0.15s" }}>
                  {t === "credit" ? "Credit Wallet" : "Transaction History"}
                </button>
              ))}
            </div>

            <div style={{ padding: "16px 20px 20px", overflowY: "auto", flex: 1 }}>

              {/* ── Credit tab ── */}
              {modal.tab === "credit" && (
                <>
                  {/* Step indicator */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {[1, 2].map(s => (
                      <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: creditStep >= s ? "var(--accent)" : "var(--border)", transition: "background 0.2s" }} />
                    ))}
                  </div>

                  {/* Step 1 — Pick coin */}
                  {creditStep === 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {FUNCTIONAL_COINS.map(c => (
                        <button
                          key={`${c.coin}-${c.network}`}
                          onClick={() => setModal({ ...modal, coin: c.coin, network: c.network })}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.12s", textAlign: "left" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                        >
                          <CoinIcon symbol={c.symbol} size={38} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{c.coin}</p>
                            <p style={{ fontSize: 12, color: "var(--text-3)" }}>{c.network}</p>
                          </div>
                          <ChevronRight size={16} color="var(--text-3)" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2 — Enter amount */}
                  {creditStep === 2 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 20 }}>
                        <CoinIcon symbol={FUNCTIONAL_COINS.find(c => c.coin === modal.coin)?.symbol || modal.coin!} size={36} />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{modal.coin} · {modal.network}</p>
                          <p style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>Depositing funds for {modal.username}</p>
                        </div>
                      </div>

                      <label style={{ display: "block", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>
                        Amount ({modal.coin})
                      </label>
                      <input
                        type="number" min="0" step="any"
                        className="input"
                        style={{ marginBottom: error ? 8 : 20, fontSize: 18, fontWeight: 700 }}
                        placeholder="0.00"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && submit()}
                        autoFocus
                      />

                      {error && (
                        <p style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, color: "#ff4d4d", background: "rgba(255,77,77,0.10)", border: "1px solid rgba(255,77,77,0.2)", marginBottom: 16 }}>
                          {error}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => setModal({ ...modal, coin: null, network: null })}
                          style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border-2)", cursor: "pointer" }}
                        >
                          Back
                        </button>
                        <button
                          disabled={submitting || !amount}
                          onClick={submit}
                          style={{ flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 800, background: "var(--accent)", color: "#fff", border: "none", cursor: submitting || !amount ? "not-allowed" : "pointer", opacity: submitting || !amount ? 0.45 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 16px var(--accent-glow)" }}
                        >
                          {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={15} /> Deposit Funds</>}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── History tab ── */}
              {modal.tab === "history" && (
                <div>
                  {histLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                      <Loader2 size={22} className="animate-spin" color="var(--text-3)" />
                    </div>
                  ) : history.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <Clock size={32} color="var(--border-2)" style={{ margin: "0 auto 10px", display: "block" }} />
                      <p style={{ fontSize: 14, color: "var(--text-3)", fontWeight: 600 }}>No transactions yet</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {history.map(tx => (
                        <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 11, background: tx.type === "deposit" ? "rgba(57,217,138,0.1)" : "rgba(255,77,77,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {tx.type === "deposit"
                              ? <ArrowDownCircle size={16} color="#39d98a" />
                              : <ArrowUpCircle size={16} color="#ff4d4d" />
                            }
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>{tx.type}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: cc(tx.coin), background: cc(tx.coin) + "18", padding: "1px 7px", borderRadius: 99 }}>{tx.coin}</span>
                            </div>
                            <p style={{ fontSize: 11.5, color: "var(--text-3)", margin: 0 }}>
                              {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {new Date(tx.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 800, color: tx.type === "deposit" ? "#39d98a" : "#ff4d4d", margin: 0 }}>
                              {tx.type === "deposit" ? "+" : "-"}{tx.amount} {tx.coin}
                            </p>
                            <StatusBadge status={tx.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
