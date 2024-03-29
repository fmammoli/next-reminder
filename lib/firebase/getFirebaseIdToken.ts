import { Session } from "next-auth";
import { adminAuth } from "./serverApp";
import { auth } from "./clientApp";
import { signInWithCustomToken } from "firebase/auth";

export default async function getFirebaseIdToken(session: Session) {
  if (!session.user || !session.user.email) {
    throw new Error(
      "Error: Cannot get firebase Id token from session, session.user is undefined."
    );
  }

  try {
    const firebaseToken = session.user.firebase?.customToken;
    const expirationTime = session.user.firebase?.expirationTime;

    if (firebaseToken && Date.now() / 1000 <= expirationTime) {
      const res = await signInWithCustomToken(auth, firebaseToken);
      return res;
    }
    const token = await adminAuth.createCustomToken(session.user.email);
    const res = await signInWithCustomToken(auth, token);
    return res;
  } catch (error) {
    console.log("Error  refershing firebase Id token");
    throw error;
  }
}
