"use client";

import { auth } from "@/lib/firebase/clientApp";
import { User, signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";

//TODO *********
//This is badly name, it is not only about anonymous users.
//Should find a better name.

export default function useAnonymousLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  //   useEffect(() => {
  //     return auth.beforeAuthStateChanged((user) => {
  //       console.log("Before Auth state changed.");
  //       console.log(user);
  //     });
  //   }, []);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (!user) {
        signInAnonymously(auth)
          .then((newAnonUser) => setUser(newAnonUser.user))
          .catch((error) => {
            throw error;
          });
      }

      setUser(user);
      setIsPending(false);
    });
  }, []);

  return { user, isPending, completed: !isPending };
}
