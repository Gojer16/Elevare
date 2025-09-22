import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

/**
 * Helper to refresh OAuth access tokens for supported providers.
 * Accepts the `token` object previously stored in the JWT.
 * Returns a token object with refreshed accessToken, accessTokenExpires, and refreshToken.
 */
async function refreshAccessToken(token: JWT) {
  try {
    if (!token?.refreshToken || !token.provider) {
      throw new Error("No refresh token or provider available");
    }

    let url: string;
    const params = new URLSearchParams();

    if (token.provider === "google") {
      url = "https://oauth2.googleapis.com/token";
      params.set("client_id", process.env.GOOGLE_CLIENT_ID!);
      params.set("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
      params.set("grant_type", "refresh_token");
      if (typeof token.refreshToken === 'string') {
        params.set("refresh_token", token.refreshToken);
      }
    } else if (token.provider === "github") {
      url = "https://github.com/login/oauth/access_token";
      params.set("client_id", process.env.GITHUB_CLIENT_ID!);
      params.set("client_secret", process.env.GITHUB_CLIENT_SECRET!);
      params.set("grant_type", "refresh_token");
      if (typeof token.refreshToken === 'string') {
        params.set("refresh_token", token.refreshToken);
      }
    } else {
      throw new Error(`Refresh not implemented for provider: ${token.provider}`);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });

    const refreshed = await res.json();

    if (!res.ok) {
      throw refreshed;
    }

    // Map provider response differences to a unified shape.
    const newAccessToken = refreshed.access_token ?? refreshed.accessToken;
    const newRefreshToken = refreshed.refresh_token ?? refreshed.refreshToken ?? token.refreshToken;
    const expiresInSec = refreshed.expires_in ?? refreshed.expiresIn ?? 3600;

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: Date.now() + expiresInSec * 1000,
      refreshToken: newRefreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("refreshAccessToken error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// Extended token shape used in callbacks
interface AppToken extends JWT {
  id?: string;
  name?: string | null;
  email?: string | null;
  provider?: string;
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: number;
  themePreference?: "MODERN" | "MINIMAL" | undefined;
  error?: string;
}

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) return null;

        const isCorrect = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isCorrect) return null;

        // sanitized user
        return { id: user.id, name: user.name ?? undefined, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    /**
     * JWT callback:
     * - On first sign in, persist provider tokens into JWT (access + refresh + expiry).
     * - On subsequent calls, if access token expired, try to refresh using refreshAccessToken.
     */
    async jwt({ token, user, account }) {
      // Narrow the token/user/account to app-specific shapes
      const t = token as AppToken;
      const u = user as AuthUser | undefined;
      const acct = account as Record<string, unknown> | null | undefined;

      // Initial sign in (user + account present)
      if (acct && u) {
        t.id = u.id;
        if (u.name) t.name = u.name;
        if (u.email) t.email = u.email;

        // Save provider + tokens (if present)
        const access = acct['access_token'] ?? acct['accessToken'];
        const refresh = acct['refresh_token'] ?? acct['refreshToken'];
        const provider = acct['provider'];

        if (typeof access === 'string') t.accessToken = access;
        if (typeof refresh === 'string') t.refreshToken = refresh;
        if (typeof provider === 'string') t.provider = provider;

        // account.expires_at is usually seconds since epoch (provider-dependent)
        const expiresAt = acct['expires_at'] ?? acct['expiresAt'];
        const expiresIn = acct['expires_in'] ?? acct['expiresIn'];
        if (typeof expiresAt === 'number' || typeof expiresAt === 'string') {
          t.accessTokenExpires = Number(expiresAt) * 1000;
        } else if (typeof expiresIn === 'number' || typeof expiresIn === 'string') {
          t.accessTokenExpires = Date.now() + Number(expiresIn) * 1000;
        } else {
          // default to 1 hour if provider didn't give expiry
          t.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        }

        return t;
      }

      // Subsequent requests: if no provider access token present, just return token.
      if (!t.accessToken || !t.accessTokenExpires) return t;

      // If access token still valid, return it
      if (typeof t.accessTokenExpires === 'number' && Date.now() < t.accessTokenExpires) {
        return t;
      }

      // Access token expired -> attempt to refresh only if we have provider & refresh token
      if (!t.provider || !t.refreshToken) {
        // No way to refresh (e.g., credentials sign-in). Keep token and let APIs handle 401s.
        return t;
      }
      return await refreshAccessToken(t);
    },
    /**
     * Session callback:
     * Attach minimal, safe info to the session object available client-side.
     * Avoid leaking refreshToken or secrets to the client.
     */
    async session({ session, token }: { session: Session; token: AppToken }) {
      if (session.user) {
        // Token fields may be undefined; only overwrite when present
        if (token.id) session.user.id = token.id;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
        session.user.themePreference = token.themePreference ?? session.user.themePreference;
      }

      // Expose a short-lived access token for calling your own APIs if needed.
      if (typeof token.accessToken === 'string' && typeof token.accessTokenExpires === 'number') {
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (!account) return true; 
      if ((account.provider === "google" || account.provider === "github") && !user.email) {
        return false;
      }
      return true;
    },
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
