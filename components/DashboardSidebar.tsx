"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, TrendingUp, Clock, Settings2,
  LogOut, User, Menu, X, Link2, ShieldCheck, HeadphonesIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import WalletConnectModal from "./WalletConnectModal";
import SupportModal from "./SupportModal";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", exact: true },
  { icon: TrendingUp,       label: "Markets",   href: "/dashboard/markets", exact: false },
  { icon: Clock,            label: "Activity",  href: "/dashboard/history", exact: false },
  { icon: User,             label: "Profile",   href: "/dashboard/profile", exact: false },
  { icon: Settings2,        label: "Settings",  href: "/dashboard/settings", exact: false },
];

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
    <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z"/><circle cx="12" cy="11" r="1.9"/><path d="M12 12.9V15.4"/>
  </svg>
);

function NavItems({ onNav, path }: { onNav?: () => void; path: string }) {
  const { user, logout } = useAuth();
  const [walletOpen, setWalletOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

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

        <button onClick={() => setWalletOpen(true)}
          style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 13, padding: "12px 13px", borderRadius: 11, background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-2)", fontWeight: 700, fontSize: 14.5, width: "100%", textAlign: "left" }}>
          <Link2 size={18} style={{ flexShrink: 0 }} />
          Wallet Connect
        </button>

        <button onClick={() => setSupportOpen(true)}
          style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 13, padding: "12px 13px", borderRadius: 11, background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-2)", fontWeight: 700, fontSize: 14.5, width: "100%", textAlign: "left" }}>
          <HeadphonesIcon size={18} style={{ flexShrink: 0 }} />
          Support
        </button>

        {user?.role === "admin" && (
          <Link href="/admin/orders" onClick={onNav}
            style={{
              marginTop: 10, display: "flex", alignItems: "center", gap: 13,
              padding: "11px 13px", borderRadius: 11, textDecoration: "none",
              background: "transparent",
              color: "var(--accent)",
              fontWeight: 600, fontSize: 14.5,
              borderLeft: "2px solid transparent",
              transition: "all 0.12s",
            }}>
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            Admin Panel
          </Link>
        )}
      </nav>

      <div style={{ borderTop: "1px solid var(--border)", padding: "10px 12px 14px" }}>
        <button onClick={() => { logout(); onNav?.(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "11px 13px", borderRadius: 11, background: "none", border: "none", cursor: "pointer", color: "var(--loss)", fontWeight: 700, fontSize: 14.5 }}>
          <LogOut size={18} style={{ flexShrink: 0 }} />
          Sign Out
        </button>
      </div>

      {walletOpen && <WalletConnectModal onClose={() => setWalletOpen(false)} />}
      {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}
    </>
  );
}

export default function DashboardSidebar() {
  const { user } = useAuth();
  const path = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setDrawerOpen(false); }, [path]);
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

      {/* ── Mobile hamburger — fixed RIGHT ──────── */}
      <button className="cv-hamburger"
        onClick={() => setDrawerOpen(true)}
        style={{ position: "fixed", top: "max(14px, calc(env(safe-area-inset-top, 0px) + 14px))", right: 14, zIndex: 40, width: 38, height: 38, borderRadius: 11, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <Menu size={20} color="var(--text)" />
      </button>

      {/* ── Mobile drawer — slides from RIGHT ───── */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, WebkitBackdropFilter: "blur(2px)", backdropFilter: "blur(2px)" }} />

          <div style={{
            position: "fixed", top: 0, left: 0, bottom: 0,
            width: "82%", maxWidth: 300,
            background: "var(--bg)", zIndex: 60,
            display: "flex", flexDirection: "column",
            boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
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
