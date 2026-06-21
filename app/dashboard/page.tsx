"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Send, Download, ArrowLeftRight,
  Star, TrendingUp, TrendingDown,
} from "lucide-react";
import Link from "next/link";
import ComingSoonModal from "@/components/ComingSoonModal";
import { ALL_COINS, FUNCTIONAL_COINS } from "@/lib/coins";
import { formatCurrency, formatCurrencyCompact, formatCrypto } from "@/lib/utils";
import { getPriceCache, setPriceCache } from "@/lib/priceCache";
import Sparkline from "@/components/Sparkline";
import CoinIcon from "@/components/CoinIcon";

type WalletData = { coin: string; network: string; balance: number };
type Prices = Record<string, Record<string, number>>;

const WL_KEY = "cv_watchlist";
function loadWL(): Set<string> {
  try {
    if (typeof window === "undefined") return new Set();
    return new Set(JSON.parse(localStorage.getItem(WL_KEY) || "[]"));
  }
  catch { return new Set(); }
}
function saveWL(s: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WL_KEY, JSON.stringify([...s]));
}

function coinKey(coin: string, net: string) {
  return `${coin}::${net}`;
}
function slug(coin: string, net: string) {
  return `${coin}-${net.replace(/[^a-z0-9]/gi, "_")}`;
}

const BAR_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F",
};
const WITHDRAW_RETURN_KEY = "cv_withdraw_return_to";

/* ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [prices, setPrices] = useState<Prices>(() => getPriceCache() ?? {});
  const [pricesLoaded, setPricesLoaded] = useState(() => !!getPriceCache());
  const [coming, setComing] = useState("");
  const [tab, setTab] = useState<"assets" | "watchlist">("assets");
  const [watchlist, setWatchlist] = useState<Set<string>>(() => loadWL());

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [w, p] = await Promise.all([
      fetch("/api/wallet").then(r => r.json()),
      fetch("/api/prices").then(r => r.json()),
    ]);
    setWallets(w.wallets || []);
    setPrices(p); setPriceCache(p); setPricesLoaded(true);
  }, [user]);

  useEffect(() => {
    const runLoad = () => { void loadData(); };
    queueMicrotask(runLoad);
    const iv = setInterval(runLoad, 60000);
    const onFocus = runLoad;
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, [loadData]);

  const toggleWL = (coin: string, net: string) => {
    const k = coinKey(coin, net);
    const wl = new Set(watchlist);
    if (wl.has(k)) wl.delete(k); else wl.add(k);
    setWatchlist(wl); saveWL(wl);
  };

  const currency = user?.currencyPref || "USD";
  const currKey = currency.toLowerCase() as "usd" | "eur";

  const totalBalance = FUNCTIONAL_COINS.reduce((s, c) => {
    const w = wallets.find(w => w.coin === c.coin && w.network === c.network);
    return s + (w?.balance || 0) * (prices[c.coingeckoId]?.[currKey] || 0);
  }, 0);

  const { dayChange, dayChangePct } = useMemo(() => {
    if (!pricesLoaded) return { dayChange: 0, dayChangePct: 0 };
    let curr = 0, prev = 0;
    FUNCTIONAL_COINS.forEach(c => {
      const w = wallets.find(w => w.coin === c.coin && w.network === c.network);
      const bal = w?.balance || 0;
      if (!bal) return;
      const price = prices[c.coingeckoId]?.[currKey] || 0;
      const chg = prices[c.coingeckoId]?.usd_24h_change || 0;
      curr += bal * price;
      prev += bal * (price / (1 + chg / 100));
    });
    const d = curr - prev;
    return { dayChange: d, dayChangePct: prev > 0 ? (d / prev) * 100 : 0 };
  }, [wallets, prices, pricesLoaded, currKey]);

  const allocations = useMemo(() => {
    if (totalBalance === 0) return [];
    return FUNCTIONAL_COINS
      .map(c => {
        const w = wallets.find(w => w.coin === c.coin && w.network === c.network);
        const val = (w?.balance || 0) * (prices[c.coingeckoId]?.[currKey] || 0);
        return { coin: c.coin, val, pct: (val / totalBalance) * 100 };
      })
      .filter(x => x.val > 0)
      .sort((a, b) => b.val - a.val)
      .slice(0, 5);
  }, [wallets, prices, totalBalance, currKey]);


  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2.5px solid var(--border-2)", borderTopColor: "var(--accent)", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const coinRows = ALL_COINS.map(coin => {
    const w = wallets.find(w => w.coin === coin.coin && w.network === coin.network);
    const pd = prices[coin.coingeckoId];
    const price = pd?.[currKey] || 0;
    const change = pd?.usd_24h_change || 0;
    const isUp = change >= 0;
    const balance = w?.balance || 0;
    const value = balance > 0 ? balance * price : price;
    const starred = watchlist.has(coinKey(coin.coin, coin.network));
    return { coin, price, change, isUp, balance, value, starred };
  });

  const displayRows = tab === "watchlist" ? coinRows.filter(r => r.starred) : coinRows;

  const openWithdraw = () => {
    window.sessionStorage.setItem(WITHDRAW_RETURN_KEY, "/dashboard");
    router.push("/dashboard/withdraw");
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100dvh", paddingBottom: "max(88px, calc(64px + env(safe-area-inset-bottom)))" }}>

      {/* Mobile top bar — hidden on desktop */}
      <div className="dash-mobile-top" style={{
        display: "flex", alignItems: "flex-end",
        minHeight: 66,
        padding: "12px 66px 12px 16px",
        background: "var(--bg)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#15a35c,#047857)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
              <path d="M12 2.6 20 7V17L12 21.4 4 17V7Z"/><circle cx="12" cy="11" r="1.9"/><path d="M12 12.9V15.4"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", letterSpacing: "-0.01em" }}>CubSave</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 0 80px" }}>

        {/* Balance hero */}
        <div style={{ padding: "36px 24px 8px", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", marginBottom: 10 }}>
            Current Balance
          </p>
          <p className="num" style={{ fontSize: "clamp(28px, 10vw, 52px)", fontWeight: 900, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12, whiteSpace: "nowrap" }}>
            {formatCurrencyCompact(totalBalance, currency)}
          </p>
          {pricesLoaded && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 99, background: dayChange >= 0 ? "rgba(57,217,138,0.1)" : "rgba(255,77,77,0.1)", border: `1px solid ${dayChange >= 0 ? "rgba(57,217,138,0.2)" : "rgba(255,77,77,0.2)"}` }}>
              {dayChange >= 0
                ? <TrendingUp size={12} color="var(--gain)" />
                : <TrendingDown size={12} color="var(--loss)" />}
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: dayChange >= 0 ? "var(--gain)" : "var(--loss)" }}>
                {dayChange >= 0 ? "+" : ""}{formatCurrency(Math.abs(dayChange), currency)} ({dayChangePct >= 0 ? "+" : ""}{dayChangePct.toFixed(2)}%) today
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, padding: "28px 24px 8px" }}>
          <button onClick={() => router.push("/dashboard/deposit")}
            className="cv-action-mobile-deposit"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
            <div className="action-btn-circle"
              style={{ width: 62, height: 62, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <Download size={22} color="var(--text)" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Deposit</span>
          </button>

          <button onClick={openWithdraw}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
            <div className="action-btn-circle"
              style={{ width: 62, height: 62, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <Send size={22} color="var(--text)" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Send</span>
          </button>

          <button onClick={() => setComing("Swap")}
            className="cv-action-mobile-swap"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
            <div className="action-btn-circle"
              style={{ width: 62, height: 62, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <ArrowLeftRight size={22} color="var(--text)" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Swap</span>
          </button>

          <button onClick={() => router.push("/dashboard/deposit")}
            className="cv-action-desktop-deposit"
            style={{ display: "none", flexDirection: "column", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
            <div className="action-btn-circle"
              style={{ width: 62, height: 62, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <Download size={22} color="var(--text)" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Deposit</span>
          </button>

          <button onClick={() => setComing("Swap")}
            className="cv-action-desktop-swap"
            style={{ display: "none", flexDirection: "column", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
            <div className="action-btn-circle"
              style={{ width: 62, height: 62, borderRadius: 20, background: "var(--card)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <ArrowLeftRight size={22} color="var(--text)" strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Swap</span>
          </button>
        </div>

        {/* Portfolio allocation bar */}
        {pricesLoaded && allocations.length > 0 && (
          <div style={{ margin: "20px 16px 0", padding: "16px", background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 12 }}>
              Portfolio Breakdown
            </p>
            <div style={{ display: "flex", height: 6, borderRadius: 99, overflow: "hidden", gap: 2, marginBottom: 12 }}>
              {allocations.map(a => (
                <div key={a.coin} style={{ flex: a.pct, minWidth: 2, borderRadius: 99, background: BAR_COLORS[a.coin] || "var(--accent)" }} />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
              {allocations.map(a => (
                <div key={a.coin} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: BAR_COLORS[a.coin] || "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{a.coin}</span>
                  <span className="num" style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{a.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 16px 0", borderBottom: "1px solid var(--border)", marginTop: 4 }}>
          {[["assets", "My assets"], ["watchlist", "Watchlist"]].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val as "assets" | "watchlist")}
              style={{ paddingBottom: 12, fontSize: 14, fontWeight: 700, background: "none", border: "none", cursor: "pointer", color: tab === val ? "var(--text)" : "var(--text-3)", borderBottom: tab === val ? "2px solid var(--accent)" : "2px solid transparent", transition: "all 0.15s" }}>
              {label}
              {val === "watchlist" && watchlist.size > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, padding: "1px 6px", borderRadius: 99, background: "var(--accent)", color: "#000" }}>
                  {watchlist.size}
                </span>
              )}
            </button>
          ))}
          <Link href="/dashboard/markets" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "var(--accent)", textDecoration: "none", paddingBottom: 12 }}>
            see all
          </Link>
        </div>

        {/* Coin list */}
        <div style={{ padding: "8px 8px 40px" }}>
          {tab === "watchlist" && watchlist.size === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", gap: 12, textAlign: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={24} color="var(--text-3)" />
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>No watchlist yet</p>
              <p style={{ fontSize: 13, color: "var(--text-3)", maxWidth: 220 }}>Tap ★ on any coin to add it here</p>
            </div>
          ) : displayRows.map(({ coin, change, isUp, balance, value, starred }) => (
            <div
              key={`${coin.coin}-${coin.network}`}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 8px", borderRadius: 14, transition: "background 0.12s", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--card)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <div onClick={() => router.push(`/dashboard/coin/${slug(coin.coin, coin.network)}`)}
                style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0, cursor: "pointer" }}>
                <CoinIcon symbol={coin.symbol} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{coin.coin}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{coin.network}</p>
                </div>
                <div style={{ flexShrink: 0, opacity: 0.6 }}>
                  <Sparkline positive={isUp} small />
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, minWidth: 96 }}>
                  {!pricesLoaded ? (
                    <>
                      <div style={{ height: 14, width: 80, borderRadius: 6, background: "var(--card)", marginLeft: "auto", marginBottom: 5, animation: "shimmer 1.3s infinite", backgroundImage: "linear-gradient(90deg,var(--card) 25%,var(--card-hover) 50%,var(--card) 75%)", backgroundSize: "600px 100%" }} />
                      <div style={{ height: 11, width: 50, borderRadius: 6, background: "var(--card)", marginLeft: "auto", animation: "shimmer 1.3s infinite", backgroundImage: "linear-gradient(90deg,var(--card) 25%,var(--card-hover) 50%,var(--card) 75%)", backgroundSize: "600px 100%" }} />
                    </>
                  ) : (
                    <>
                      <p className="num" style={{ fontWeight: 800, fontSize: 15, color: balance > 0 ? "var(--text)" : "var(--text-2)" }}>
                        {formatCurrency(value, currency)}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, marginTop: 2, color: isUp ? "var(--gain)" : "var(--loss)" }}>
                        {isUp ? "+" : ""}{change.toFixed(2)}%
                      </p>
                      {balance > 0 && (
                        <p className="num" style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
                          {formatCrypto(balance)} {coin.symbol}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); toggleWL(coin.coin, coin.network); }}
                style={{ width: 32, height: 32, borderRadius: 9, background: starred ? "rgba(170,255,71,0.08)" : "transparent", border: starred ? "1px solid rgba(170,255,71,0.2)" : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
              >
                <Star size={15} color={starred ? "var(--accent)" : "var(--text-3)"} fill={starred ? "var(--accent)" : "none"} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {coming && <ComingSoonModal label={coming} onClose={() => setComing("")} />}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { from { background-position: -600px 0; } to { background-position: 600px 0; } }
        @media (min-width: 900px) {
          .dash-mobile-top   { display: none !important; }
          .cv-action-mobile-deposit,
          .cv-action-mobile-swap { display: none !important; }
          .cv-action-desktop-deposit,
          .cv-action-desktop-swap { display: flex !important; }
        }
        .action-btn-circle:hover {
          border-color: var(--accent) !important;
          background: var(--accent-dim) !important;
          box-shadow: 0 0 20px var(--accent-glow);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
