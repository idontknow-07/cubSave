import { NextRequest, NextResponse } from "next/server";

function decodeJwt(token: string): { userId: string; role: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/api/auth/",
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (pathname === "/") return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  const payload = token ? decodeJwt(token) : null;

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/api/wallet",
    "/api/wallet/:path*",
    "/api/transactions",
    "/api/transactions/:path*",
    "/api/admin/:path*",
  ],
};
