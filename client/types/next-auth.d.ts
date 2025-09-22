import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string
      /** Optional theme preference stored on the user (e.g., 'MODERN'|'MINIMAL') */
      themePreference?: string | null
      /** Optional plan (free, premium, pro) */
      plan?: string | null
    } & DefaultSession["user"]
    // Optional short-lived access token (populated server-side)
    accessToken?: string;
    accessTokenExpires?: number;
  }
}