import { Session } from "next-auth/core/types";
import useAnonymousLogin from "./useAnonymousLogin";
import useFirebaseLogin from "./useFirebaseLogin";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//TODO
//This hook can be more informative to the user. Returno more interesting data and status about the login operations

export type NextAuthUseSessionReturnTypes = {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
  update: (data?: any) => Promise<Session | null>;
};

export default function useSyncFirebaseAndNextAuthSessions({
  session,
  status,
  update,
}: NextAuthUseSessionReturnTypes) {
  const [inSync, setInSync] = useState(false);
  const router = useRouter();
  const { user, isPending, completed } = useAnonymousLogin();
  const {
    user: user2,
    isPending: isPending2,
    completed: completed2,
  } = useFirebaseLogin({
    session,
    status,
    update,
  });
  useEffect(() => {
    if (completed && completed2) {
      if (user && user2) {
        if (!user.isAnonymous && !user2.user.isAnonymous) {
          setInSync(true);
          //   router.refresh();
        }
      }
    }
  }, [user, user2, completed, completed2, router]);

  return {
    user: user,
    isPending: isPending,
    completed: completed,
    inSync: inSync,
  };
}
