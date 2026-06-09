"use client";
import { useState, useEffect } from "react";
import { X, Share, Download } from "lucide-react";

const DISMISSED_KEY = "sc_pwa_dismissed";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // User dismissed before
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") dismiss();
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      margin: "12px 16px 0",
      background: "#ffffff",
      border: "1.5px solid #c8e8d5",
      borderRadius: 16,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 2px 12px rgba(21,163,92,0.10)",
      position: "relative",
    }}>
      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: "linear-gradient(135deg,#15a35c,#047857)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" /><circle cx="12" cy="11" r="1.9" /><path d="M12 12.9V15.4" />
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#0a1f17", lineHeight: 1.3 }}>
          Install SecureChain
        </p>
        {isIOS ? (
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#51635b", lineHeight: 1.4 }}>
            Tap <strong style={{ color: "#15a35c" }}>Share</strong> → <strong style={{ color: "#15a35c" }}>Add to Home Screen</strong>
          </p>
        ) : (
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#51635b", lineHeight: 1.4 }}>
            Get the app — faster access, no browser bar
          </p>
        )}
      </div>

      {/* Install button (Android) */}
      {!isIOS && (
        <button
          onClick={install}
          style={{
            flexShrink: 0,
            height: 34, padding: "0 14px",
            background: "#15a35c", color: "#fff",
            border: "none", borderRadius: 9,
            fontSize: 12.5, fontWeight: 700,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <Download size={13} strokeWidth={2.5} />
          Install
        </button>
      )}

      {/* Dismiss */}
      <button
        onClick={dismiss}
        style={{
          flexShrink: 0, background: "none", border: "none",
          cursor: "pointer", color: "#9db5a8", padding: 4,
          display: "flex", alignItems: "center",
          marginLeft: isIOS ? 0 : -4,
        }}
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
