import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME || "hc_access_token";

// Mappings of role hierarchy / access validation
const pathRoleRequirements = [
  { prefix: "/patient", role: "PATIENT" },
  { prefix: "/professional", role: "PROFESSIONAL" },
  { prefix: "/agency", role: "AGENCY" },
  { prefix: "/admin", role: "ADMIN" },
];

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // Decode base64url payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    const payload = JSON.parse(jsonPayload);
    
    // Check expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let public auth endpoints, logins, and registrations pass
  const isPublicAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/patient/login") ||
    pathname.startsWith("/patient/register") ||
    pathname.startsWith("/patient/forgot-password") ||
    pathname.startsWith("/agency/login") ||
    pathname.startsWith("/agency/register") ||
    pathname.startsWith("/agency/forgot-password") ||
    pathname.startsWith("/professional/login") ||
    pathname.startsWith("/professional/register") ||
    pathname.startsWith("/professional/forgot-password") ||
    pathname.startsWith("/unauthorized");

  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  // Check if route matches protected prefixes
  const match = pathRoleRequirements.find((req) => pathname.startsWith(req.prefix));

  if (match) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      // Redirect unauthenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      // Token expired or invalid
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = (payload.role || "").toUpperCase();

    // Check Role Validation
    let isAuthorized = false;
    if (userRole === "SUPER_ADMIN") {
      isAuthorized = true;
    } else if (userRole === "ADMIN") {
      // Admin has access to everything except super_admin specific subpaths (if any)
      isAuthorized = true;
    } else {
      // Match exact role weight or higher
      isAuthorized = userRole === match.role;
    }

    if (!isAuthorized) {
      // Redirect unauthorized
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  const response = NextResponse.next();

  // Multi-tenant header validation (Preserved existing logic)
  const host = request.headers.get("host") || "app.homecare.in";
  let tenantId = "agency-1"; // Default tenant sandbox

  if (host.includes(".homecare.in")) {
    const parts = host.split(".");
    if (parts.length > 2 && parts[0] !== "app" && parts[0] !== "www") {
      tenantId = parts[0];
    }
  }

  // Inject secure tenant isolation headers
  response.headers.set("x-tenant-id", tenantId);
  response.headers.set("x-frame-options", "SAMEORIGIN");
  
  return response;
}

export const config = {
  matcher: ["/patient/:path*", "/professional/:path*", "/agency/:path*", "/admin/:path*"],
};
