import { signInWithCustomToken } from "firebase/auth";
import { Session } from "next-auth";
import { adminAuth } from "./serverApp";
import { auth } from "./clientApp";

export default async function getFirebaseIdToken(session: Session) {
  if (!session.user || !session.user.email) {
    throw new Error(
      "Error: Cannot get firebase Id token from session, session.user is undefined."
    );
  }

  const firebaseToken = session.user.firebase?.customToken;
  const expirationTime = session.user.firebase?.expirationTime;

  if (firebaseToken && Date.now() / 1000 <= expirationTime) {
    // console.log("reusing customToken");
    return signInWithCustomToken(auth, firebaseToken);
  }

  const token = await adminAuth.createCustomToken(session.user.email);
  return signInWithCustomToken(auth, token);
}
