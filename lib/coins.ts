export const FUNCTIONAL_COINS = [
  { coin: "BTC",  network: "Bitcoin", symbol: "BTC",  coingeckoId: "bitcoin",  color: "#F7931A" },
  { coin: "ETH",  network: "ERC-20",  symbol: "ETH",  coingeckoId: "ethereum", color: "#627EEA" },
  { coin: "USDT", network: "ERC-20",  symbol: "USDT", coingeckoId: "tether",   color: "#26A17B" },
  { coin: "USDT", network: "TRC-20",  symbol: "USDT", coingeckoId: "tether",   color: "#26A17B" },
  { coin: "TRX",  network: "TRC-20",  symbol: "TRX",  coingeckoId: "tron",     color: "#EF0027" },
];

export const DISPLAY_COINS = [
  { coin: "SOL", network: "Solana", symbol: "SOL", coingeckoId: "solana", color: "#9945FF" },
  { coin: "XRP", network: "XRP Ledger", symbol: "XRP", coingeckoId: "ripple", color: "#346AA9" },
  { coin: "DOGE", network: "Dogecoin", symbol: "DOGE", coingeckoId: "dogecoin", color: "#C2A633" },
  { coin: "ADA", network: "Cardano", symbol: "ADA", coingeckoId: "cardano", color: "#0033AD" },
  { coin: "MATIC", network: "Polygon", symbol: "MATIC", coingeckoId: "matic-network", color: "#8247E5" },
  { coin: "LINK", network: "ERC-20", symbol: "LINK", coingeckoId: "chainlink", color: "#2A5ADA" },
  { coin: "AVAX", network: "Avalanche", symbol: "AVAX", coingeckoId: "avalanche-2", color: "#E84142" },
  { coin: "DOT", network: "Polkadot", symbol: "DOT", coingeckoId: "polkadot", color: "#E6007A" },
  { coin: "SHIB", network: "ERC-20", symbol: "SHIB", coingeckoId: "shiba-inu", color: "#FFA409" },
  { coin: "CAKE", network: "BSC", symbol: "CAKE", coingeckoId: "pancakeswap-token", color: "#1FC7D4" },
];

export const ALL_COINS = [...FUNCTIONAL_COINS, ...DISPLAY_COINS];

export const DEPOSIT_ADDRESSES: Record<string, string> = {
  Bitcoin: process.env.ADDR_BTC   || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "ERC-20": process.env.ADDR_ETH  || "0x742d35Cc6634C0532925a3b8D4C9C0B0c3b0e0a1",
  "TRC-20": process.env.ADDR_TRC20 || "TJYeasTPa6gpTgCxEFnFEbzVzMGr5oq4Z1",
};

export const COINGECKO_IDS = ALL_COINS.map((c) => c.coingeckoId).filter(
  (v, i, a) => a.indexOf(v) === i
);
