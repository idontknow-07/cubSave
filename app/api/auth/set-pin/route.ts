import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { userId, pin } = await req.json();
    if (!userId || !pin) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be 4–6 digits" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.emailVerified) {
      return NextResponse.json({ error: "Email must be verified first" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { withdrawalPin: await hashPin(pin) },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
