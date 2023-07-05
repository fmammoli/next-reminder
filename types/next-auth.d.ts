import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    idToken: string;
    expiresAt: number;
    refreshToken: string;
    isAnonymous: boolean;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    isAnonymous: boolean;
    idToken: string;
    refreshToken: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      userId: string;
      isAnonymous: boolean;
      randomColors?: string[];
      isNewUser: boolean;
      googleOAuth: {
        access_token: string;
        id_token: string;
        expires_at: number;
        refresh_token: string;
        error?: "RefreshAccessTokenError";
      };
      firebase: {
        customToken: string | null;
        idToken: string;
        expirationTime: number;
        isAnonymous: boolean;
      };
    } & DefaultSession["user"];
  }
}
