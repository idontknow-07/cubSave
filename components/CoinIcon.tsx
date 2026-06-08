"use client";
import { useState } from "react";

const COIN_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", TRX: "#EF0027",
  SOL: "#9945FF", XRP: "#346AA9", DOGE: "#C2A633", ADA: "#0033AD",
  MATIC: "#8247E5", LINK: "#2A5ADA", AVAX: "#E84142", DOT: "#E6007A",
  SHIB: "#FFA409", CAKE: "#1FC7D4", BNB: "#F3BA2F",
};

/* Overrides for symbols that differ from the standard CDN naming */
const SYMBOL_MAP: Record<string, string> = {
  MATIC: "matic",
  CAKE: "cake",
  SHIB: "shib",
};

function iconUrl(symbol: string) {
  const s = (SYMBOL_MAP[symbol] || symbol).toLowerCase();
  return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa/svg/color/${s}.svg`;
}

interface CoinIconProps {
  symbol: string;
  size?: number;
}

export default function CoinIcon({ symbol, size = 44 }: CoinIconProps) {
  const [failed, setFailed] = useState(false);
  const color = COIN_COLORS[symbol] || "#888888";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        overflow: "hidden",
        background: color + "18",
        border: `1.5px solid ${color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!failed ? (
        <img
          src={iconUrl(symbol)}
          alt={symbol}
          width={size * 0.72}
          height={size * 0.72}
          onError={() => setFailed(true)}
          style={{ display: "block" }}
        />
      ) : (
        <span
          style={{
            fontSize: size * 0.26,
            fontWeight: 900,
            color,
            letterSpacing: "-0.02em",
          }}
        >
          {symbol.slice(0, 3)}
        </span>
      )}
    </div>
  );
}
