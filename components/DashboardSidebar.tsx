"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Send, TrendingUp, Clock, Settings2,
  LogOut, Download, ArrowLeftRight, User, Menu, X, Link2,
} from "lucide-react";
import { useState, useEffect } from "react";
import ComingSoonModal from "./ComingSoonModal";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", exact: true },
  { icon: TrendingUp,       label: "Markets",   href: "/dashboard/markets", exact: false },
  { icon: Clock,            label: "Activity",  href: "/dashboard/history", exact: false },
  { icon: User,             label: "Profile",   href: "/dashboard/profile", exact: false },
  { icon: Settings2,        label: "Settings",  href: "/dashboard/settings", exact: false },
];
const WITHDRAW_RETURN_KEY = "cv_withdraw_return_to";

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
    <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z"/><circle cx="12" cy="11" r="1.9"/><path d="M12 12.9V15.4"/>
  </svg>
);

function NavItems({ onNav, path }: { onNav?: () => void; path: string }) {
  const { logout } = useAuth();
  const [swapOpen, setSwapOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const rememberReturn = () => {
    const returnTo = path && !path.startsWith("/dashboard/withdraw") ? path : "/dashboard";
    window.sessionStorage.setItem(WITHDRAW_RETURN_KEY, returnTo);
  };

  return (
    <>
      <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        {NAV.map(({ icon: Icon, label, href, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNav}
              style={{
                display: "flex", alignItems: "center", gap: 13,
                padding: "11px 13px", borderRadius: 11, textDecoration: "none",
                background: active ? "var(--accent-dim)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-2)",
                fontWeight: active ? 700 : 600, fontSize: 14.5,
                borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                transition: "all 0.12s",
              }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}

        <Link href="/dashboard/deposit" onClick={onNav}
          style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 13, textDecoration: "none", padding: "12px 13px", borderRadius: 11, background: "var(--accent-dim)", border: "1px solid rgba(21,163,92,0.18)", color: "var(--accent)", fontWeight: 700, fontSize: 14.5 }}>
          <Download size={18} style={{ flexShrink: 0 }} />
          Deposit
        </Link>

        <Link href="/dashboard/withdraw" onClick={() => { rememberReturn(); onNav?.(); }}
          style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 13, textDecoration: "none", padding: "12px 13px", borderRadius: 11, background: "transparent", border: "1px solid var(--border)", color: "var(--text-2)", fontWeight: 700, fontSize: 14.5 }}>
          <Send size={18} style={{ flexShrink: 0 }} />
          Send
        </Link>

        <button onClick={() => setSwapOpen(true)}
          style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 13, padding: "12px 13px", borderRadius: 11, background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-2)", fontWeight: 700, fontSize: 14.5, width: "100%", textAlign: "left" }}>
          <ArrowLeftRight size={18} style={{ flexShrink: 0 }} />
          Swap
        </button>

        <button onClick={() => setWalletOpen(true)}
          style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 13, padding: "12px 13px", borderRadius: 11, background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-2)", fontWeight: 700, fontSize: 14.5, width: "100%", textAlign: "left" }}>
          <Link2 size={18} style={{ flexShrink: 0 }} />
          Wallet Connect
        </button>
      </nav>

      <div style={{ borderTop: "1px solid var(--border)", padding: "10px 12px 14px" }}>
        <button onClick={() => { logout(); onNav?.(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "11px 13px", borderRadius: 11, background: "none", border: "none", cursor: "pointer", color: "var(--loss)", fontWeight: 700, fontSize: 14.5 }}>
          <LogOut size={18} style={{ flexShrink: 0 }} />
          Sign Out
        </button>
      </div>

      {swapOpen && <ComingSoonModal label="Swap" onClose={() => setSwapOpen(false)} />}
      {walletOpen && <ComingSoonModal label="Wallet Connect" onClose={() => setWalletOpen(false)} />}
    </>
  );
}

export default function DashboardSidebar() {
  const { user } = useAuth();
  const path = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [path]);
  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────── */}
      <aside className="cv-desktop-sidebar"
        style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--border)", display: "none", flexDirection: "column", height: "100vh", overflowY: "auto", background: "var(--surface)" }}>
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {LOGO_SVG}
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", letterSpacing: "-0.01em" }}>SecureChain</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff", flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{user?.username}</p>
              <p style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{user?.email}</p>
            </div>
          </div>
        </div>
        <NavItems path={path} />
      </aside>

      {/* ── Mobile hamburger button ──────────────── */}
      <button className="cv-hamburger"
        onClick={() => setDrawerOpen(true)}
        style={{ position: "fixed", top: 14, left: 14, zIndex: 40, width: 38, height: 38, borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <Menu size={20} color="var(--text)" />
      </button>

      {/* ── Mobile drawer overlay ────────────────── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, backdropFilter: "blur(2px)" }} />

          {/* Drawer panel */}
          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0,
            width: "82%", maxWidth: 300,
            background: "var(--bg)", zIndex: 60,
            display: "flex", flexDirection: "column",
            boxShadow: "4px 0 32px rgba(0,0,0,0.15)",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}>
            {/* Drawer header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 16px 14px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {LOGO_SVG}
                </div>
                <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>SecureChain</span>
              </div>
              <button onClick={() => setDrawerOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 9, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} color="var(--text-2)" />
              </button>
            </div>

            {/* User info */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#fff", flexShrink: 0 }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.username}</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
              </div>
            </div>

            <NavItems path={path} onNav={() => setDrawerOpen(false)} />
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 900px) {
          .cv-desktop-sidebar { display: flex !important; }
          .cv-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
