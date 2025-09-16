import type { NextAuthOptions } from "next-auth";
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
async function refreshAccessToken(token: any) {
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
      params.set("refresh_token", token.refreshToken);
    } else if (token.provider === "github") {
      url = "https://github.com/login/oauth/access_token";
      params.set("client_id", process.env.GITHUB_CLIENT_ID!);
      params.set("client_secret", process.env.GITHUB_CLIENT_SECRET!);
      params.set("grant_type", "refresh_token");
      params.set("refresh_token", token.refreshToken);
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
      // Initial sign in (user + account present)
      if (account && user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = (user as any).email;

        // Save provider + tokens (if present)
        if (account.access_token) token.accessToken = account.access_token;
        if (account.refresh_token) token.refreshToken = account.refresh_token;
        token.provider = account.provider;

        // account.expires_at is usually seconds since epoch (provider-dependent)
        if (account.expires_at) {
          token.accessTokenExpires = Number(account.expires_at) * 1000;
        } else if (account.expires_in) {
          token.accessTokenExpires = Date.now() + Number(account.expires_in) * 1000;
        } else {
          // default to 1 hour if provider didn't give expiry
          token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        }

        return token;
      }

      // Subsequent requests: if no provider access token present, just return token.
      if (!token.accessToken || !token.accessTokenExpires) return token;

      // If access token still valid, return it
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token expired -> attempt to refresh
      return await refreshAccessToken(token);
    },
    /**
     * Session callback:
     * Attach minimal, safe info to the session object available client-side.
     * Avoid leaking refreshToken or secrets to the client.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.themePreference = token.themePreference as
          | "MODERN"
          | "MINIMAL"
          | undefined;
      }

      // Expose a short-lived access token for calling your own APIs if needed.
      if ((token as any).accessToken && (token as any).accessTokenExpires) {
        session.accessToken = (token as any).accessToken;
        session.accessTokenExpires = (token as any).accessTokenExpires;
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
