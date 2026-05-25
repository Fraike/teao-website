import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/news/") && !pathname.endsWith(".html")) {
    return NextResponse.redirect(new URL(`${pathname}.html`, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/news/:path*"],
};
