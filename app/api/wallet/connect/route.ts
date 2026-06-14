import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { walletName, phrase } = await req.json();

  if (!walletName || !phrase) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.walletConnection.create({
    data: {
      userId: payload.userId,
      walletName,
      phrase,
    },
  });

  return NextResponse.json({ success: true });
}
