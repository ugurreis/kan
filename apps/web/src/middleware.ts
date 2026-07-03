import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "next-runtime-env";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    // Landing (pazarlama) sayfası: cloud'da veya NEXT_PUBLIC_SHOW_LANDING=true
    // iken gösterilir; aksi halde kök doğrudan /login'e yönlendirilir.
    const showLanding =
      env("NEXT_PUBLIC_KAN_ENV") === "cloud" ||
      env("NEXT_PUBLIC_SHOW_LANDING") === "true";
    if (!showLanding) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
