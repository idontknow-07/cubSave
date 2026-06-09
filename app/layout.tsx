import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SecureChain",
  description: "Your crypto, your control.",
  other: {
    /* Stop iOS Safari from auto-linking email addresses and phone numbers */
    "format-detection": "telephone=no,email=no,address=no",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
