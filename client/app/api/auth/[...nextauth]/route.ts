import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // optional: authorization params to request refresh tokens
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // GitHub scopes: request email
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    // optional: custom sign-in / error pages
    signIn: "/login",
    error: "/login", // show errors on login page
  },
  callbacks: {
    // attach useful fields to token and session
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.user = {
          name: profile.name ?? profile.login ?? "",
          email: (profile as any).email ?? "",
          image: (profile as any).picture ?? (profile as any).avatar_url ?? null,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = { ...(session.user as any), ...(token.user ?? {}) };
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  // If you want persistence (users in DB) add an adapter here (PrismaAdapter, TypeORM, etc.)
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
