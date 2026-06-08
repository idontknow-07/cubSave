import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { comparePin } from "@/lib/auth";

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

    return NextResponse.json({ transaction: tx });
  } catch (err) {
    console.error("[transactions POST]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
