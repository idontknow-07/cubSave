"use client";

import { SECURITY_ROWS } from "@/lib/landing-data";
import { Btn } from "./ui";
import SplitSection from "./SplitSection";

export default function Security() {
  return (
    <SplitSection
      id="security"
      reverse
      soft
      eyebrow="Privacy & Security"
      title="Stay private. Stay secure. Stay in control."
      intro="Our security measures are designed to keep you in control of your data and your digital assets, while keeping them safe at every layer."
      rows={SECURITY_ROWS}
      cta={<Btn>Learn more about security</Btn>}
      glyph={
        <img
          src="/security.png"
          alt="Security"
          className="w-[800px] max-w-[1000%] h-auto object-contain"
        />
      }
    />
  );
}