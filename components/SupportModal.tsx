"use client";
import { X, HeadphonesIcon, Mail, MessageSquare } from "lucide-react";

export default function SupportModal({ onClose }: { onClose: () => void }) {
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
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--accent-dim)", border: "1px solid rgba(170,255,71,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <HeadphonesIcon size={28} color="var(--accent)" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>24/7 Support</h3>
        <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 24, lineHeight: 1.6 }}>
          Our team is always here to help you. Reach out to us via email or live chat and we will respond to you shortly.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <a href="mailto:support@cubsave.com" style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", borderRadius: 12, background: "var(--surface)", textDecoration: "none", border: "1px solid var(--border)" }}>
            <Mail size={18} color="var(--text-2)" />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Email Support</p>
              <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>support@cubsave.com</p>
            </div>
          </a>
          <a href="https://wa.me/601165244875" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", borderRadius: 12, background: "var(--surface)", textDecoration: "none", border: "1px solid var(--border)" }}>
            <MessageSquare size={18} color="#25D366" />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>WhatsApp Support</p>
              <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Message us directly</p>
            </div>
          </a>
        </div>

        <button className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
