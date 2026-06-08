"use client";

function genData(positive: boolean, n = 18) {
  const d: number[] = [];
  let v = 50 + (Math.random() * 16 - 8);
  for (let i = 0; i < n; i++) {
    v += (Math.random() * 8 - 4) + (positive ? 0.4 : -0.4);
    v = Math.max(8, Math.min(92, v));
    d.push(v);
  }
  return d;
}

function toPath(data: number[], w: number, h: number) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M ${pts.join(" L ")}`;
}

export default function Sparkline({ positive, small }: { positive: boolean; small?: boolean }) {
  const w = small ? 56 : 88;
  const h = small ? 24 : 40;
  const data = genData(positive);
  const path = toPath(data, w, h);
  const color = positive ? "#39d98a" : "#ff4d4d";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
