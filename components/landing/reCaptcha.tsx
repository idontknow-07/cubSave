import { useEffect, useRef } from "react";

/**
 * Google reCAPTCHA v2 ("I'm not a robot" checkbox).
 *
 * SETUP:
 * 1. Get a free key pair at https://www.google.com/recaptcha/admin
 *    (choose "reCAPTCHA v2" → "I'm not a robot Checkbox", add your domain;
 *     for local dev add "localhost").
 * 2. Paste your SITE key below (the site key is public — safe to ship).
 * 3. Keep your SECRET key on your backend only, and verify the token there
 *    by POSTing to https://www.google.com/recaptcha/api/siteverify.
 *
 * The default key below is Google's official TEST key: it always passes and
 * shows a "for testing only" notice. Replace it before going live.
 */
const SITE_KEY = "6LcpNQ0tAAAAADCPecxiKvvhFI8-9GeX3Fjvk99u";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      reset: (id?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
}

export default function ReCaptcha({ onChange }: ReCaptchaProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    function renderWidget() {
      if (!container.current || !window.grecaptcha || widgetId.current !== null) return;
      widgetId.current = window.grecaptcha.render(container.current, {
        sitekey: SITE_KEY,
        callback: (token) => onChange(token),
        "expired-callback": () => onChange(null),
        "error-callback": () => onChange(null),
      });
    }

    if (window.grecaptcha) {
      renderWidget();
    } else {
      window.onRecaptchaLoad = renderWidget;
      const id = "recaptcha-script";
      if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
      }
    }
  }, [onChange]);

  return <div ref={container} className="mb-5" />;
}