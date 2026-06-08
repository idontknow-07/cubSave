"use client";

import { PLATFORM_ROWS } from "@/lib/landing-data";
import { Btn } from "./ui";
import SplitSection from "./SplitSection";

export default function Platform() {
  return (
    <SplitSection
      id="platform"
      eyebrow="Simple. Seamless."
      title="A smooth experience on every device."
      intro="Powerful, easy-to-use tools across mobile and desktop support your entire trading journey — from your first deposit to advanced order types."
      rows={PLATFORM_ROWS}
      cta={<Btn primary to="/signup">Get started with deposits</Btn>}
      glyph={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-[140px] h-[140px]">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M6 6h12M6 18h12" opacity=".4" />
          <path d="M9 11l2 2 4-4" strokeWidth="1.6" />
        </svg>
      }
    />
  );
}