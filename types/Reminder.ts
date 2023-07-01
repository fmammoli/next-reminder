import { Timestamp } from "firebase/firestore";

export type Reminder = {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
};

export type OptimisticReminder = {} & Omit<Reminder, "userId" | "id">;
