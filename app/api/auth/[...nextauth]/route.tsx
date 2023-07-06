import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminAuth, firestore } from "@/lib/firebase/serverApp";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { Adapter } from "next-auth/adapters";
import randomColor from "randomcolor";

const DEBUG = false;

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
      id: "anonymousSignIn",
      credentials: {
        idToken: { label: "accessToken", type: "text", placeholder: "0x0" },
        refreshToken: {
          label: "refreshToken",
          type: "text",
          placeholder: "0x0",
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
            idToken: credentials.idToken,
            refreshToken: credentials.refreshToken,
            name: "Anonymous user :)",
            firebaseLogin: true,
            isAnonymous: true,
            randomColors: randomColor({ count: 5 }),
            createdAt: new Date(),
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (DEBUG) {
        console.log(`JWT: Trigger: ${trigger}`);
        console.log("JWT: This is token:");
        console.log(token);
        console.log("----------------------------------------");
        console.log("JWT: This is user:");
        console.log(user);
        console.log("----------------------------------------");
        console.log("JWT: This is account:");
        console.log(account);
        console.log("----------------------------------------");
        console.log("JWT: This is profile:");
        console.log(profile);
        console.log("----------------------------------------");
        console.log("JWT: This is session:");
        console.log(session);
        console.log("----------------------------------------");
      }
      if (trigger === "update") {
        if (session) {
          try {
            const response = await adminAuth.verifyIdToken(session.idToken);

            return {
              ...token,
              firebase: { ...session, expirationTime: response.exp },
            };
          } catch (error) {}
        }
      }

      if (trigger === "signUp") {
        if (account) {
          if (
            account.provider !== "anonymousSignIn" &&
            account.provider === "google" &&
            account.type === "oauth"
          ) {
            const newToken = {
              ...token,
              id: user.id,
              userId: user.id,
              isAnonymous: false,
              firebaseLogin: false,
              googleLogin: true,
              isNewUser: true,
              googleOatuh: {
                ...account,
              },
            };
            return newToken;
          }
        }
      }
      if (trigger === "signIn") {
        if (account) {
          if (
            account.provider === "anonymousSignIn" &&
            account.type === "credentials"
          ) {
            //Data here is comming from anon sign in in Firebase and its data should be put in token
            return {
              ...token,
              id: user.id,
              userId: user.id,
              isAnonymous: user.isAnonymous,
              firebaseLogin: user.firebaseLogin,
              googleLogin: false,
              randomColors: user.randomColors,
              firebase: { ...user },
            };
          } else if (
            account.provider !== "anonymousSignIn" &&
            account.provider === "google" &&
            account.type === "oauth"
          ) {
            const newToken = {
              ...token,
              id: user.id,
              userId: user.id,
              isAnonymous: false,
              firebaseLogin: false,
              googleLogin: true,
              isNewUser: true,
              googleOatuh: {
                ...account,
              },
            };
            return newToken;
          }
        }
      }
      return token;
    },
    async session({ session, token, user, newSession, trigger }) {
      if (DEBUG) {
        console.log(`Session: Trigger: ${trigger}`);
        console.log("Session: This is session:");
        console.log(session);
        console.log("----------------------------------------");
        console.log("Session: This is token:");
        console.log(token);
        console.log("----------------------------------------");
        console.log("Session: This is user:");
        console.log(user);
        console.log("----------------------------------------");
        console.log("Session: This is newSession:");
        console.log(newSession);
        console.log("----------------------------------------");
      }

      return { ...session, user: { ...session.user, ...token } };
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
