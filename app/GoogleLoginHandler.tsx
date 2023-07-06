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

  console.log(`LoginHandler: ${session}`);
  console.log(session);

  useEffect(() => {
    async function anonFirebaseLogin() {
      // console.log("going to to create anon login");
      const loginResponse = await signInAnonymously(auth);
      const loginIdtoken = await loginResponse.user.getIdToken();
      console.log(loginResponse);
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
        console.log("AAA");
        if (data.isAnonymous === true) {
          console.log("BBB");
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
    console.log(firebaseResponse);
    return firebaseResponse;
  };
  console.log("--------Start---------------");
  console.log(session?.user);
  console.log(auth.currentUser);
  console.log("-----------End------------");
  if (
    session &&
    session.user.isAnonymous === false &&
    auth.currentUser?.isAnonymous
  ) {
    if (anonIdRef) {
      console.log("going to sign in with firebase");
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

  return (
    <>
      <div>
        <h3>Firebase auth.currrentUser</h3>
        <p> uid : {auth.currentUser?.uid + ""}</p>
        <p>Email: {auth.currentUser?.email + ""}</p>
        <p>DisplayName: {auth.currentUser?.displayName + ""}</p>
        <p>isAnonymous: {auth.currentUser?.isAnonymous + ""}</p>
      </div>
      <p>-------------------------</p>
      <div>
        <h3>NextAuth Session</h3>
        <p>userId: {session?.user.userId + ""}</p>
        <p>Email: {session?.user.email + ""}</p>
        <p>Name: {session?.user.name + ""}</p>
        <p>isAnonymous: {session?.user.isAnonymous + ""}</p>
        <p>isNewUser: {session?.user.isNewUser + ""}</p>
      </div>

      {children}
    </>
  );
}
