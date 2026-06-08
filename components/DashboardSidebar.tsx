"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Send, TrendingUp, Clock, Settings2,
  LogOut, Download, ArrowLeftRight,
} from "lucide-react";
import { useState } from "react";
import ComingSoonModal from "./ComingSoonModal";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", exact: true },
  { icon: Send, label: "Send", href: "/dashboard/withdraw", exact: false },
  { icon: TrendingUp, label: "Markets", href: "/dashboard/markets", exact: false },
  { icon: Clock, label: "Activity", href: "/dashboard/history", exact: false },
  { icon: Settings2, label: "Settings", href: "/dashboard/settings", exact: false },
];
const WITHDRAW_RETURN_KEY = "cv_withdraw_return_to";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const path = usePathname();
  const [swapOpen, setSwapOpen] = useState(false);

  const rememberWithdrawReturn = () => {
    const returnTo = path && !path.startsWith("/dashboard/withdraw") ? path : "/dashboard";
    window.sessionStorage.setItem(WITHDRAW_RETURN_KEY, returnTo);
  };

  return (
    <>
      <aside
        className="cv-desktop-sidebar"
        style={{
          width: 240, flexShrink: 0,
          borderRight: "1px solid var(--border)",
          display: "none", flexDirection: "column",
          height: "100vh", overflowY: "auto",
          background: "var(--surface)",
        }}
      >
        {/* Brand + profile */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "var(--accent)", color: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 11, flexShrink: 0,
              boxShadow: "0 0 12px var(--accent-glow)",
            }}>CV</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.01em" }}>VaultChain</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--accent)", color: "#000",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14, flexShrink: 0,
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.username}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", padding: "0 10px 10px" }}>
            Menu
          </p>
          {NAV.map(({ icon: Icon, label, href, exact }) => {
            const active = exact ? path === href : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={label === "Send" ? rememberWithdrawReturn : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                  background: active ? "var(--accent-dim)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-2)",
                  fontWeight: active ? 700 : 600, fontSize: 14,
                  borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "var(--card)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; } }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            );
          })}

          {/* Deposit CTA */}
          <Link
            href="/dashboard/deposit"
            style={{
              marginTop: 12,
              display: "flex", alignItems: "center", gap: 12,
              textDecoration: "none",
              padding: "11px 12px", borderRadius: 10,
              background: "var(--accent-dim)", border: "1px solid rgba(21,163,92,0.18)",
              cursor: "pointer", color: "var(--accent)",
              fontWeight: 700, fontSize: 14, transition: "all 0.12s",
              width: "100%",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(21,163,92,0.14)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px var(--accent-glow)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <Download size={17} style={{ flexShrink: 0 }} />
            Deposit Assets
          </Link>

          {/* Swap CTA */}
          <button
            onClick={() => setSwapOpen(true)}
            style={{
              marginTop: 6,
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 12px", borderRadius: 10,
              background: "transparent", border: "1px solid var(--border)",
              cursor: "pointer", color: "var(--text-2)",
              fontWeight: 700, fontSize: 14, transition: "all 0.12s",
              width: "100%", textAlign: "left",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--card)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
          >
            <ArrowLeftRight size={17} style={{ flexShrink: 0 }} />
            Swap
          </button>
        </nav>

        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--border)", padding: "10px 12px 14px" }}>
          <p style={{ fontSize: 11, color: "var(--text-3)", padding: "6px 12px 8px" }}>VaultChain v1.0</p>
          <button
            onClick={logout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--loss)", fontWeight: 700, fontSize: 13,
              transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--loss-dim)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
          >
            <LogOut size={15} style={{ flexShrink: 0 }} />
            Sign Out
          </button>
        </div>
      </aside>

      <style>{`
        @media (min-width: 900px) { .cv-desktop-sidebar { display: flex !important; } }
      `}</style>

      {swapOpen && <ComingSoonModal label="Swap" onClose={() => setSwapOpen(false)} />}
    </>
  );
}
