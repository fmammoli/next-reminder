"use client";
import { ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";
import useSyncFirebaseAndNextAuthSessions from "./useSyncFirebaseAndNextAuthSessions";
import { Button } from "@/components/ui/button";
import { deleteUsers } from "./_actions";

const DEBUG = false;

export default function FirebaseSessionHandler({
  children,
}: {
  children: ReactNode;
}) {
  console.log("FirebaseSessionHandler render");
  const { data: session, status, update } = useSession();

  const { user, isPending, completed } = useSyncFirebaseAndNextAuthSessions({
    session,
    status,
    update,
  });
  if (completed && user && status === "unauthenticated" && session === null) {
    user.getIdToken().then((idToken) => {
      const credentials = {
        uid: user.uid,
        idToken: idToken,
        refreshToken: user.refreshToken,
      };
      signIn("anonymousSignIn", {
        redirect: false,
        ...credentials,
        callbackUrl: `${window.location.origin}`,
      });
    });
  }

  return (
    <div>
      {DEBUG && (
        <>
          <div>
            <h2>FirebaseUser</h2>
            {isPending && <h3>Loading....</h3>}

            {JSON.stringify(user)
              .split(",")
              .map((item, index) => (
                <p key={index}>{item}</p>
              ))}
          </div>

          <div className="mt-10">
            <h2>NextAuth Session</h2>

            <p>Nextauth session status: {status}</p>
            {status === "loading" && JSON.stringify(session)}

            {status === "unauthenticated" && JSON.stringify(session)}

            {status === "authenticated" &&
              JSON.stringify(session)
                .split(",")
                .map((item, index) => <p key={index}>{item}</p>)}
          </div>
          <Button
            onClick={() =>
              deleteUsers()
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
            }
          >
            Delete Authenticated user
          </Button>
        </>
      )}

      <div>{children}</div>
    </div>
  );
}
