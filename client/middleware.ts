/**
  * Middleware for authentication and feature-gating.
  *
  * Responsibilities:
  * - Intercepts requests to protected routes (pages and API) as defined in `PROTECTED_ROUTES` and `config.matcher`.
  * - Ensures the user is authenticated via NextAuth JWT (`getToken`).
  * - Validates the user's subscription/plan access to requested features via `hasFeatureAccess`.
  * - For API routes lacking access, returns a JSON 403 response with upgrade metadata.
  * - For page routes lacking access, redirects to `/upgrade` with helpful query params.
  * - If unauthenticated on protected routes, redirects to `/login` with `callbackUrl` to return after login.
  *
  * Notes:
  * - Protected route patterns are defined in `config.matcher`; feature requirements are in `PROTECTED_ROUTES`.
  */
 import { NextResponse } from "next/server";
 import type { NextRequest } from "next/server";
 import { getToken } from "next-auth/jwt";
 import { hasFeatureAccess, type UserPlan, type Feature } from "./lib/features";
  
 /**
  * Map of exact pathname -> required feature key.
  *
  * This map is consulted at runtime to determine if a request's `pathname`
  * requires a specific feature to be enabled on the user's plan. Only exact
  * pathnames should be listed here. For pattern-based matching, use the
  * Next.js `config.matcher` below to restrict which routes the middleware runs on.
  */
 const PROTECTED_ROUTES: Record<string, Feature> = {
    // "/dashboard/analytics": "analytics",
    // "/dashboard/achievements": "achievements",
    "/dashboard/export": "export-data",
    "/dashboard/admin": "admin-panel",
    "/api/analytics": "analytics",
    "/api/achievements": "achievements",
    "/api/export": "export-data",
    "/api/admin": "admin-panel",
  };
  
 /**
  * Middleware entry point invoked for each request matching `config.matcher`.
  *
  * Flow:
  * 1. Determine if the current `pathname` requires a feature (via `PROTECTED_ROUTES`).
  * 2. If not protected, allow the request to continue.
  * 3. If protected, attempt to load the user's session token using NextAuth JWT.
  * 4. If no token, redirect to `/login?callbackUrl=<pathname>`.
  * 5. If token is present, compute the user's plan and validate feature access.
  * 6. If access is denied:
  *    - For API routes, return 403 JSON with helpful details for the client.
  *    - For page routes, redirect to `/upgrade?feature=<feature>&from=<pathname>`.
  * 7. Otherwise, continue request processing.
  *
  * @param request - The Next.js request object.
  * @returns `NextResponse` to continue or redirect/deny the request.
  */
  export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Check if this route requires feature access
    const requiredFeature = PROTECTED_ROUTES[pathname];
    if (!requiredFeature) {
      return NextResponse.next();
    }
    
    try {
    // Load the NextAuth JWT (requires NEXTAUTH_SECRET set in the environment)
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
      
      if (!token) {
      // Redirect to login if not authenticated. The callbackUrl ensures
      // the user is returned to the original page after successful login.
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
      
    const userPlan = (token.plan as UserPlan) || "free";
    const userEmail = token.email as string;
      
    // Check feature access
    if (!hasFeatureAccess(userPlan, requiredFeature, userEmail)) {
      // For API routes, return 403
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { 
            error: "Feature not available in your plan",
            feature: requiredFeature,
            currentPlan: userPlan,
            upgradeRequired: true
          },
          { status: 403 }
        );
      }
      
      // For pages, redirect to upgrade page
      const upgradeUrl = new URL("/upgrade", request.url);
      upgradeUrl.searchParams.set("feature", requiredFeature);
      upgradeUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(upgradeUrl);
    }
      
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}
  
 /**
  * Limit middleware execution to specific routes and subpaths.
  *
  * The entries below define which URL patterns will trigger this middleware.
  * This keeps middleware lightweight for the rest of the app and ensures
  * `PROTECTED_ROUTES` checks only run where relevant.
  */
  export const config = {
    matcher: [
      // Dashboard routes
      // "/dashboard/analytics/:path*",
      // "/dashboard/achievements/:path*",
      "/dashboard/export/:path*",
      "/dashboard/admin/:path*",
      
      // API routes
      "/api/analytics/:path*",
      "/api/achievements/:path*",
      "/api/export/:path*",
      "/api/admin/:path*",
    ],
};