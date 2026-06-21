"use client";
import { useState, useEffect, useRef } from "react";
import { X, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InstallPrompt() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const showBanner = () => {
      setShow(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      // Auto-dismiss after 3 seconds
      timerRef.current = setTimeout(() => hideBanner(), 3000);
    };

    if (ios) {
      showBanner();
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      showBanner();
    };
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const hideBanner = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setTimeout(() => setShow(false), 300);
  };

  const goToInstall = () => {
    hideBanner();
    router.push("/install");
  };

  if (!show) return null;

  return (
    <div
      onClick={goToInstall}
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
        cursor: "pointer",
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
          Install CubSave
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--text-2, #51635b)", lineHeight: 1.4 }}>
          {isIOS ? "Tap to see install instructions" : "Add to home screen — tap to install"}
        </p>
      </div>

      <div style={{
        flexShrink: 0, height: 30, padding: "0 10px",
        background: "#15a35c", color: "#fff",
        border: "none", borderRadius: 8,
        fontSize: 12, fontWeight: 700,
        display: "flex", alignItems: "center", gap: 4,
      }}
        onClick={e => { e.stopPropagation(); goToInstall(); }}
      >
        <Download size={12} strokeWidth={2.5} />
        Install
      </div>

      <button
        onClick={e => { e.stopPropagation(); hideBanner(); }}
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
