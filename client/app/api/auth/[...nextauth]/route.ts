import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "../../../lib/prisma";

export const authOptions = {
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
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "database" as const },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async session({ session, user }: { session: import('next-auth').Session; user: { id: string } }) {
      if (session.user) {
        session.user.id = user.id;
      }
      // Ensure the returned object matches the Session type (must include 'expires')
      return session;
    },
    async signIn(params: {
      user: { email?: string | null };
      account: { provider?: string } | null;
      profile?: unknown;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      const { user, account } = params;
      if (account && account.provider === "github") {
        const email = user.email ?? "";
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          return true;
        }
      }
      return true;
    }
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
