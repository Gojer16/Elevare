import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

/**
 * @swagger
 * /api/auth/{...nextauth}:
 *   get:
 *     summary: NextAuth.js session management
 *     description: |
 *       The main endpoint for NextAuth.js. It handles various authentication actions like sign-in, sign-out, and session management.
 *       This endpoint is typically not called directly but is used by the NextAuth.js client-side utilities.
 *     tags:
 *       - Authentication
 *   post:
 *     summary: NextAuth.js session management
 *     description: |
 *       The main endpoint for NextAuth.js. It handles various authentication actions like sign-in, sign-out, and session management.
 *       This endpoint is typically not called directly but is used by the NextAuth.js client-side utilities.
 *     tags:
 *       - Authentication
 */

/**
 * This is the main NextAuth.js route handler.
 * It dynamically handles all authentication-related requests under `/api/auth/*`.
 *
 * The behavior of this endpoint is configured by the `authOptions` object,
 * which is defined in `@/app/lib/auth.ts`. This includes specifying
 * authentication providers (e.g., Google, GitHub, credentials), session strategies,
 * callbacks, and more.
 *
 * The handler is exported for both GET and POST methods, as NextAuth.js uses
 * both for different parts of the authentication flow.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };