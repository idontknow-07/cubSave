import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, comparePin } from "@/lib/auth";
import { sendAdminNotificationEmail } from "@/lib/email";
import { FUNCTIONAL_COINS } from "@/lib/coins";

const MIN_WITHDRAWAL_USD = 100_000;
const ETH_FEE_USD_FALLBACK = 3500;

const NATIVE_MAP: Record<string, string> = {
  "Bitcoin": "BTC",
  "ERC-20": "ETH",
  "TRC-20": "TRX",
  "BEP20": "BNB",
  "Solana": "SOL"
};

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

    if (type === "withdraw" || type === "transfer") {
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

      if (type === "transfer") {
        if (!address) return NextResponse.json({ error: "Recipient username required" }, { status: 400 });
        const targetUser = await prisma.user.findUnique({ where: { username: address } });
        if (!targetUser) return NextResponse.json({ error: "Recipient username not found" }, { status: 404 });
        if (targetUser.id === payload.userId) return NextResponse.json({ error: "Cannot send to yourself" }, { status: 400 });
      }

      // Fee and minimum withdrawal checks only for external withdrawals
      if (type === "withdraw") {
        const nativeSymbol = NATIVE_MAP[network] || coin;
        const isNative = nativeSymbol === coin;
        const nativeCoinDef = FUNCTIONAL_COINS.find(c => c.symbol === nativeSymbol && c.network === network) || FUNCTIONAL_COINS.find(c => c.coin === coin && c.network === network);

        if (nativeCoinDef) {
          const [ethUsd, nativeUsd, tokenUsd] = await Promise.all([
            getEthUsd(),
            getCoinUsd(nativeCoinDef.coingeckoId),
            isNative ? 0 : getCoinUsd(FUNCTIONAL_COINS.find(c => c.coin === coin && c.network === network)?.coingeckoId || "")
          ]);

          if (nativeUsd > 0 && ethUsd > 0) {
            const feeNative = ethUsd / nativeUsd;
            const amtNum = parseFloat(amount);

            if (isNative) {
              if (amtNum <= feeNative) {
                return NextResponse.json({ error: `Amount must exceed the network fee (${feeNative.toFixed(6)} ${nativeSymbol}).` }, { status: 400 });
              }
            } else {
              const nativeWallet = await prisma.wallet.findUnique({
                where: { userId_coin_network: { userId: payload.userId, coin: nativeSymbol, network } }
              });
              if (!nativeWallet || nativeWallet.balance < feeNative) {
                return NextResponse.json({ error: `Insufficient ${nativeSymbol} balance for network fee.` }, { status: 400 });
              }
              // Deduct native fee immediately since the admin approval only touches the target token
              await prisma.wallet.update({
                where: { id: nativeWallet.id },
                data: { balance: { decrement: feeNative } }
              });
            }

            const withdrawalUsd = amtNum * (isNative ? nativeUsd : tokenUsd);
            if (withdrawalUsd < MIN_WITHDRAWAL_USD) {
              return NextResponse.json(
                { error: `Minimum withdrawal is $100,000 USD equivalent. Your withdrawal is approximately $${Math.round(withdrawalUsd).toLocaleString()}.` },
                { status: 400 }
              );
            }
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
