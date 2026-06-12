"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Search, X, Flame, TrendingUp, BarChart2 } from "lucide-react";
import { ALL_COINS } from "@/lib/coins";
import { formatCurrency } from "@/lib/utils";
import Sparkline from "@/components/Sparkline";
import CoinIcon from "@/components/CoinIcon";

type Prices = Record<string, Record<string, number>>;

const TOP_COINS = ["BTC", "ETH", "BNB", "SOL"];

const TABS = [
  { key: "Hot",     label: "Hot",     Icon: Flame      },
  { key: "Gainers", label: "Gainers", Icon: TrendingUp  },
  { key: "MCap",    label: "By MCap", Icon: BarChart2   },
] as const;

function fmt(n?: number) {
  if (!n) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toFixed(2)}`;
}

export default function MarketsPage() {
  const { user }  = useAuth();
  const router    = useRouter();
  const [prices,  setPrices]  = useState<Prices>({});
  const [loaded,  setLoaded]  = useState(false);
  const [search,  setSearch]  = useState("");
  const [tab,     setTab]     = useState<typeof TABS[number]["key"]>("Hot");

  useEffect(() => {
    fetch("/api/prices").then(r => r.json()).then(d => { setPrices(d); setLoaded(true); });
    const iv = setInterval(() => fetch("/api/prices").then(r => r.json()).then(setPrices), 60000);
    return () => clearInterval(iv);
  }, []);

  const currency = user?.currencyPref || "USD";
  const currKey  = currency.toLowerCase() as "usd" | "eur";

  const uniqueCoins = useMemo(() => {
    const seen = new Set<string>();
    return ALL_COINS.filter(c => { if (seen.has(c.coingeckoId)) return false; seen.add(c.coingeckoId); return true; });
  }, []);

  const sorted = useMemo(() => {
    let list = [...uniqueCoins];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => c.coin.toLowerCase().includes(s) || c.network.toLowerCase().includes(s));
    }
    if (tab === "Gainers") list.sort((a, b) => (prices[b.coingeckoId]?.usd_24h_change || 0) - (prices[a.coingeckoId]?.usd_24h_change || 0));
    if (tab === "MCap")    list.sort((a, b) => (prices[b.coingeckoId]?.usd_market_cap || 0) - (prices[a.coingeckoId]?.usd_market_cap || 0));
    return list;
  }, [uniqueCoins, prices, tab, search]);

  const topTraded = useMemo(() =>
    TOP_COINS.map(s => ALL_COINS.find(c => c.coin === s)).filter(Boolean) as typeof ALL_COINS,
  []);

  const slug = (coin: string, net: string) => `${coin}-${net.replace(/[^a-z0-9]/gi, "_")}`;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "0 0 60px" }}>

      {/* Mobile header — aligns with hamburger on right */}
      <div className="markets-mobile-hd" style={{ display: "none", alignItems: "flex-end", minHeight: 66, padding: "0 66px 12px 16px", paddingTop: "max(12px, env(safe-area-inset-top, 12px))", background: "var(--bg)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em", margin: 0 }}>Markets</h1>
      </div>
      {/* Desktop header */}
      <div className="markets-desktop-hd" style={{ padding: "28px 24px 0", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>Markets</h1>
      </div>

      {/* Search */}
      <div style={{ position: "relative", padding: "16px 24px 0", maxWidth: 900, margin: "0 auto" }}>
        <Search size={15} style={{ position: "absolute", left: 38, top: "50%", transform: "translateY(-25%)", color: "var(--text-3)", pointerEvents: "none" }} />
        <input
          className="input"
          style={{ paddingLeft: 42, fontSize: 14 }}
          placeholder="Search coins…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ position: "absolute", right: 28, top: "50%", transform: "translateY(-25%)", width: 24, height: 24, borderRadius: "50%", background: "var(--card-hover)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={12} color="var(--text-3)" />
          </button>
        )}
      </div>

      {/* Top Traded cards */}
      {!search && (
        <div style={{ padding: "20px 0 0", maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", padding: "0 24px", marginBottom: 12 }}>
            Top Traded (24h)
          </p>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 24px 4px", scrollbarWidth: "none" }}>
            {!loaded ? [1,2,3,4].map(i => (
              <div key={i} style={{ flexShrink: 0, width: 148, height: 120, borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)", animation: "shimmer 1.3s infinite" }} />
            )) : topTraded.map(coin => {
              const p      = prices[coin.coingeckoId];
              const price  = p?.[currKey] || 0;
              const change = p?.usd_24h_change || 0;
              const isUp   = change >= 0;
              return (
                <button
                  key={coin.coin}
                  onClick={() => router.push(`/dashboard/coin/${slug(coin.coin, coin.network)}`)}
                  style={{ flexShrink: 0, width: 148, padding: "14px 14px 12px", borderRadius: 16, background: "var(--card)", border: "1px solid var(--border)", textAlign: "left", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>{coin.coin}</span>
                    <CoinIcon symbol={coin.symbol} size={28} />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.01em" }}>
                    {formatCurrency(price, currency)}
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 700, marginTop: 3, color: isUp ? "var(--gain)" : "var(--loss)" }}>
                    {isUp ? "+" : ""}{change.toFixed(2)}%
                  </p>
                  <div style={{ marginTop: 8, opacity: 0.75 }}>
                    <Sparkline positive={isUp} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      {!search && (
        <div style={{ display: "flex", gap: 8, padding: "20px 24px 0", maxWidth: 900, margin: "0 auto" }}>
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer",
                background: tab === key ? "var(--accent)" : "var(--card)",
                color: tab === key ? "#000" : "var(--text-3)",
                border: tab === key ? "none" : "1px solid var(--border)",
                transition: "all 0.15s",
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Coin list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "16px 12px 0", maxWidth: 900, margin: "0 auto" }}>
        {!loaded && !search ? [1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 8px", borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 2 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--card-hover)", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ height: 13, background: "var(--card-hover)", borderRadius: 6, width: "40%" }} />
              <div style={{ height: 11, background: "var(--card-hover)", borderRadius: 6, width: "60%" }} />
            </div>
            <div style={{ width: 56, height: 24, borderRadius: 6, background: "var(--card-hover)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
              <div style={{ height: 13, background: "var(--card-hover)", borderRadius: 6, width: 60 }} />
              <div style={{ height: 11, background: "var(--card-hover)", borderRadius: 6, width: 40 }} />
            </div>
          </div>
        )) : sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Search size={32} style={{ margin: "0 auto 12px", color: "var(--text-3)" }} />
            <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>No results for &ldquo;{search}&rdquo;</p>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>Try a different coin name</p>
          </div>
        ) : sorted.map(coin => {
          const p      = prices[coin.coingeckoId];
          const price  = p?.[currKey] || 0;
          const change = p?.usd_24h_change || 0;
          const isUp   = change >= 0;
          const mcap   = p?.usd_market_cap;

          return (
            <button
              key={`${coin.coin}-${coin.coingeckoId}`}
              onClick={() => router.push(`/dashboard/coin/${slug(coin.coin, coin.network)}`)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 8px", borderRadius: 14,
                background: "transparent", border: "none", cursor: "pointer",
                textAlign: "left", width: "100%", transition: "background 0.12s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <CoinIcon symbol={coin.symbol} size={44} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{coin.coin}</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                  {mcap ? fmt(mcap) + " mcap" : coin.network}
                </p>
              </div>

              <div style={{ flexShrink: 0, opacity: 0.65 }}>
                <Sparkline positive={isUp} small />
              </div>

              <div style={{ textAlign: "right", flexShrink: 0, minWidth: 72 }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>
                  {formatCurrency(price, currency)}
                </p>
                <p style={{ fontSize: 12, fontWeight: 700, marginTop: 2, color: isUp ? "var(--gain)" : "var(--loss)" }}>
                  {isUp ? "+" : ""}{change.toFixed(2)}%
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        @media (max-width: 899px) {
          .markets-mobile-hd { display: flex !important; }
          .markets-desktop-hd { display: none !important; }
        }
      `}</style>
    </div>
  );
}
