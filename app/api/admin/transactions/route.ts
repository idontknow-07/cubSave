import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { sendWithdrawalStatusEmail } from "@/lib/email";

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const userId = searchParams.get("userId");

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (userId) where.userId = userId;

  let transactions = await prisma.transaction.findMany({
    where,
    include: { user: { select: { email: true, username: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (search) {
    const s = search.toLowerCase();
    transactions = transactions.filter(
      (t) =>
        t.user.username.toLowerCase().includes(s) ||
        t.user.email.toLowerCase().includes(s)
    );
  }

  return NextResponse.json({ transactions });
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Only update balance when moving to approved for the first time
  if (status === "approved" && tx.status !== "approved") {
    if (tx.type === "deposit") {
      await prisma.wallet.upsert({
        where: { userId_coin_network: { userId: tx.userId, coin: tx.coin, network: tx.network } },
        update: { balance: { increment: tx.amount } },
        create: { userId: tx.userId, coin: tx.coin, network: tx.network, balance: tx.amount },
      });
    } else if (tx.type === "withdraw") {
      const wallet = await prisma.wallet.findUnique({
        where: { userId_coin_network: { userId: tx.userId, coin: tx.coin, network: tx.network } },
      });
      if (!wallet || wallet.balance < tx.amount) {
        return NextResponse.json({ error: "Insufficient balance to approve" }, { status: 400 });
      }
      await prisma.wallet.update({
        where: { userId_coin_network: { userId: tx.userId, coin: tx.coin, network: tx.network } },
        data: { balance: { decrement: tx.amount } },
      });
    }
  }

  // If reverting from approved back to rejected, reverse the balance
  if (tx.status === "approved" && status !== "approved") {
    if (tx.type === "deposit") {
      await prisma.wallet.update({
        where: { userId_coin_network: { userId: tx.userId, coin: tx.coin, network: tx.network } },
        data: { balance: { decrement: tx.amount } },
      });
    } else if (tx.type === "withdraw") {
      await prisma.wallet.update({
        where: { userId_coin_network: { userId: tx.userId, coin: tx.coin, network: tx.network } },
        data: { balance: { increment: tx.amount } },
      });
    }
  }

  const updated = await prisma.transaction.update({ where: { id }, data: { status } });

  /* Email user when their withdrawal is approved or rejected */
  if (tx.type === "withdraw" && (status === "approved" || status === "rejected")) {
    const user = await prisma.user.findUnique({ where: { id: tx.userId } });
    if (user) {
      sendWithdrawalStatusEmail(user.email, user.username, tx.amount, tx.coin, status as "approved" | "rejected")
        .catch(console.error);
    }
  }

  return NextResponse.json({ transaction: updated });
}
