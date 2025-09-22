/**
 * Authentication and feature-access helpers for server-side handlers.
 *
 * Responsibilities:
 * - Retrieve the authenticated user from the NextAuth session (`getAuthenticatedUser`).
 * - Enforce feature-based access control for API routes (`requireFeatureAccess`, `withFeatureAccess`).
 * - Enforce developer-only access for admin features (`requireDeveloperAccess`, `withDeveloperAccess`).
 *
 * Behavior:
 * - When a user is unauthenticated, feature/developer requirement helpers surface a 401 JSON response.
 * - When a user lacks the required feature, helpers surface a 403 JSON response with upgrade metadata.
 * - When an unexpected error occurs, helpers surface a 500 JSON response.
 */
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { hasFeatureAccess, isDevUser, type UserPlan, type Feature } from "./features";

/**
 * Interface representing an authenticated user.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  plan: UserPlan;
  isDeveloper: boolean;
}

/**
 * Get the authenticated user derived from the server session.
 *
 * Attempts to resolve the NextAuth session via `getServerSession(authOptions)` and
 * normalizes the result into a typed `AuthenticatedUser`. Returns `null` when no
 * valid session exists.
 *
 * @param req - Optional `NextRequest` (not required by `getServerSession`, included for parity with other helpers)
 * @returns The authenticated user or `null` if unauthenticated
 */
export async function getAuthenticatedUser(req?: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return null;
    }

    const user = session.user as any;
    const plan = (user.plan as UserPlan) || "free";
    const email = user.email || "";

    return {
      id: user.id,
      email,
      name: user.name,
      plan,
      isDeveloper: isDevUser(email),
    };
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

/**
 * Check if the current user has access to a given feature (for API routes).
 *
 * Throws an Error("Authentication required") when no session is present.
 * Returns `{ user, hasAccess }` when authenticated. This makes it easy to either
 * continue with the `user` or craft an appropriate 403 response upstream.
 *
 * @param feature - The feature flag/key to check
 * @param req - Optional Next.js request (forwarded for consistency)
 * @returns Object with `user` and `hasAccess`
 * @throws Error when authentication is required
 */
export async function requireFeatureAccess(
  feature: Feature,
  req?: NextRequest
): Promise<{ user: AuthenticatedUser; hasAccess: boolean }> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    throw new Error("Authentication required");
  }

  const access = hasFeatureAccess(user.plan, feature, user.email);

  return { user, hasAccess: access };
}

/**
 * Middleware-like wrapper for API route handlers that require feature access.
 *
 * Usage:
 * ```ts
 * export const POST = withFeatureAccess(FEATURES.EXPORT_DATA)(async (user, req) => {
 *   // handler logic with guaranteed authenticated `user`
 * });
 * ```
 *
 * Returns 401 if unauthenticated and 403 if lacking the required feature. Otherwise,
 * forwards to the provided `handler` with `user` injected as the first argument.
 *
 * @param feature - The required feature key
 * @returns A higher-order handler that enforces access control
 */
export function withFeatureAccess(feature: Feature) {
  return function <T extends any[]>(
    handler: (user: AuthenticatedUser, ...args: T) => Promise<Response>
  ) {
    return async function (req: NextRequest, ...args: T): Promise<Response> {
      try {
        const { user, hasAccess } = await requireFeatureAccess(feature, req);

        if (!hasAccess) {
          return Response.json(
            {
              error: "Feature not available in your plan",
              feature,
              currentPlan: user.plan,
              upgradeRequired: true,
            },
            { status: 403 }
          );
        }

        return handler(user, ...args);
      } catch (error) {
        if (error instanceof Error && error.message === "Authentication required") {
          return Response.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        }

        console.error("Feature access error:", error);
        return Response.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * Ensure that the current user is a developer (admin-only features).
 *
 * Throws Error("Authentication required") when unauthenticated and
 * Error("Developer access required") when authenticated but not a developer.
 *
 * @param req - Optional Next.js request
 * @returns The authenticated developer user
 * @throws Error when authentication or developer status is missing
 */
export async function requireDeveloperAccess(req?: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(req);

  if (!user) {
    throw new Error("Authentication required");
  }

  if (!user.isDeveloper) {
    throw new Error("Developer access required");
  }

  return user;
}

/**
 * Wrapper for developer-only API route handlers.
 *
 * Returns 401 when unauthenticated and 403 when authenticated but not a developer.
 * Otherwise, forwards to the provided handler with `user` injected as the first argument.
 *
 * @param handler - The secured route handler expecting `(user, ...args)`
 * @returns A handler that enforces developer-only access
 */
export function withDeveloperAccess<T extends any[]>(
  handler: (user: AuthenticatedUser, ...args: T) => Promise<Response>
) {
  return async function (req: NextRequest, ...args: T): Promise<Response> {
    try {
      const user = await requireDeveloperAccess(req);
      return handler(user, ...args);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Authentication required") {
          return Response.json(
            { error: "Authentication required" },
            { status: 401 }
          );
        }
        if (error.message === "Developer access required") {
          return Response.json(
            { error: "Developer access required" },
            { status: 403 }
          );
        }
      }

      console.error("Developer access error:", error);
      return Response.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}