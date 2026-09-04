import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { PARTNERS } from "@/lib/partners";

// Partner subdomains (e.g. ledgebrook.belegendary.org) serve that partner's
// branded page at the root: we map the leading DNS label to a partner slug and
// rewrite "/" → "/<slug>" internally. The browser URL stays on the subdomain.
function partnerSlugForHost(host: string | null): string | null {
  if (!host) return null;
  const label = host.split(":")[0].split(".")[0].toLowerCase();
  return PARTNERS[label] ? label : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Partner subdomain → cohort page (root only) ─────────────────────────────
  const slug = partnerSlugForHost(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  );
  if (slug && (pathname === "/" || pathname === "")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}`;
    return NextResponse.rewrite(url);
  }

  // ── Admin auth (protects /admin/* except /admin/login) ──────────────────────
  if (pathname.startsWith("/admin")) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options?: Record<string, unknown>;
            }[]
          ) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLogin = pathname === "/admin/login";

    if (!user && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (user && isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Root (for partner-subdomain rewrites) + all admin routes (for auth).
  matcher: ["/", "/admin/:path*"],
};
