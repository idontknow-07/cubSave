import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { sendDepositEmail } from "@/lib/email";
import { FUNCTIONAL_COINS } from "@/lib/coins";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

async function fetchUsdValue(coin: string, amount: number): Promise<number | null> {
  try {
    const cgId = FUNCTIONAL_COINS.find(c => c.coin === coin)?.coingeckoId;
    if (!cgId) return null;
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd`,
      { next: { revalidate: 60 } },
    );
    const data = await res.json();
    const price: number = data[cgId]?.usd ?? 0;
    return price ? price * amount : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    where: { role: "user" },
    include: { wallets: true },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, coin, network, amount, action = "credit" } = await req.json();
  if (!userId || !coin || !network || !amount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const delta = parseFloat(amount);
  if (delta <= 0) return NextResponse.json({ error: "Amount must be positive" }, { status: 400 });

  const wallet = await prisma.wallet.upsert({
    where: { userId_coin_network: { userId, coin, network } },
    update: { balance: action === "debit" ? { decrement: delta } : { increment: delta } },
    create: { userId, coin, network, balance: action === "debit" ? 0 : delta },
  });

  if (action === "debit" && wallet.balance < 0) {
    await prisma.wallet.update({
      where: { userId_coin_network: { userId, coin, network } },
      update: { balance: 0 },
    });
    wallet.balance = 0;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user && action === "credit") {
    fetchUsdValue(coin, delta)
      .then(usdValue =>
        sendDepositEmail(user.email, user.username, delta, coin, network, usdValue),
      )
      .catch(console.error);
  }

  return NextResponse.json({ wallet });
}
