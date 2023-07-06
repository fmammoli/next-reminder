"use client";

import { auth } from "@/lib/firebase/clientApp";
import { UserCredential, signInWithCustomToken } from "firebase/auth";
import { Session } from "next-auth/core/types";
import { useEffect, useReducer } from "react";
import { NextAuthUseSessionReturnTypes } from "./useSyncFirebaseAndNextAuthSessions";
import { Reminder } from "@/types/Reminder";
import { sendArray } from "./_actions";
import { useRouter } from "next/navigation";

//TODO ***
//This is badly named, not very descriptive

interface State {
  user: Session | null;
  isPending: boolean | null;
  completed: boolean | null;
}

interface Action {
  type: string;
  payload: State;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function useFirebaseLogin({
  session,
  status,
  update,
}: NextAuthUseSessionReturnTypes) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    isPending: true,
    completed: false,
  });

  //This is needed because useEffect is only shallow comparing the session object.
  const isAnonymous = session ? session.user.isAnonymous : null;

  const router = useRouter();

  useEffect(() => {
    async function firebaseSignInWithCustomToken(
      email: string
    ): Promise<{ firebaseResponse: UserCredential; customToken: string }> {
      try {
        const response = await fetch("/api/createCustomToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        const { token } = await response.json();
        const firebaseResponse = await signInWithCustomToken(auth, token);

        return { firebaseResponse, customToken: token };
      } catch (error) {
        throw error;
      }
    }

    async function signInWithFirebase(userEmail: string) {
      try {
        const response = await firebaseSignInWithCustomToken(userEmail);

        const idToken = await response.firebaseResponse.user.getIdToken();
        const {
          displayName,
          email,
          emailVerified,
          isAnonymous,
          photoURL,
          providerId,
          refreshToken,
          uid,
        } = response.firebaseResponse.user;

        const data = {
          customToken: response.customToken,
          idToken: idToken,
          displayName,
          email,
          emailVerified,
          isAnonymous,
          photoURL,
          providerId,
          refreshToken,
          uid,
        };
        const updatedSession = await update(data);

        return updatedSession;
      } catch (error) {
        throw error;
      }
    }

    if (
      status === "authenticated" &&
      session &&
      isAnonymous === false &&
      (!auth.currentUser || auth.currentUser.isAnonymous === true)
    ) {
      if (session.user.email) {
        let localReminders: Reminder[] | null = null;
        let anonId: string | null = null;
        // if (auth.currentUser && auth.currentUser.isAnonymous) {
        //   anonId = { ...auth.currentUser }.uid;
        //   const data = window.localStorage.getItem(
        //     `my-reminders-anon-${anonId}`
        //   );
        //   console.log(data);
        //   if (data) {
        //     localReminders = JSON.parse(data);
        //   }
        // }
        const data = window.localStorage.getItem(`my-reminders-anon-test`);

        if (data) {
          localReminders = JSON.parse(data);
        }
        signInWithFirebase(session.user.email).then((newSession) => {
          if (newSession) {
            if (localReminders && localReminders.length > 0) {
              sendArray(
                localReminders.map((item) => {
                  return {
                    ...item,
                    userId: session.user.userId,
                    createdAt: new Date(item.createdAt),
                  };
                }),
                newSession
              );
            }
          }
          dispatch({
            type: "update",
            payload: { user: newSession, isPending: false, completed: true },
          });
          const data = window.localStorage.removeItem(`my-reminders-anon-test`);
        });
      }
    }
  }, [session, isAnonymous, status, update]);

  return { ...state };
}
