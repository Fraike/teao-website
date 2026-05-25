import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  "rd-t015": "gear-damper", "rd-t001": "gear-damper", "rd-t002": "gear-damper",
  "rd-t003": "gear-damper", "rd-t008": "gear-damper", "rd-t009": "gear-damper",
  "rd-t010": "gear-damper", "rd-t011": "gear-damper", "rd-t015b": "gear-damper",
  "rd-t019": "gear-damper", "rd-t021": "gear-damper", "rd-t022": "gear-damper",
  "rd-t023": "gear-damper", "rd-t024": "gear-damper", "rd-t025": "gear-damper",
  "rd-t028": "gear-damper", "rd-t029": "gear-damper", "rd-t036": "gear-damper",
  "rd-t038": "gear-damper", "rd-t039": "gear-damper", "rd-t040": "gear-damper",
  "rd-t068": "gear-damper", "rd-10": "gear-damper",
  "rd-t012a": "axial-damper", "rd-t012b": "axial-damper", "rd-t012c": "axial-damper",
  "rd-t012d": "axial-damper", "rd-t012e": "axial-damper", "rd-t013a": "axial-damper",
  "rd-t013b": "axial-damper", "rd-t013c": "axial-damper", "rd-t013d": "axial-damper",
  "rd-t013e": "axial-damper", "rd-t017": "axial-damper", "rd-t018": "axial-damper",
  "rd-t020": "axial-damper", "rd-t101": "axial-damper", "rd-t102": "axial-damper",
  "rd-t138": "axial-damper", "rd-t150": "axial-damper", "rd-t160": "axial-damper",
  "rd-t170": "axial-damper",
  "rd-v107": "glove-box-damper", "rd-v118": "glove-box-damper",
  "rd-v109": "glove-box-damper", "rd-v126a": "glove-box-damper",
  "rd-v126": "glove-box-damper", "rd-v127": "glove-box-damper",
  "rd-v129": "glove-box-damper", "rd-v130": "glove-box-damper",
  "rd-v130a": "glove-box-damper",
  "rd-01": "latch", "rd-02": "latch", "rd-03": "latch",
  "rd-08": "latch", "rd-09": "latch", "rd-11": "latch",
  "rd-12": "latch", "rd-18": "latch",
  "rd-t180": "other", "rd-t180a": "other", "rd-t181": "other",
  "rd-t182": "other", "rd-t216": "other", "rd-13": "other",
  "rd-15": "other", "rd-tr01a": "other", "rd-tr01": "other",
  "rd-tr02": "other", "rd-tr05": "other", "rd-v112": "other",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /news/slug → /news/slug.html
  if (pathname.startsWith("/news/") && !pathname.endsWith(".html")) {
    return NextResponse.redirect(new URL(`${pathname}.html`, request.url), 301);
  }

  // /products/slug → /category/slug
  if (pathname.startsWith("/products/")) {
    const slug = pathname.split("/").pop() || "";
    const category = PRODUCT_CATEGORY_MAP[slug];
    if (category) {
      return NextResponse.redirect(new URL(`/${category}/${slug}`, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/news/:path*", "/products/:path*"],
};
