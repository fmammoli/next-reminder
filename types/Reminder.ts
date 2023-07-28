export type Reminder = {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  dueDateTime: Date;
};

export type OptimisticReminder = {} & Omit<Reminder, "userId" | "id">;
