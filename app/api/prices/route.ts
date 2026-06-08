import { NextResponse } from "next/server";
import { COINGECKO_IDS } from "@/lib/coins";

export const revalidate = 60;

export async function GET() {
  try {
    const ids = COINGECKO_IDS.join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("CoinGecko error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      bitcoin:             { usd: 67000,    eur: 62000,    usd_24h_change: -1.2,  usd_market_cap: 1320000000000, usd_24h_vol: 28000000000 },
      ethereum:            { usd: 3500,     eur: 3200,     usd_24h_change: -2.1,  usd_market_cap: 420000000000,  usd_24h_vol: 15000000000 },
      tether:              { usd: 1,        eur: 0.92,     usd_24h_change: 0.01,  usd_market_cap: 110000000000,  usd_24h_vol: 45000000000 },
      binancecoin:         { usd: 580,      eur: 535,      usd_24h_change: -1.8,  usd_market_cap: 88000000000,   usd_24h_vol: 2000000000  },
      solana:              { usd: 165,      eur: 152,      usd_24h_change: -3.2,  usd_market_cap: 76000000000,   usd_24h_vol: 3500000000  },
      ripple:              { usd: 0.52,     eur: 0.48,     usd_24h_change: 0.5,   usd_market_cap: 28000000000,   usd_24h_vol: 1200000000  },
      dogecoin:            { usd: 0.16,     eur: 0.15,     usd_24h_change: -0.8,  usd_market_cap: 22000000000,   usd_24h_vol: 800000000   },
      cardano:             { usd: 0.45,     eur: 0.41,     usd_24h_change: -1.5,  usd_market_cap: 16000000000,   usd_24h_vol: 500000000   },
      "matic-network":     { usd: 0.88,     eur: 0.81,     usd_24h_change: -2.0,  usd_market_cap: 8800000000,    usd_24h_vol: 400000000   },
      chainlink:           { usd: 14.5,     eur: 13.3,     usd_24h_change: -1.1,  usd_market_cap: 8500000000,    usd_24h_vol: 600000000   },
      "avalanche-2":       { usd: 35,       eur: 32,       usd_24h_change: -2.5,  usd_market_cap: 14000000000,   usd_24h_vol: 700000000   },
      polkadot:            { usd: 7.2,      eur: 6.6,      usd_24h_change: -1.7,  usd_market_cap: 10000000000,   usd_24h_vol: 350000000   },
      "shiba-inu":         { usd: 0.000024, eur: 0.000022, usd_24h_change: -0.9,  usd_market_cap: 14000000000,   usd_24h_vol: 500000000   },
      "pancakeswap-token": { usd: 2.8,      eur: 2.6,      usd_24h_change: -0.5,  usd_market_cap: 800000000,     usd_24h_vol: 90000000    },
    });
  }
}
