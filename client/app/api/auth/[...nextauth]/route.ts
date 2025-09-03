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
  async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  async signIn({ user, account }: { user: any; account: any }) {
  if (account?.provider === "github") {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email ?? "" },
    });
    if (existingUser) {
      return true;
    }
  }
  return true;
}},
  debug: process.env.NEXTAUTH_DEBUG === "true",
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
