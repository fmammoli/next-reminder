"use server";
import { auth, db } from "@/lib/firebase/clientApp";
import getFirebaseIdToken from "@/lib/firebase/getFirebaseIdToken";
import reminderConverter from "@/lib/firebase/reminderFirestoreConverter";
import { adminAuth } from "@/lib/firebase/serverApp";
import { OptimisticReminder, Reminder } from "@/types/Reminder";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { Session } from "next-auth/core/types";
import { revalidatePath } from "next/cache";

export async function deleteUsers() {
  try {
    const users = await adminAuth.listUsers(30);
    const uids = users.users.map((user) => user.uid);
    const res = await adminAuth.deleteUsers(uids);

    return res;
  } catch (error) {
    throw error;
  }
}

function toFormmatedString(date: Date) {
  const day = date.toLocaleDateString("pt-Br", {
    day: "2-digit",
  });
  const month = date.toLocaleDateString("pt-Br", {
    month: "2-digit",
  });
  const year = date.toLocaleDateString("pt-Br", {
    year: "numeric",
  });
  return `${day}/${month}/${year}`;
}

export async function getRemindersByDateNumbers(
  year: number,
  month: number,
  day: number,
  session: Session
) {
  let firebaseLoggged = false;

  try {
    if (!auth.currentUser) {
      const firebaseUser = await getFirebaseIdToken(session);
      if (firebaseUser) firebaseLoggged = true;
    } else {
      firebaseLoggged = true;
    }
    if (firebaseLoggged) {
      const reminderCollectionRef = collection(
        db,
        `users/${session.user.userId}/reminders`
      ).withConverter(reminderConverter);
      // const zeroedDate = new Date(date);
      // zeroedDate.setHours(0, 0, 0);
      // const queryRef = query(
      //   reminderCollectionRef,
      //   where("dueDate", "==", zeroedDate),
      //   orderBy("dueDateTime", "desc")
      // );

      const queryRef = query(
        reminderCollectionRef,
        where("year", "==", year),
        where("month", "==", month),
        where("day", "==", day),
        orderBy("dueDateTime", "desc")
      );

      const remindersSnapshot = await getDocs(queryRef);

      const remindersList = remindersSnapshot.docs.map((doc) => doc.data());

      // revalidatePath("");
      return remindersList;
    } else {
      throw new Error(
        `Error verifying firestore session: ${session.user.email}`
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRemindersByDate(date: Date, session: Session) {
  let firebaseLoggged = false;

  try {
    if (!auth.currentUser) {
      const firebaseUser = await getFirebaseIdToken(session);
      if (firebaseUser) firebaseLoggged = true;
    } else {
      firebaseLoggged = true;
    }
    if (firebaseLoggged) {
      const reminderCollectionRef = collection(
        db,
        `users/${session.user.userId}/reminders`
      ).withConverter(reminderConverter);
      // const zeroedDate = new Date(date);
      // zeroedDate.setHours(0, 0, 0);
      // const queryRef = query(
      //   reminderCollectionRef,
      //   where("dueDate", "==", zeroedDate),
      //   orderBy("dueDateTime", "desc")
      // );

      const queryRef = query(
        reminderCollectionRef,
        where(
          "year",
          "==",
          date.toLocaleDateString("pt-Br", { year: "numeric" })
        ),
        where(
          "month",
          "==",
          date.toLocaleDateString("pt-Br", { month: "2-digit" })
        ),
        where(
          "day",
          "==",
          date.toLocaleDateString("pt-Br", { day: "2-digit" })
        ),
        orderBy("dueDateTime", "desc")
      );

      const remindersSnapshot = await getDocs(queryRef);

      const remindersList = remindersSnapshot.docs.map((doc) => doc.data());

      // revalidatePath("");
      return remindersList;
    } else {
      throw new Error(
        `Error verifying firestore session: ${session.user.email}`
      );
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRemindersByMonth(
  month: number,
  year: number,
  session: Session
) {
  let firebaseLoggged = false;

  if (!auth.currentUser) {
    const firebaseUser = await getFirebaseIdToken(session);
    if (firebaseUser) firebaseLoggged = true;
  } else {
    firebaseLoggged = true;
  }
  if (firebaseLoggged) {
    try {
      const reminderCollectionRef = collection(
        db,
        `users/${session.user.userId}/reminders`
      ).withConverter(reminderConverter);

      const queryRef = query(
        reminderCollectionRef,
        where("year", "==", year),
        where("month", "==", month),
        orderBy("dueDateTime", "desc")
      );

      const remindersSnapshot = await getDocs(queryRef);

      const remindersList = remindersSnapshot.docs.map((doc) => doc.data());

      // revalidatePath("");
      return remindersList;
    } catch (error) {
      console.log("Error fetching");
      throw error;
    }
  } else {
    throw new Error(`Error verifying firestore session: ${session.user.email}`);
  }
}

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
    revalidatePath("");
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
      revalidatePath("/reminders");
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
