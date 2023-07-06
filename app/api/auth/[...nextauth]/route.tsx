import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminAuth, firestore } from "@/lib/firebase/serverApp";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { Adapter } from "next-auth/adapters";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  adapter: FirestoreAdapter(firestore) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      idToken: true,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "anon",
      credentials: {
        idToken: { label: "accessToken", type: "text", placeholder: "0x0" },
        refreshToken: {
          label: "refreshToken",
          type: "text",
          placeholder: "0x0",
        },
        isAnonymous: {
          label: "anonymous",
          placeholder: "true",
          type: "boolean",
        },
        uid: {
          lable: "uid",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        if (credentials) {
          return {
            id: credentials.uid,
            userId: credentials.uid,
            idToken: credentials.idToken,
            refreshToken: credentials.refreshToken,
            name: "Anonymous user :)",
            isAnonymous: true,
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, trigger, user, session, profile }) {
      if (trigger === "update") {
        try {
          const { exp } = await adminAuth.verifyIdToken(session.idToken);
          return {
            ...token,
            firebase: {
              ...session.firebase,
              customToken: session.customToken,
              idToken: session.idToken,
              expirationTime: exp,
            },
            updated: true,
          };
        } catch (error) {
          console.log(
            "Error verifying idToken after firebase loginWithCustomToken."
          );
          throw error;
        }
      }
      if (trigger === "signIn" || trigger === "signUp") {
        console.log(`JWT: Trigger: ${trigger}`);
        if (account && user) {
          if (user.isAnonymous === true && account.provider === "anon") {
            const verificationResult = await adminAuth.verifyIdToken(
              user.idToken
            );
            if (firestore) {
              return {
                ...token,
                userId: account.userId,
                isAnonymous: true,
                isNewUser: trigger === "signUp" ? true : false,
                firebase: {
                  customToken: null,
                  idToken: user.idToken,
                  refreshToken: user.refreshToken,
                  isAnonymous: true,
                  expirationTime: verificationResult.exp,
                  providerId: verificationResult.provider_id,
                },
              };
            }
          } else {
            if (
              account.access_token &&
              account.id_token &&
              account.refresh_token &&
              account.expires_at
            ) {
              return {
                ...token,
                userId: user.id,
                isAnonymous: false,
                isNewUser: trigger === "signUp" ? true : false,
                googleOAuth: {
                  access_token: account.access_token,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                },
              };
            }
          }
        } else {
          throw new Error(
            `JWT Error: Either user or account is empty: User=> email:${user.email} , ${user.name} ||| Account: ${account?.userId} , ${account?.provider}`
          );
        }
      }
      console.log("JWT: No trigger");
      console.log(token);
      return token;
    },

    session: async ({ session, token, user, trigger }) => {
      return {
        ...session,
        user: { ...session.user, ...token },
      };
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
