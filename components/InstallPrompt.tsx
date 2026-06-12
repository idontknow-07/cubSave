"use client";
import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";


const DISMISSED_KEY = "sc_pwa_dismissed";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const show = () => {
      setShow(true);
      // Animate in after mount
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      // Auto-dismiss after 3s
      setTimeout(() => dismiss(), 3000);
    };

    if (ios) { show(); return; }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      show();
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
    setVisible(false);
    setTimeout(() => {
      localStorage.setItem(DISMISSED_KEY, "1");
      setShow(false);
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: `calc(env(safe-area-inset-bottom, 0px) + 76px)`,
        left: 16, right: 16,
        zIndex: 45,
        background: "var(--surface, #fff)",
        border: "1.5px solid var(--border-2, #c8e8d5)",
        borderRadius: 16,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 11,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: "linear-gradient(135deg,#15a35c,#047857)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" /><circle cx="12" cy="11" r="1.9" /><path d="M12 12.9V15.4" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text, #0a1f17)", lineHeight: 1.3 }}>
          Install SecureChain
        </p>
        {isIOS ? (
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--text-2, #51635b)", lineHeight: 1.4 }}>
            Tap <strong style={{ color: "#15a35c" }}>Share</strong> → <strong style={{ color: "#15a35c" }}>Add to Home Screen</strong>
          </p>
        ) : (
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--text-2, #51635b)", lineHeight: 1.4 }}>
            Get faster access — no browser bar
          </p>
        )}
      </div>

      {!isIOS && (
        <button
          onClick={install}
          style={{
            flexShrink: 0, height: 32, padding: "0 12px",
            background: "#15a35c", color: "#fff",
            border: "none", borderRadius: 9,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}
        >
          <Download size={12} strokeWidth={2.5} />
          Install
        </button>
      )}

      <button
        onClick={dismiss}
        style={{
          flexShrink: 0, background: "none", border: "none",
          cursor: "pointer", color: "var(--text-3, #9db5a8)", padding: 4,
          display: "flex", alignItems: "center",
        }}
      >
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  );
}
