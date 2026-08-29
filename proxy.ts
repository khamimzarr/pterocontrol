import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  // /dashboard = etalase publik (pratinjau) — tidak dikunci. Yang dikunci hanya /panels, /akun, /admin
  const isProtected = pathname.startsWith("/panels") || pathname.startsWith("/akun");
  const isAdminRoute = pathname.startsWith("/admin");

  // Unauthenticated -> redirect protected to /login
  if (!user && (isProtected || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated user on /login or /register -> check status
  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.status === "PENDING") {
      // Let register page show pending state; don't bounce login spam
      if (pathname === "/login") {
        const url = request.nextUrl.clone();
        url.pathname = "/register";
        url.searchParams.set("status", "pending");
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }
    if (profile?.status === "REJECTED") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "rejected");
      return NextResponse.redirect(url);
    }
    if (profile?.status === "APPROVED") {
      const url = request.nextUrl.clone();
      url.pathname = profile?.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Pending/rejected trying to hit protected
  if (user && (isProtected || isAdminRoute)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.status !== "APPROVED") {
      const url = request.nextUrl.clone();
      if (profile?.status === "REJECTED") {
        url.pathname = "/login";
        url.searchParams.set("error", "rejected");
      } else {
        url.pathname = "/register";
        url.searchParams.set("status", "pending");
      }
      return NextResponse.redirect(url);
    }
    if (isAdminRoute && profile.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/panels/:path*", "/admin/:path*", "/akun/:path*", "/login", "/register"],
};
