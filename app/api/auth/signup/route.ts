import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, hashPin } from "@/lib/auth";
import { FUNCTIONAL_COINS } from "@/lib/coins";
import { sendVerificationEmail } from "@/lib/email";
import * as bip39 from "bip39";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password, country, phone } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const mnemonic = bip39.generateMnemonic();
    const tempPin  = `unset_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const user = await prisma.user.create({
      data: {
        email, username,
        passwordHash: await hashPassword(password),
        withdrawalPin: await hashPin(tempPin),
        mnemonic,
        role: "user",
        emailVerified: false,
        emailToken: token,
        emailTokenExpiry: expiry,
        country: country || null,
        phone: phone || null,
      },
    });

    for (const c of FUNCTIONAL_COINS) {
      await prisma.wallet.create({
        data: { userId: user.id, coin: c.coin, network: c.network, balance: 0 },
      });
    }

    const origin  = req.nextUrl.origin;
    const verifyUrl = `${origin}/api/auth/verify-email?token=${token}`;
    await sendVerificationEmail(email, username, verifyUrl);

    return NextResponse.json({ userId: user.id, email: user.email });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* Resend verification link */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (user.emailVerified) return NextResponse.json({ ok: true });

    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.user.update({ where: { id: userId }, data: { emailToken: token, emailTokenExpiry: expiry } });

    const origin    = req.nextUrl.origin;
    const verifyUrl = `${origin}/api/auth/verify-email?token=${token}`;
    await sendVerificationEmail(user.email, user.username, verifyUrl);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
