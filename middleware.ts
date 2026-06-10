import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Logged-in users: redirect away from landing + auth pages → dashboard
  if (token && (pathname === "/" || PUBLIC.some(p => pathname.startsWith(p)))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Logged-out users: redirect away from protected pages → login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/dashboard/:path*"],
};
