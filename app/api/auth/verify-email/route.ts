import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();
    if (!userId || !code) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.emailVerified) return NextResponse.json({ ok: true });

    if (!user.emailToken || !user.emailTokenExpiry) {
      return NextResponse.json({ error: "No code found. Request a new one." }, { status: 400 });
    }
    if (new Date() > user.emailTokenExpiry) {
      return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
    }
    if (user.emailToken !== code.trim()) {
      return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true, emailToken: null, emailTokenExpiry: null },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
