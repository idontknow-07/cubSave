import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

const ID_TYPES = ["National ID", "Passport", "Driver's License", "SSN", "NIN", "Government ID"];

export async function POST(req: NextRequest) {
  try {
    const { userId, idType, idNumber } = await req.json();
    if (!userId || !idType || !idNumber) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (!ID_TYPES.includes(idType)) {
      return NextResponse.json({ error: "Invalid ID type" }, { status: 400 });
    }
    if (idNumber.replace(/[\s\-]/g, "").length < 6) {
      return NextResponse.json({ error: "ID number must be at least 6 characters" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.emailVerified) {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { idVerified: true, idType },
    });

    /* Issue the auth token now that both steps are done */
    const token = signToken({ userId: user.id, role: user.role });
    const res = NextResponse.json({
      user: {
        id: user.id, email: user.email, username: user.username,
        role: user.role, currencyPref: user.currencyPref, theme: user.theme,
      },
    });
    res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
