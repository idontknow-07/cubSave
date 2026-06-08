import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();
    if (!userId || !code) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.emailVerified) return NextResponse.json({ ok: true });

    if (!user.emailCode || !user.emailCodeExpiry) {
      return NextResponse.json({ error: "No verification code found. Request a new one." }, { status: 400 });
    }
    if (new Date() > user.emailCodeExpiry) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }
    if (user.emailCode !== code.trim()) {
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, emailCode: null, emailCodeExpiry: null },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
