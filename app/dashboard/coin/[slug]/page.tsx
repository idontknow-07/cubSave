"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ALL_COINS, FUNCTIONAL_COINS, DEPOSIT_ADDRESSES } from "@/lib/coins";
import { formatCurrency, formatCrypto } from "@/lib/utils";
import { ArrowLeft, Send, Download, ArrowUpRight, ArrowDownLeft, ExternalLink, Copy, Check } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import ComingSoonModal from "@/components/ComingSoonModal";
import CoinIcon from "@/components/CoinIcon";
import TxDetailSheet from "@/components/TxDetailSheet";
import { getPriceCache, setPriceCache } from "@/lib/priceCache";

const COIN_COLORS: Record<string, string> = {
  BTC: "#F7931A", ETH: "#627EEA", USDT: "#26A17B", BNB: "#F3BA2F",
  SOL: "#9945FF", XRP: "#346AA9", DOGE: "#C2A633", ADA: "#0033AD",
  MATIC: "#8247E5", LINK: "#2A5ADA", AVAX: "#E84142", DOT: "#E6007A",
  SHIB: "#FFA409", CAKE: "#1FC7D4",
};

const COIN_DESC: Record<string, string> = {
  BTC: "Bitcoin is the first decentralized cryptocurrency, enabling peer-to-peer transactions without intermediaries.",
  ETH: "Ethereum is a decentralized platform for smart contracts and decentralized applications (dApps).",
  USDT: "Tether (USDT) is a stablecoin pegged 1:1 to the US Dollar, used for trading and transfers.",
  BNB: "BNB is the native token of the BNB Chain, used for fees, staking, and DeFi applications.",
  SOL: "Solana is a high-performance blockchain supporting fast, low-cost transactions and DeFi apps.",
  XRP: "XRP is a digital asset built for fast, low-cost international payments and settlements.",
  DOGE: "Dogecoin started as a meme but became a widely used tipping and payment cryptocurrency.",
  ADA: "Cardano is a proof-of-stake blockchain platform focused on security and sustainability.",
  MATIC: "Polygon (MATIC) is a Layer-2 scaling solution for Ethereum, enabling faster and cheaper transactions.",
  LINK: "Chainlink provides decentralized oracle networks that connect smart contracts to real-world data.",
  AVAX: "Avalanche is a fast, low-cost, eco-friendly blockchain for DeFi, enterprise, and NFTs.",
  DOT: "Polkadot connects multiple blockchains into one unified network for interoperability.",
  SHIB: "Shiba Inu is a meme token and decentralized community experiment built on Ethereum.",
  CAKE: "PancakeSwap's native token used for governance, yield farming, and liquidity on BNB Chain.",
};

const TF_POINTS = { "1H": 24, "1D": 60, "1W": 84, "1M": 120 } as const;
const TF_VOL = { "1H": 0.004, "1D": 0.014, "1W": 0.024, "1M": 0.038 } as const;
const WITHDRAW_RETURN_KEY = "cv_withdraw_return_to";
type TF = keyof typeof TF_POINTS;

function genChart(base: number, n: number, vol: number) {
  const d: { v: number }[] = [];
  let p = base * (0.88 + Math.random() * 0.12);
  for (let i = 0; i < n; i++) {
    p = Math.max(p * (1 + (Math.random() - 0.48) * vol), 0.000001);
    d.push({ v: parseFloat(p.toFixed(8)) });
  }
  d.push({ v: base });
  return d;
}

function StatusPill({ status }: { status: string }) {
  const s: Record<string, { bg: string; col: string }> = {
    pending: { bg: "rgba(255,181,71,0.12)", col: "#ffb547" },
    approved: { bg: "rgba(57,217,138,0.12)", col: "#39d98a" },
    rejected: { bg: "rgba(255,77,77,0.12)", col: "#ff4d4d" },
  };
  const style = s[status] || s.pending;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: style.bg, color: style.col }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: accent ? "var(--accent)" : "var(--text)" }}>{value}</span>
    </div>
  );
}

export default function CoinDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  /* Load from cache instantly — no blank flash while fetching */
  const [prices, setPrices] = useState<Record<string, Record<string, number>>>(() => getPriceCache() ?? {});
  const [wallets, setWallets] = useState<{ coin: string; network: string; balance: number }[]>([]);
  const [txs, setTxs] = useState<{ id: string; type: string; amount: number; status: string; createdAt: string; coin: string; network: string; address: string | null }[]>([]);
  const [tf, setTf] = useState<TF>("1D");
  const [showComing, setShowComing] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [coinName, network] = useMemo(() => {
    const parts = slug.split("-");
    return [parts[0], parts.slice(1).join("-").replace(/_/g, "-")];
  }, [slug]);

  const coinDef = useMemo(() =>
    ALL_COINS.find(c => c.coin === coinName && c.network.replace(/[^a-z0-9]/gi, "-") === network) ||
    ALL_COINS.find(c => c.coin === coinName),
    [coinName, network]
  );

  const isFunctional = useMemo(() =>
    FUNCTIONAL_COINS.some(c => c.coin === coinDef?.coin && c.network === coinDef?.network),
    [coinDef]
  );

  const currency = user?.currencyPref || "USD";
  const currKey = currency.toLowerCase() as "usd" | "eur";

  useEffect(() => {
    /* Refresh prices in background — page already shows cached data instantly */
    fetch("/api/prices").then(r => r.json()).then(d => { setPrices(d); setPriceCache(d); });
    if (isFunctional && coinDef) {
      fetch("/api/wallet").then(r => r.json()).then(d => setWallets(d.wallets || []));
      fetch(`/api/transactions?coin=${coinDef.coin}&network=${coinDef.network}`)
        .then(r => r.json()).then(d => setTxs(d.transactions || []));
    }
  }, [isFunctional, coinDef]);

  const pd = coinDef ? prices[coinDef.coingeckoId] : undefined;
  const currentPrice = pd?.[currKey] || 0;
  const change24h = pd?.usd_24h_change || 0;
  const isUp = change24h >= 0;
  const mcap = pd?.usd_market_cap;
  const vol24h = pd?.usd_24h_vol;
  const balance = coinDef ? wallets.find(w => w.coin === coinDef.coin && w.network === coinDef.network)?.balance || 0 : 0;
  const coinColor = coinDef ? COIN_COLORS[coinDef.coin] || coinDef.color : "var(--accent)";
  const desc = coinDef ? COIN_DESC[coinDef.coin] : undefined;

  const chartData = useMemo(
    () => genChart(currentPrice || 100, TF_POINTS[tf], TF_VOL[tf]),
    [currentPrice, tf]
  );
  const chartMin = Math.min(...chartData.map(d => d.v));
  const chartMax = Math.max(...chartData.map(d => d.v));

  function fmt(n?: number) {
    if (!n) return "—";
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toFixed(2)}`;
  }

  const openWithdraw = () => {
    if (!isFunctional) {
      setShowComing(true);
      return;
    }
    window.sessionStorage.setItem(WITHDRAW_RETURN_KEY, `/dashboard/coin/${slug}`);
    router.push("/dashboard/withdraw");
  };

  const copyAddress = () => {
    if (!coinDef) return;
    const addr = DEPOSIT_ADDRESSES[coinDef.network] || "";
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  if (!coinDef) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", gap: 12 }}>
      <p style={{ color: "var(--text-2)" }}>Coin not found.</p>
      <button onClick={() => router.back()} style={{ color: "var(--accent)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>← Go back</button>
    </div>
  );

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 8px" }}>
        <button onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 11, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="var(--text)" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CoinIcon symbol={coinDef.symbol} size={32} />
          <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{coinDef.coin}</span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-3)" }}>
            {coinDef.network}
          </span>
        </div>

        <button onClick={() => setShowComing(true)}
          style={{ width: 38, height: 38, borderRadius: 11, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ExternalLink size={15} color="var(--text-3)" />
        </button>
      </div>

      {/* ── Price ── */}
      <div style={{ padding: "16px 16px 8px" }}>
        <p style={{ fontSize: 40, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1, marginBottom: 10 }}>
          {formatCurrency(currentPrice, currency)}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "5px 11px", borderRadius: 99, fontSize: 13, fontWeight: 700,
            background: isUp ? "rgba(57,217,138,0.12)" : "rgba(255,77,77,0.12)",
            color: isUp ? "#39d98a" : "#ff4d4d",
          }}>
            {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{change24h.toFixed(2)}%
          </span>
          <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>24h change</span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div style={{ height: 158, margin: "16px 0 6px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
            <YAxis domain={[chartMin * 0.9995, chartMax * 1.0005]} hide />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 10, fontSize: 12, color: "var(--text)" }}
              labelStyle={{ display: "none" }}
              formatter={(val) => [formatCurrency(Number(val), currency), ""]}
              cursor={{ stroke: "var(--border-2)", strokeWidth: 1 }}
            />
            <Line type="monotone" dataKey="v" stroke={isUp ? "#39d98a" : "#ff4d4d"} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Timeframe ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "2px 16px 20px" }}>
        {(Object.keys(TF_POINTS) as TF[]).map(t => (
          <button key={t} onClick={() => setTf(t)}
            style={{
              padding: "6px 18px", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: tf === t ? "var(--accent)" : "var(--card)",
              color: tf === t ? "#000" : "var(--text-3)",
              border: tf === t ? "none" : "1px solid var(--border)",
              transition: "all 0.15s",
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Balance (functional only) ── */}
      {isFunctional && (
        <div style={{ margin: "0 16px 16px", padding: "18px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 5 }}>Your Balance</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.02em" }}>
              {formatCurrency(balance * currentPrice, currency)}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 3 }}>
              {formatCrypto(balance)} {coinDef.symbol}
            </p>
          </div>
          <div style={{ width: 48, height: 48 }}>
            <CoinIcon symbol={coinDef.symbol} size={48} />
          </div>
        </div>
      )}

      {/* ── Deposit Address (functional only) ── */}
      {isFunctional && (
        <div style={{ margin: "0 16px 16px", padding: "16px 18px", borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>
            {coinDef.network} Deposit Address
          </p>
          <p style={{ fontSize: 12, fontFamily: "monospace", color: "var(--text)", wordBreak: "break-all", lineHeight: 1.7, marginBottom: 12 }}>
            {DEPOSIT_ADDRESSES[coinDef.network] || "Address unavailable"}
          </p>
          <button
            onClick={copyAddress}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "10px 0", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
              background: copiedAddress ? "var(--accent-dim)" : "var(--surface)",
              color: copiedAddress ? "var(--accent)" : "var(--text-3)",
              border: `1px solid ${copiedAddress ? "rgba(21,163,92,0.25)" : "var(--border)"}`,
              transition: "all 0.15s",
            }}
          >
            {copiedAddress ? <Check size={14} /> : <Copy size={14} />}
            {copiedAddress ? "Address Copied!" : "Copy Address"}
          </button>
          <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 12, lineHeight: 1.5 }}>
            Send only {coinDef.coin} via {coinDef.network} to this address.
          </p>
        </div>
      )}

      {/* ── Send ── */}
      <div style={{ padding: "0 16px 20px" }}>
        <button
          onClick={openWithdraw}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: "pointer", background: isFunctional ? "var(--accent)" : "var(--card)", color: isFunctional ? "#000" : "var(--text-3)", border: isFunctional ? "none" : "1px solid var(--border)", boxShadow: isFunctional ? "0 4px 16px var(--accent-glow)" : "none" }}
        >
          <Send size={16} /> Send {coinDef.coin}
        </button>
      </div>

      {/* ── Market Info ── */}
      <div style={{ margin: "0 16px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 4 }}>Market Info</p>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "0 16px" }}>
          <InfoRow label="Market Cap" value={fmt(mcap)} />
          <InfoRow label="24h Volume" value={fmt(vol24h)} />
          <InfoRow label="24h Change" value={`${isUp ? "+" : ""}${change24h.toFixed(2)}%`} accent={isUp} />
          <InfoRow label="Symbol" value={coinDef.symbol} />
          <InfoRow label="Network" value={coinDef.network} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0" }}>
            <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>Type</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: coinColor + "18", color: coinColor }}>
              {coinDef.network === "Bitcoin" ? "PoW" : coinDef.network === "ERC-20" || coinDef.network === "TRC-20" ? "Token" : "L1"}
            </span>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      {desc && (
        <div style={{ margin: "0 16px 16px" }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)", marginBottom: 8 }}>About {coinDef.coin}</p>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px" }}>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>{desc}</p>
          </div>
        </div>
      )}

      {/* ── Activity ── */}
      {isFunctional && (
        <div style={{ padding: "0 16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-3)" }}>Activity</p>
            {txs.length > 0 && (
              <button onClick={() => router.push("/dashboard/history")}
                style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
                See all
              </button>
            )}
          </div>

          {txs.length === 0 ? (
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>No transactions yet</p>
              <p style={{ fontSize: 12, color: "var(--text-3)" }}>Deposit or send {coinDef.coin} to get started</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {txs.slice(0, 6).map(tx => {
                const isDeposit = tx.type === "deposit";
                return (
                  <div key={tx.id} onClick={() => setSelectedTx(tx)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDeposit ? "rgba(57,217,138,0.12)" : "rgba(255,77,77,0.12)" }}>
                      {isDeposit ? <ArrowDownLeft size={16} color="#39d98a" /> : <ArrowUpRight size={16} color="#ff4d4d" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{isDeposit ? "Depositd" : "Sent"}</p>
                      <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: 14, color: isDeposit ? "#39d98a" : "#ff4d4d" }}>
                        {isDeposit ? "+" : "−"}{formatCrypto(tx.amount)} {coinDef.symbol}
                      </p>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                        <StatusPill status={tx.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showComing && <ComingSoonModal label="Explorer" onClose={() => setShowComing(false)} />}
      {selectedTx && <TxDetailSheet tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
}
