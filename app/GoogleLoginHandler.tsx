"use client";

import { ReactNode, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase/clientApp";
import { Reminder } from "@/types/Reminder";
import { Session } from "next-auth/core/types";
import { sendArray } from "./_actions";
import randomColor from "randomcolor";

export default function LoginHandler({
  logged,
  isAnon,
  children,
}: {
  logged?: boolean;
  isAnon?: boolean;
  children?: ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const anonIdRef = useRef<null | string>(null);

  // console.log("Login handler");

  useEffect(() => {
    async function anonFirebaseLogin() {
      // console.log("going to to create anon login");
      const loginResponse = await signInAnonymously(auth);
      const loginIdtoken = await loginResponse.user.getIdToken();

      const credentials = {
        idToken: loginIdtoken,
        refreshToken: loginResponse.user.refreshToken,
        isAnonymous: true,
        uid: loginResponse.user.uid,
        anonColors: randomColor({ count: 5, seed: loginResponse.user.uid }),
      };

      const res = await signIn("anon", {
        redirect: false,
        ...credentials,
        callbackUrl: `${window.location.origin}`,
      });
      // console.log("signed in annon");
    }

    const unsubscribe = auth.onAuthStateChanged(async (data) => {
      if (data === null) {
        // console.log("Auth state date is null. Should create a new anon user.");
        await anonFirebaseLogin();
        router.refresh();
      } else {
        // console.log(
        //   "Auth state is not null, should determine if it is anon or identified."
        // );
        if (data.isAnonymous === true) {
          anonIdRef.current = data.uid;
          router.refresh();
          // console.log(
          //   "There is a user and he is annonymous, should load from localstorage"
          // );
        }
      }
    });

    return unsubscribe;
  }, [router]);

  const signInWithFirebase = async (session: Session) => {
    const response = await fetch("/api/createCustomToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: session.user }),
    });

    const { token } = await response.json();
    const firebaseResponse = await signInWithCustomToken(auth, token);

    return firebaseResponse;
  };

  if (
    session &&
    session.user.isAnonymous === false &&
    auth.currentUser?.isAnonymous
  ) {
    if (anonIdRef) {
      signInWithFirebase(session).then((response) => {
        const localReminders = window.localStorage.getItem(
          `my-reminders-anon-${anonIdRef.current}`
        );

        if (localReminders && session.user.isNewUser) {
          // console.log("is new user, linking reminders");
          const data = JSON.parse(localReminders);

          sendArray(
            data.map((item: Reminder) => {
              return {
                ...item,
                userId: session.user.userId,
                createdAt: new Date(item.createdAt),
              };
            }),
            session
          ).then(() => router.refresh());

          window.localStorage.removeItem(
            `my-reminders-anon-${anonIdRef.current}`
          );
        }
      });
    }
  }

  return <>{children}</>;
}
