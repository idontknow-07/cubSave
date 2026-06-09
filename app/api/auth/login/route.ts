import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    /* Auto-promote to admin if email matches ADMIN_EMAIL env var */
    let role = user.role;
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    if (adminEmail && user.email.toLowerCase() === adminEmail && role !== "admin") {
      await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } });
      role = "admin";
    }

    const token = signToken({ userId: user.id, role });
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username, role, currencyPref: user.currencyPref, theme: user.theme },
    });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
