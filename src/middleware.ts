import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "brightloop_session";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/customers",
  "/products",
  "/plans",
  "/quotations",
  "/subscriptions",
  "/invoices",
  "/payments",
  "/discounts",
  "/taxes",
  "/reports",
  "/settings",
  "/portal",
];

// Routes only accessible by admin
const adminOnlyRoutes = ["/settings", "/staff"];

// Routes only accessible by staff or admin (not customers)
const staffOnlyRoutes = [
  "/customers",
  "/products",
  "/plans",
  "/quotations",
  "/subscriptions",
  "/invoices",
  "/payments",
  "/discounts",
  "/taxes",
  "/reports",
  "/settings",
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const isAuthRoute = authRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const isProtected = protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const isAdminRoute = adminOnlyRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const isStaffRoute = staffOnlyRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const isPortal = pathname === "/portal" || pathname.startsWith("/portal/");

  // No session
  if (!token) {
    if (isProtected || isAdminRoute || isStaffRoute || isPortal) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // We cannot decode the token in middleware without the secret easily,
  // but we can still enforce presence. Role-based checks happen server-side.
  // Redirect authenticated users away from auth pages.
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.ico$).*)"],
};
