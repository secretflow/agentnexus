import { parseRequestUrl } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. /_static/ (static files inside /public folder)
     * 5. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest, .well-known
     */
    "/((?!api/|_next/|_proxy/|_static/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.well-known).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const { path, fullPath } = parseRequestUrl(req);
  const user = await getCurrentUser();

  if (!user && path !== "/login" && !path.startsWith("/chat")) {
    return NextResponse.redirect(
      new URL(`/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`, req.url),
    );
  }

  if (path === "/") {
    return NextResponse.redirect(new URL("/workspaces", req.url));
  }

  return NextResponse.next();
}
