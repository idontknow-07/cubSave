"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ClipboardList, CreditCard, LogOut, Menu, X, ShieldCheck, LayoutDashboard, Key } from "lucide-react";
import { useState, useEffect } from "react";

const NAV = [
  { label: "Orders", icon: ClipboardList, href: "/admin/orders" },
  { label: "Credit", icon: CreditCard, href: "/admin/credit" },
  { label: "Connections", icon: Key, href: "/admin/connections" },
  { label: "User Dashboard", icon: LayoutDashboard, href: "/dashboard" },
];

function SidebarContent({ close }: { close?: () => void }) {
  const path = usePathname();
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/transactions?status=pending")
      .then(r => r.json())
      .then(d => {
        if (d.transactions) setPendingCount(d.transactions.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Brand */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--accent)", color: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 12, flexShrink: 0,
            boxShadow: "0 0 16px var(--accent-glow)",
          }}>
            CV
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", lineHeight: 1.2 }}>SecureChain</p>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <ShieldCheck size={10} /> Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding: "16px 12px 8px", flex: 1 }}>
        <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", padding: "0 8px 10px" }}>
          Management
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href} href={href}
                onClick={close}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                  background: active ? "var(--accent-dim)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-2)",
                  fontWeight: 600, fontSize: 14,
                  borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                  transition: "all 0.12s",
                  position: "relative",
                  justifyContent: "space-between",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  {label}
                </div>
                {label === "Orders" && pendingCount > 0 && (
                  <span style={{
                    background: "var(--red)",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 99,
                    boxShadow: "0 2px 4px rgba(240,68,68,0.2)"
                  }}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User + logout */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "12px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
            {user?.username?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.username}</p>
            <p style={{ fontSize: 11, color: "var(--text-3)" }}>Administrator</p>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10, background: "none", border: "none",
            cursor: "pointer", color: "var(--loss)", fontWeight: 700, fontSize: 14,
            transition: "background 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--loss-dim)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
        >
          <LogOut size={16} style={{ flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop — always visible 220px */}
      <aside style={{ width: 220, flexShrink: 0, background: "var(--surface)", borderRight: "1px solid var(--border)", height: "100vh", position: "sticky", top: 0, display: "none", flexDirection: "column" }}
        className="lg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        className="mobile-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
                <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z"/><circle cx="12" cy="11" r="1.9"/><path d="M12 12.9V15.4"/>
              </svg>
            </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>SecureChain</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "var(--accent-dim)", color: "var(--accent)" }}>Admin</span>
        </div>
        <button onClick={() => setOpen(true)} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Menu size={18} color="var(--text)" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }} onClick={() => setOpen(false)} />
          <aside style={{ position: "relative", width: 260, height: "100%", background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
            <button onClick={() => setOpen(false)} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 8, background: "var(--card)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
              <X size={15} color="var(--text-3)" />
            </button>
            <SidebarContent close={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: flex !important; }
          .mobile-topbar { display: none !important; }
        }
      `}</style>
    </>
  );
}
