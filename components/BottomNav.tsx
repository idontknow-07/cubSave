"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import ComingSoonModal from "./ComingSoonModal";

export default function BottomNav() {
  const path = usePathname();
  const [coming, setComing] = useState(false);

  const active = (href: string) => path === href;

  return (
    <>
      <nav
        className="glass-nav"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-around",
          height: 64, padding: "0 24px",
          paddingBottom: "max(0px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Home */}
        <Link href="/dashboard" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", padding: "8px 16px" }}>
          <Home size={22} color={active("/dashboard") ? "var(--accent)" : "var(--text-3)"} strokeWidth={active("/dashboard") ? 2.5 : 1.8} />
          <span style={{ fontSize: 10, fontWeight: 700, color: active("/dashboard") ? "var(--accent)" : "var(--text-3)", letterSpacing: "0.02em" }}>Home</span>
        </Link>

        {/* Swap — center raised */}
        <button
          onClick={() => setComing(true)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", marginBottom: 12 }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: "var(--bg)",
            border: "1.5px solid var(--border-2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 18px rgba(21,163,92,0.15), 0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <ArrowLeftRight size={22} color="var(--accent)" strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.02em" }}>Swap</span>
        </button>

        {/* Markets */}
        <Link href="/dashboard/markets" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", padding: "8px 16px" }}>
          <TrendingUp size={22} color={active("/dashboard/markets") ? "var(--accent)" : "var(--text-3)"} strokeWidth={active("/dashboard/markets") ? 2.5 : 1.8} />
          <span style={{ fontSize: 10, fontWeight: 700, color: active("/dashboard/markets") ? "var(--accent)" : "var(--text-3)", letterSpacing: "0.02em" }}>Markets</span>
        </Link>
      </nav>

      {coming && <ComingSoonModal label="Swap" onClose={() => setComing(false)} />}
    </>
  );
}
