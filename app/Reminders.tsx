import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import {
  Firestore,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/clientApp";
import { Reminder } from "@/types/Reminder";
import reminderConverter from "@/lib/firebase/reminderFirestoreConverter";
import OptimisticReminders from "./OptimisticReminders";
import getFirebaseIdToken from "@/lib/firebase/getFirebaseIdToken";

export default async function Reminders() {
  const session = await getServerSession(authOptions);
  const logged = !!session?.user?.email || false;

  async function getReminders(db: Firestore, userId: string) {
    const userRef = doc(db, "users", userId);
    const reminderCollectionRef = collection(
      db,
      `users/${userId}/reminders`
    ).withConverter(reminderConverter);

    const queryRef = query(reminderCollectionRef, orderBy("createdAt", "desc"));

    const remindersSnapshot = await getDocs(queryRef);
    const remindersList = remindersSnapshot.docs.map((doc) => doc.data());
    return remindersList;
  }

  let reminders: Reminder[] | [] = [];

  if (
    session &&
    logged &&
    session.user &&
    session.user.email &&
    session.user.isAnonymous === false
  ) {
    if (!auth.currentUser) {
      // console.log(
      //   "Reminders: Auth.current user is null, logging in to firebase with custom token."
      // );
      const firebaseUser = await getFirebaseIdToken(session);
    } else {
      console.log(
        "Reminders: Has firebase auth.current user with id: " +
          auth.currentUser.uid
      );
    }

    reminders = await getReminders(db, session.user.userId);
    // console.log("Reminders: Fetch completed.");
  } else {
    //throw new Error(`Reminders: error session data is weird: ${session}`);
    // console.log(`Reminders: error session data is weird: ${session}`);
    // console.log(session);
  }
  return (
    <>
      <OptimisticReminders
        reminders={reminders}
        serverSession={session}
      ></OptimisticReminders>
    </>
  );
}
