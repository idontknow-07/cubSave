"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Copy, Eye, EyeOff, CheckCircle2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

type Profile = {
  id: string; email: string; username: string;
  country: string | null; phone: string | null;
  mnemonic: string; emailVerified: boolean; idVerified: boolean;
};

function Row({ label, value, copyable, mono }: { label: string; value: string; copyable?: boolean; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", borderRadius: 12, padding: "13px 14px", border: "1px solid var(--border)" }}>
        <p style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--text)", fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all", margin: 0 }}>
          {value || "—"}
        </p>
        {copyable && (
          <button onClick={copy} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: copied ? "var(--accent)" : "var(--text-3)", padding: 4, display: "flex" }}>
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => { if (d.user) setProfile(d.user); })
      .finally(() => setLoading(false));
  }, []);

  const displayId = profile ? "SC" + profile.id.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() : "";

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: "max(88px, calc(64px + env(safe-area-inset-bottom)))" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px", borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={17} color="var(--text-2)" />
        </button>
        <h1 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", margin: 0 }}>Profile</h1>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 520, margin: "0 auto" }}>
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 10 }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: 0 }}>{user?.username}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {profile?.emailVerified && (
              <span style={{ fontSize: 11, fontWeight: 700, background: "var(--gain-dim)", color: "var(--gain)", borderRadius: 6, padding: "3px 8px" }}>Email Verified</span>
            )}
            {profile?.idVerified && (
              <span style={{ fontSize: 11, fontWeight: 700, background: "var(--gain-dim)", color: "var(--gain)", borderRadius: 6, padding: "3px 8px" }}>ID Verified</span>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--accent)", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : profile && (
          <>
            <Row label="User ID" value={displayId} copyable mono />
            <Row label="Username" value={profile.username} copyable />
            <Row label="Email" value={profile.email} copyable />
            <Row label="Country" value={profile.country || "Not set"} />
            <Row label="Mobile Number" value={profile.phone || "Not set"} copyable={!!profile.phone} />

            {/* Mnemonic */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Mnemonic Phrase</p>
              <div style={{ background: showMnemonic ? "#fffbeb" : "var(--surface)", border: `1px solid ${showMnemonic ? "#fde68a" : "var(--border)"}`, borderRadius: 12, padding: "14px", position: "relative" }}>
                {showMnemonic ? (
                  <>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", lineHeight: 1.8, fontFamily: "monospace", margin: "0 0 10px", wordBreak: "break-word" }}>
                      {profile.mnemonic}
                    </p>
                    <button onClick={() => { navigator.clipboard.writeText(profile.mnemonic); }} style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Copy phrase
                    </button>
                  </>
                ) : (
                  <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0, letterSpacing: "0.2em" }}>{'• '.repeat(12).trim()}</p>
                )}
                <button
                  onClick={() => setShowMnemonic(s => !s)}
                  style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex" }}
                >
                  {showMnemonic ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ fontSize: 11, color: "var(--loss)", fontWeight: 600, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertTriangle size={12} /> Never share this phrase with anyone.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
