"use server";
import { auth, db } from "@/lib/firebase/clientApp";
import getFirebaseIdToken from "@/lib/firebase/getFirebaseIdToken";
import reminderConverter from "@/lib/firebase/reminderFirestoreConverter";
import { OptimisticReminder, Reminder } from "@/types/Reminder";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { Session } from "next-auth/core/types";

export async function sendArray(data: Reminder[], session: Session) {
  //console.log("Sending reminder array to firebase.");

  let firebaseLoggged = false;

  if (!auth.currentUser) {
    // console.log(
    //   "SendArray: Auth.current user is null, logging in to firebase with custom token."
    // );

    const firebaseUser = await getFirebaseIdToken(session);
    if (firebaseUser) firebaseLoggged = true;
  } else {
    // console.log(
    //   "SendArray: Has firebase auth.current user with id: " +
    //     auth.currentUser.uid
    // );
    firebaseLoggged = true;
  }
  if (firebaseLoggged) {
    const batch = writeBatch(db);
    const userRef = doc(db, "users", session.user.userId);
    const reminderCollectionRef = collection(
      userRef,
      "reminders"
    ).withConverter(reminderConverter);
    [...data].forEach((item: Reminder) => {
      const itemRef = doc(reminderCollectionRef);
      batch.set(itemRef, {
        ...item,
        id: itemRef.id,
        userId: session.user.userId,
        createdAt: new Date(item.createdAt),
      });
    });

    const res = await batch.commit();

    return {
      code: "Success",
      message: `New documents added to user`,
      ok: true,
    };
  } else {
    throw new Error(`Error verifying firestore session: ${session.user.email}`);
  }
}

export async function send(data: OptimisticReminder, session: Session) {
  // console.log("Sending new reminder to firebase.");

  let firebaseLoggged = false;

  if (!auth.currentUser) {
    // console.log(
    //   "Send: Auth.current user is null, logging in to firebase with custom token."
    // );
    try {
      const firebaseUser = await getFirebaseIdToken(session);
      if (firebaseUser) firebaseLoggged = true;
    } catch (error) {
      throw error;
    }
  } else {
    // console.log(
    //   "Send: Has firebase auth.current user with id: " + auth.currentUser.uid
    // );
    firebaseLoggged = true;
  }
  console.log(session);
  if (!firebaseLoggged)
    throw new Error(`Error verifying firestore session: ${session.user.email}`);
  if (!session || !session.user.userId)
    throw new Error(
      `Error now session data firestore session: ${session.user}`
    );
  if (firebaseLoggged && session.user.userId) {
    //Save reminders on a separete collection
    // const reminderCollectionRef = collection(db, "reminders").withConverter(
    //   reminderConverter
    // );
    // const newReminderRef = doc(reminderCollectionRef);

    //Save reminder to user subcollection
    try {
      // const userRef = doc(db, "users", session.user.userId);
      // const a = collection(db, "users", session.user.userId).withConverter(
      //   reminderConverter
      // );
      const reminderCollectionRef = collection(
        db,
        `users/${session.user.userId}/reminders`
      ).withConverter(reminderConverter);
      const newReminderRef = doc(reminderCollectionRef);

      await setDoc(newReminderRef, {
        ...data,
        id: newReminderRef.id,
        userId: session.user.userId,
        createdAt: data.createdAt,
      });

      // console.log("Send: New reminder send completed.");

      return {
        code: "Success",
        message: `New document added with id: ${newReminderRef.id}`,
        ok: true,
      };
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error(`Error verifying firestore session: ${session.user.email}`);
  }
}

export async function deleteReminder(id: string, session: Session) {
  // console.log("Deleting reminder in firebase.");
  let firebaseLoggged = false;
  if (!auth.currentUser) {
    // console.log(
    //   "Send: Auth.current user is null, logging in to firebase with custom token."
    // );
    const firebaseUser = await getFirebaseIdToken(session);
    if (firebaseUser) firebaseLoggged = true;
  } else {
    // console.log(
    //   "Delete Reminder: Has firebase auth.current user with id: " +
    //     auth.currentUser.uid
    // );
    firebaseLoggged = true;
  }

  if (firebaseLoggged) {
    try {
      const userRef = doc(db, "users", session.user.userId);
      const path = `users/${userRef.id}/reminders/${id}`;

      const reminderRef = doc(db, path);
      const res = await deleteDoc(reminderRef);
      return {
        code: "Success",
        message: `Deleted document with id: ${id}`,
        ok: true,
      };
    } catch (error) {
      throw error;
    }
  }
  throw new Error(`Error verifying firestore session: ${session.user.email}`);
}
