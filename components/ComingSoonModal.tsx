"use client";
import { X } from "lucide-react";

export default function ComingSoonModal({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 16px 24px" }}
      className="ios-modal-pb"
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }} />
      <div
        className="fade-up"
        style={{ position: "relative", width: "100%", maxWidth: 400, background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 24, padding: 28, textAlign: "center" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "var(--surface)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={16} color="var(--text-3)" />
        </button>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--accent-dim)", border: "1px solid rgba(170,255,71,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>
          🚀
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{label} Coming Soon</h3>
        <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 24, lineHeight: 1.6 }}>
          We&apos;re building something great. Stay tuned.
        </p>
        <button className="btn btn-primary" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}
