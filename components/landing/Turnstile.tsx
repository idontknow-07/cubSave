import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile (Privacy-focused reCAPTCHA alternative)
 *
 * SETUP:
 * 1. Get a free key pair at https://dash.cloudflare.com/?to=/:account/turnstile
 * 2. Paste your SITE key below (public).
 * 3. Keep your SECRET key on your backend only.
 *
 * The default key below is Cloudflare's official "Always Pass" TEST key.
 * Replace it before going live.
 */
const SITE_KEY = "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: string | HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

interface TurnstileProps {
  onChange: (token: string | null) => void;
}

export default function Turnstile({ onChange }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    function renderWidget() {
      if (!container.current || !window.turnstile || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: SITE_KEY,
        callback: (token) => onChange(token),
        "expired-callback": () => onChange(null),
        "error-callback": () => onChange(null),
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const id = "turnstile-script";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.onload = renderWidget;
        document.head.appendChild(s);
      }
    }

    return () => {
      // Optional: cleanup
    };
  }, [onChange]);

  return <div ref={container} className="mb-5" />;
}
