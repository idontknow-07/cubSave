"use client";
import { useState } from "react";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Palette, Sliders, Shield, Info, HeadphonesIcon,
  Eye, EyeOff, ChevronRight, Moon, Sun, DollarSign, Euro, ChevronLeft,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout, updatePrefs } = useAuth();
  const [panel, setPanel] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [showPhrase, setShowPhrase] = useState(false);

  const fetchMnemonic = async () => {
    if (mnemonic) return;
    const res = await fetch("/api/auth/mnemonic");
    const data = await res.json();
    setMnemonic(data.mnemonic);
  };

  type SettingItem = { icon: React.ElementType; label: string; sub: string; key: string; action?: () => void };
  const SECTIONS: { title: string; items: SettingItem[] }[] = [
    {
      title: "Preferences",
      items: [
        { icon: Palette, label: "Theme", sub: user?.theme === "light" ? "Light mode" : "Dark mode", key: "theme" },
        { icon: Sliders, label: "Currency", sub: user?.currencyPref || "USD", key: "currency" },
      ],
    },
    {
      title: "Security",
      items: [
        { icon: Shield, label: "Secret Phrase", sub: "View your recovery words", key: "phrase", action: fetchMnemonic },
      ],
    },
    {
      title: "About",
      items: [
        { icon: Info, label: "About App", sub: "CubSave v1.0", key: "about" },
        { icon: HeadphonesIcon, label: "Support", sub: "Get help", key: "support" },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 80px", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>Settings</h1>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>Manage your preferences and account</p>
      </div>

      {/* Profile card */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--accent)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, flexShrink: 0 }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{user?.username}</p>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
        </div>
      </div>

      {/* Settings sections */}
      {panel === null ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {SECTIONS.map(({ title, items }) => (
            <div key={title}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", marginBottom: 8, paddingLeft: 4 }}>{title}</p>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
                {items.map((item, i) => (
                  <button
                    key={item.key}
                    onClick={() => { if (item.action) item.action(); setPanel(item.key); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 14,
                      padding: "15px 18px", background: "none", border: "none", cursor: "pointer",
                      borderTop: i > 0 ? "1px solid var(--border)" : "none",
                      transition: "background 0.12s", textAlign: "left",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card-hover)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <item.icon size={17} color="var(--text-2)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 1 }}>{item.sub}</p>
                    </div>
                    <ChevronRight size={15} color="var(--text-3)" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Sign out */}
          <button
            onClick={logout}
            style={{
              width: "100%", padding: "15px 18px", borderRadius: 14,
              background: "var(--loss-dim)", border: "1px solid rgba(255,77,77,0.2)",
              color: "var(--loss)", fontWeight: 700, fontSize: 14,
              cursor: "pointer", transition: "opacity 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => { setPanel(null); setShowPhrase(false); }}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", marginBottom: 24 }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {panel === "theme" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>Appearance</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {([{ value: "dark", Icon: Moon, label: "Dark" }, { value: "light", Icon: Sun, label: "Light" }] as { value: string; Icon: React.ElementType; label: string }[]).map(t => (
                  <button key={t.value} onClick={() => updatePrefs({ theme: t.value })}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                      padding: "24px 16px", borderRadius: 16, cursor: "pointer",
                      background: user?.theme === t.value ? "var(--accent-dim)" : "var(--card)",
                      border: user?.theme === t.value ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                      color: user?.theme === t.value ? "var(--accent)" : "var(--text-2)",
                      fontWeight: 700, fontSize: 15, transition: "all 0.15s",
                    }}>
                    <t.Icon size={28} />
                    {t.label}
                    {user?.theme === t.value && (
                      <span style={{ fontSize: 11, color: "var(--accent)" }}>Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === "currency" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>Display Currency</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {([{ value: "USD", Icon: DollarSign, label: "US Dollar" }, { value: "EUR", Icon: Euro, label: "Euro" }] as { value: string; Icon: React.ElementType; label: string }[]).map(c => (
                  <button key={c.value} onClick={() => updatePrefs({ currencyPref: c.value })}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                      padding: "24px 16px", borderRadius: 16, cursor: "pointer",
                      background: user?.currencyPref === c.value ? "var(--accent-dim)" : "var(--card)",
                      border: user?.currencyPref === c.value ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                      color: user?.currencyPref === c.value ? "var(--accent)" : "var(--text-2)",
                      fontWeight: 700, fontSize: 14, transition: "all 0.15s",
                    }}>
                    <c.Icon size={28} />
                    {c.value} · {c.label}
                    {user?.currencyPref === c.value && (
                      <span style={{ fontSize: 11, color: "var(--accent)" }}>Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {panel === "phrase" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 6 }}>Secret Recovery Phrase</p>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 20 }}>
                Never share this with anyone. Anyone with this phrase can access your wallet.
              </p>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
                {!showPhrase ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ filter: "blur(6px)", userSelect: "none", fontSize: 13, color: "var(--text)", marginBottom: 20, lineHeight: 1.9 }}>
                      {mnemonic || "word word word word word word word word word word word word"}
                    </div>
                    <button onClick={() => setShowPhrase(true)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "var(--accent-dim)", border: "1px solid rgba(170,255,71,0.2)", color: "var(--accent)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      <Eye size={14} /> Reveal phrase
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                      {mnemonic?.split(" ").map((word, i) => (
                        <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ display: "block", fontSize: 10, color: "var(--text-3)", marginBottom: 3 }}>{i + 1}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{word}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setShowPhrase(false)}
                      style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 auto", fontSize: 12, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}>
                      <EyeOff size={13} /> Hide phrase
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {panel === "about" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>About</p>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "4px 0" }}>
                {[["App", "CubSave"], ["Version", "1.0.0"], ["Build", "2026"]].map(([k, v], i) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ fontSize: 14, color: "var(--text-3)" }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel === "support" && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 16 }}>Support</p>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px" }}>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 16 }}>
                  Have a question or need help? Reach out to our support team.
                </p>
                <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>Email</p>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--accent)" }}>support@CubSave.io</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
