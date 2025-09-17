import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { accessSecret } from "./lib/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  // ✅ Check if user is authenticated
  let isAuthenticated = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(accessSecret);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      // Token is invalid, user is not authenticated
      isAuthenticated = false;
    }
  }

  // ✅ Public pages (login/register)
  if (pathname === "/login" || pathname === "/register") {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // If not authenticated, allow access to login/register
    return NextResponse.next();
  }

  // ✅ Protect all other routes
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated and accessing protected route
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect everything except static files & API routes
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
