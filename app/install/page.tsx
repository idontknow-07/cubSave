"use client";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import {
  ArrowLeft, Download, Share2, Plus, Monitor,
  CheckCircle2, Smartphone, Zap, WifiOff, Bell, Info,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Platform = "ios" | "android" | "desktop";

const LOGO = (size: number) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z" />
    <circle cx="12" cy="11" r="1.9" />
    <path d="M12 12.9V15.4" />
  </svg>
);

const BENEFITS = [
  { Icon: Zap, title: "Instant Access", sub: "One tap from your home screen — no browser bar" },
  { Icon: WifiOff, title: "Works Offline", sub: "View balances and history without internet" },
  { Icon: Bell, title: "Push Notifications", sub: "Get alerted on every deposit and transaction" },
];

const IOS_STEPS = [
  { title: "Open in Safari", body: "Make sure you're using Safari — Chrome and Firefox don't support this on iOS." },
  { title: "Tap the Share button", body: "At the bottom center of Safari, tap the square with an arrow pointing up." },
  { title: 'Tap "Add to Home Screen"', body: "Scroll down in the share sheet and select this option." },
  { title: "Confirm with Add", body: 'Tap "Add" in the top right corner. CubSave will appear on your home screen.' },
];

const ANDROID_STEPS = [
  { title: "Open Chrome menu", body: 'Tap the three-dot menu (⋮) in the top right corner of Chrome.' },
  { title: "Tap Add to Home screen", body: 'Select "Add to Home screen" or "Install App" from the menu.' },
  { title: "Confirm", body: 'Tap "Add" or "Install" to confirm. The app will appear on your home screen.' },
];

const DESKTOP_STEPS = [
  { title: "Look for the install icon", body: "In Chrome or Edge, look for a computer icon (⊕) in the address bar on the right." },
  { title: "Click Install", body: 'Click the icon and select "Install CubSave" from the popup.' },
  { title: "Open from desktop", body: "The app will appear in your applications and run like a native app." },
];

function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {steps.map(({ title, body }, i) => (
        <div key={i} style={{ display: "flex", gap: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11,
            background: "linear-gradient(135deg,#15a35c,#047857)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 14, color: "#fff", flexShrink: 0,
            boxShadow: "0 4px 12px rgba(21,163,92,0.25)",
          }}>
            {i + 1}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#0a1f17", marginBottom: 4 }}>{title}</p>
            <p style={{ fontSize: 13.5, color: "#51635b", lineHeight: 1.6 }}>{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InstallPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("ios");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) setPlatform("ios");
    else if (/Android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") { setInstalled(true); setDeferredPrompt(null); }
  };

  if (isStandalone) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f4faf6", padding: 32, textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 12px 40px rgba(21,163,92,0.3)" }}>
          {LOGO(38)}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0a1f17", marginBottom: 10 }}>Already Installed</h1>
        <p style={{ fontSize: 15, color: "#51635b", marginBottom: 32 }}>CubSave is running as an installed app.</p>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: "#15a35c", color: "#fff", fontWeight: 800, fontSize: 15, textDecoration: "none", boxShadow: "0 8px 24px rgba(21,163,92,0.3)" }}>
          Open Dashboard
        </Link>
      </div>
    );
  }

  const platformSteps = platform === "ios" ? IOS_STEPS : platform === "android" ? ANDROID_STEPS : DESKTOP_STEPS;
  const canNativeInstall = deferredPrompt && (platform === "android" || platform === "desktop");

  return (
    <div style={{ minHeight: "100dvh", background: "#f4faf6", fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4efe9", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, background: "#f4faf6", border: "1px solid #e4efe9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={16} color="#51635b" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {LOGO(14)}
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#0a1f17" }}>CubSave</span>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 26,
            background: "linear-gradient(135deg,#15a35c,#047857)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 12px 40px rgba(21,163,92,0.32)",
          }}>
            {LOGO(42)}
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0a1f17", letterSpacing: "-0.02em", marginBottom: 12 }}>
            Install CubSave
          </h1>
          <p style={{ fontSize: 15, color: "#51635b", lineHeight: 1.65, maxWidth: 340, margin: "0 auto" }}>
            Add to your home screen for instant access, full-screen mode, and a native app experience.
          </p>
        </div>

        {/* Benefits */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 32 }}>
          {BENEFITS.map(({ Icon, title, sub }) => (
            <div key={title} style={{ background: "#fff", border: "1px solid #e4efe9", borderRadius: 16, padding: "16px 12px", textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(21,163,92,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                <Icon size={18} color="#15a35c" />
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 800, color: "#0a1f17", marginBottom: 4 }}>{title}</p>
              <p style={{ fontSize: 11, color: "#7b8c84", lineHeight: 1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Platform switcher */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, background: "#fff", border: "1px solid #e4efe9", borderRadius: 14, padding: 4 }}>
          {([["ios", "iPhone / iPad", Smartphone], ["android", "Android", Download], ["desktop", "Desktop", Monitor]] as [Platform, string, React.ElementType][]).map(([p, label, Icon]) => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "9px 4px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
                background: platform === p ? "#15a35c" : "transparent",
                color: platform === p ? "#fff" : "#7b8c84",
                transition: "all 0.15s",
              }}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Install action */}
        {canNativeInstall && !installed && (
          <button
            onClick={handleInstall}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "16px 24px", borderRadius: 16, marginBottom: 28,
              background: "linear-gradient(135deg,#15a35c,#047857)",
              color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer",
              boxShadow: "0 8px 32px rgba(21,163,92,0.35)",
              transition: "all 0.15s",
            }}
          >
            <Download size={20} strokeWidth={2.5} />
            Install Now
          </button>
        )}

        {installed && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px 20px", borderRadius: 16, marginBottom: 28,
            background: "rgba(21,163,92,0.08)", border: "1.5px solid rgba(21,163,92,0.25)",
          }}>
            <CheckCircle2 size={22} color="#15a35c" />
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#0a1f17" }}>Installed successfully!</p>
              <p style={{ fontSize: 13, color: "#51635b" }}>Open CubSave from your home screen.</p>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ background: "#fff", border: "1px solid #e4efe9", borderRadius: 20, padding: "24px 22px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7b8c84", marginBottom: 22 }}>
            {canNativeInstall ? "Or install manually" : "How to install"}
          </p>
          <StepList steps={platformSteps} />

          {platform === "ios" && (
            <div style={{ background: "#f0f5f2", border: "1px solid #c8e8d5", borderRadius: 12, padding: "12px 14px", marginTop: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Info size={15} color="#15a35c" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12.5, color: "#15a35c", fontWeight: 600, lineHeight: 1.5 }}>
                iOS only supports installation through Safari. If this doesn't work, open this page in Safari first.
              </p>
            </div>
          )}
        </div>

        {/* Sign up CTA */}
        <div style={{ background: "linear-gradient(135deg,#15a35c,#047857)", borderRadius: 20, padding: "24px", textAlign: "center" }}>
          <p style={{ fontWeight: 900, fontSize: 18, color: "#fff", marginBottom: 8 }}>Ready to get started?</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", marginBottom: 20, lineHeight: 1.6 }}>
            Create your account and take control of your crypto.
          </p>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, background: "#fff", color: "#15a35c", fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
