import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const base  = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${base}/signup?error=invalid_link`);
  }

  try {
    const user = await prisma.user.findFirst({ where: { emailToken: token } });

    if (!user) {
      return NextResponse.redirect(`${base}/signup?error=invalid_link`);
    }
    if (user.emailTokenExpiry && new Date() > user.emailTokenExpiry) {
      return NextResponse.redirect(`${base}/signup?error=link_expired&userId=${user.id}`);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailToken: null, emailTokenExpiry: null },
    });

    return NextResponse.redirect(`${base}/signup?step=pin&userId=${user.id}`);
  } catch {
    return NextResponse.redirect(`${base}/signup?error=server_error`);
  }
}
