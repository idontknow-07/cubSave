"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Shield, Palette, Sliders, Info, HeadphonesIcon, Wifi, LogOut, ChevronRight, Eye, EyeOff } from "lucide-react";

type Panel = null | "security" | "theme" | "currency" | "about" | "support" | "wallet";

export default function SettingsDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout, updatePrefs } = useAuth();
  const [panel, setPanel] = useState<Panel>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  const fetchMnemonic = async () => {
    const res = await fetch("/api/auth/mnemonic");
    const data = await res.json();
    setMnemonic(data.mnemonic);
  };

  const menuItems = [
    { icon: Wifi, label: "Wallet Connection", panel: "wallet" as Panel },
    { icon: Shield, label: "Security", panel: "security" as Panel, action: fetchMnemonic },
    { icon: Palette, label: "Theme", panel: "theme" as Panel },
    { icon: Sliders, label: "Preferences", panel: "currency" as Panel },
    { icon: Info, label: "About", panel: "about" as Panel },
    { icon: HeadphonesIcon, label: "Support", panel: "support" as Panel },
  ];

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 12px 24px" }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }} />

      <div
        className="fade-up"
        style={{ position: "relative", width: "100%", maxWidth: 400, background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 24, overflow: "hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{user?.username}</p>
            <p style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color="var(--text-3)" />
          </button>
        </div>

        {/* Content */}
        {panel ? (
          <div style={{ padding: 20 }}>
            <button
              onClick={() => { setPanel(null); setShowMnemonic(false); }}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}
            >
              ← Back
            </button>
            <PanelContent panel={panel} mnemonic={mnemonic} showMnemonic={showMnemonic}
              setShowMnemonic={setShowMnemonic} user={user} updatePrefs={updatePrefs} />
          </div>
        ) : (
          <>
            <div style={{ padding: "8px 8px 0" }}>
              {menuItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => { if (item.action) item.action(); setPanel(item.panel); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 12px", borderRadius: 12, background: "none", border: "none",
                    cursor: "pointer", textAlign: "left", transition: "background 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={16} color="var(--text-2)" />
                  </div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.label}</span>
                  <ChevronRight size={15} color="var(--text-3)" />
                </button>
              ))}
            </div>
            <div style={{ padding: "8px 8px 12px", borderTop: "1px solid var(--border)", marginTop: 4 }}>
              <button
                onClick={logout}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 12px", borderRadius: 12, background: "none", border: "none",
                  cursor: "pointer", transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--loss-dim)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--loss-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LogOut size={16} color="var(--loss)" />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--loss)" }}>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PanelContent({ panel, mnemonic, showMnemonic, setShowMnemonic, user, updatePrefs }: {
  panel: Panel; mnemonic: string | null; showMnemonic: boolean;
  setShowMnemonic: (v: boolean) => void;
  user: { currencyPref: string; theme: string } | null;
  updatePrefs: (p: { currencyPref?: string; theme?: string }) => Promise<void>;
}) {
  if (panel === "security") return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 4 }}>Secret Phrase</p>
      <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.6 }}>
        Never share this. Anyone with this phrase controls your wallet.
      </p>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
        {!showMnemonic ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ filter: "blur(6px)", userSelect: "none", fontSize: 13, color: "var(--text)", marginBottom: 16, lineHeight: 1.8 }}>
              {mnemonic || "word word word word word word word word word word word word"}
            </div>
            <button onClick={() => setShowMnemonic(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 auto", padding: "8px 16px", borderRadius: 8, background: "var(--accent-dim)", border: "1px solid rgba(170,255,71,0.15)", color: "var(--accent)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              <Eye size={14} /> Reveal phrase
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
              {mnemonic?.split(" ").map((word, i) => (
                <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <span style={{ display: "block", fontSize: 10, color: "var(--text-3)", marginBottom: 2 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{word}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowMnemonic(false)}
              style={{ display: "flex", alignItems: "center", gap: 5, margin: "0 auto", fontSize: 12, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
              <EyeOff size={12} /> Hide phrase
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (panel === "theme") return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>Appearance</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ value: "dark", emoji: "🌙", label: "Dark" }, { value: "light", emoji: "☀️", label: "Light" }].map(t => (
          <button key={t.value} onClick={() => updatePrefs({ theme: t.value })}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "18px 12px", borderRadius: 14, cursor: "pointer",
              background: user?.theme === t.value ? "var(--accent-dim)" : "var(--surface)",
              border: user?.theme === t.value ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
              color: user?.theme === t.value ? "var(--accent)" : "var(--text-2)",
              fontWeight: 700, fontSize: 14,
            }}>
            <span style={{ fontSize: 24 }}>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (panel === "currency") return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>Display Currency</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ value: "USD", flag: "🇺🇸", label: "US Dollar" }, { value: "EUR", flag: "🇪🇺", label: "Euro" }].map(c => (
          <button key={c.value} onClick={() => updatePrefs({ currencyPref: c.value })}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              padding: "18px 12px", borderRadius: 14, cursor: "pointer",
              background: user?.currencyPref === c.value ? "var(--accent-dim)" : "var(--surface)",
              border: user?.currencyPref === c.value ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
              color: user?.currencyPref === c.value ? "var(--accent)" : "var(--text-2)",
              fontWeight: 700, fontSize: 13,
            }}>
            <span style={{ fontSize: 24 }}>{c.flag}</span>
            {c.value} · {c.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (panel === "wallet") return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
      <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>Wallet Connection</p>
      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 20 }}>Connect an external wallet to manage assets across chains.</p>
      <button className="btn btn-ghost" style={{ fontSize: 14 }}>Connect Wallet <span style={{ color: "var(--text-3)", fontSize: 12 }}>(Soon)</span></button>
    </div>
  );

  if (panel === "about") return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>About</p>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {[["App", "SecureChain"], ["Version", "1.0.0"], ["Build", "2026"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: "var(--text-3)" }}>{k}</span>
            <span style={{ fontWeight: 700, color: "var(--text)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (panel === "support") return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>Support</p>
      <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.6 }}>Have a question or need help? Reach out to us.</p>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>Email</p>
        <p style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>support@SecureChain.io</p>
      </div>
    </div>
  );

  return null;
}
