import { Reminder } from "@/types/Reminder";

import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

const reminderConverter = {
  toFirestore(reminder: Reminder): DocumentData {
    return {
      id: reminder.id,
      text: reminder.text,
      userId: reminder.userId,
      createdAt: reminder.createdAt,
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Reminder {
    const data = snapshot.data(options)!;
    return {
      id: data.id,
      text: data.text,
      userId: data.userId,
      createdAt: data.createdAt.toDate(),
    };
  },
};

export default reminderConverter;
