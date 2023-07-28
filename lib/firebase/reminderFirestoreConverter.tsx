import { Reminder } from "@/types/Reminder";

import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

const reminderConverter = {
  toFirestore(reminder: Reminder): DocumentData {
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
      return `${year}-${month}-${day}`;
    }
    function setHours0(date: Date) {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0);
      return newDate;
    }
    return {
      id: reminder.id,
      text: reminder.text,
      userId: reminder.userId,
      createdAt: Timestamp.fromDate(reminder.createdAt),
      dueDateTime: Timestamp.fromDate(reminder.dueDateTime),
      dueDate: setHours0(reminder.dueDateTime),
      year: parseInt(
        reminder.dueDateTime.toLocaleDateString("pt-Br", { year: "numeric" })
      ),
      month: parseInt(
        reminder.dueDateTime.toLocaleDateString("pt-Br", {
          month: "2-digit",
        })
      ),
      day: parseInt(
        reminder.dueDateTime.toLocaleDateString("pt-Br", {
          day: "2-digit",
        })
      ),
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
      dueDateTime: data.dueDateTime.toDate(),
    };
  },
};

export default reminderConverter;
