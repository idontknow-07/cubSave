import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashPin } from "@/lib/auth";
import { FUNCTIONAL_COINS } from "@/lib/coins";
import * as bip39 from "bip39";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const email = req.nextUrl.searchParams.get("email");
  const password = req.nextUrl.searchParams.get("password");
  const username = req.nextUrl.searchParams.get("username") || "admin";

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!email || !password) {
    return NextResponse.json({ error: "email and password params required" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
  }

  const mnemonic = bip39.generateMnemonic();
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: await hashPassword(password),
      withdrawalPin: await hashPin("0000"),
      mnemonic,
      role: "admin",
      emailVerified: true,
      idVerified: true,
      currencyPref: "USD",
      theme: "dark",
    },
  });

  for (const c of FUNCTIONAL_COINS) {
    await prisma.wallet.create({
      data: { userId: user.id, coin: c.coin, network: c.network, balance: 0 },
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Admin user created. DELETE this route now.",
    user: { id: user.id, email: user.email, username: user.username, role: user.role },
  });
}
