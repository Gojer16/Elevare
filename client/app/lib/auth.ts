import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

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
        email: { 
          label: "Email", 
          type: "text", 
          placeholder: "jsmith@example.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) return null;

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.name = user.name;
    token.email = user.email;
    token.themePreference = user.themePreference;
  } else if (token.email) {
    // fetch fresh themePreference from DB
    const dbUser = await prisma.user.findUnique({
      where: { email: token.email as string },
      select: { themePreference: true },
    });
    if (dbUser) {
      token.themePreference = dbUser.themePreference;
    }
  }

  return token;
},
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
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        const email = user.email ?? "";
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return true;
      }
      return true;
    },
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
