"use client";

import { OptimisticReminder, Reminder } from "@/types/Reminder";

import { experimental_useOptimistic as useOptimistic } from "react";
import TodoForm from "./TodoForm";
import ReminderItem from "./ReminderItem";
import useLocalStorageState from "use-local-storage-state";

import { deleteReminder, send } from "./_actions";

import ActionButton from "./ActionButton";
import { isSameDay } from "date-fns";
import { Session } from "next-auth/core/types";
import DatePicker from "./DatePicker";
type SendingReminder = {
  reminder: OptimisticReminder;
  sending: boolean;
};

type OptimisticReminders = (Reminder | SendingReminder)[];

type addAction = {
  type: "add";
  newReminder: OptimisticReminder;
};

type addLocalAction = {
  type: "addLocal";
  newReminder: OptimisticReminder;
};

type deleteAction = {
  type: "delete";
  id: string;
};

type filterAction = {
  type: "filter";
  date: Date;
};

let count = 0;
export default function OptimisticReminders({
  reminders,
  monthReminders,
  serverSession,
  day,
  month,
  year,
}: {
  reminders: Reminder[];
  monthReminders?: Reminder[];
  serverSession?: Session | null;
  day?: string;
  month?: string;
  year?: string;
}) {
  const startingDate =
    year && month && (day ?? "01")
      ? new Date(`${month}/${day}/${year}`)
      : new Date();

  console.log("Rendering optimistic: " + ++count);

  const [localReminders, setLocalReminders] = useLocalStorageState<
    Reminder[] | []
  >(`my-reminders-anon-test`, {
    defaultValue: [],
  });

  const dayReminders = reminders.filter((item) => {
    const itemDay = item.dueDateTime.toLocaleDateString("pt-Br", {
      day: "2-digit",
    });
    const itemMonth = item.dueDateTime.toLocaleDateString("pt-Br", {
      month: "2-digit",
    });
    const itemYear = item.dueDateTime.toLocaleDateString("pt-Br", {
      year: "numeric",
    });
    return itemYear == year && itemMonth === month && itemDay === day;
  });

  const [optimisticReminders, dispatchOptimisticReminders] = useOptimistic<
    OptimisticReminders,
    addAction | addLocalAction | deleteAction | filterAction
  >(
    serverSession?.user.isAnonymous ? localReminders : dayReminders,
    (state, action) => {
      switch (action.type) {
        case "add":
          return [{ reminder: action.newReminder, sending: true }, ...state];

        case "delete":
          return state.filter((item: Reminder | SendingReminder) => {
            if ((item as Reminder).id) {
              return (item as Reminder).id !== action.id;
            } else {
              return true;
            }
          });
        case "filter":
          const res = reminders.filter((reminder, index: number) => {
            return isSameDay(action.date, (reminder as Reminder).dueDateTime);
          });

          return res;
        default:
          return state;
      }
    }
  );

  async function handleAdd(newReminder: OptimisticReminder) {
    if (serverSession) {
      if (serverSession.user.isAnonymous) {
        return setLocalReminders((state) => {
          return [
            {
              ...newReminder,
              userId: serverSession.user.userId,
              id: (state.length + 1).toString(),
            },
            ...state,
          ];
        });
      } else {
        dispatchOptimisticReminders({ type: "add", newReminder: newReminder });

        const response = await send(newReminder, serverSession);
        if (response?.ok) {
          console.log("Send response!");
        } else {
          console.log("Something did not work");
        }
      }
    }
  }

  async function handleRemove(id: string) {
    if (serverSession) {
      if (serverSession.user.isAnonymous) {
        setLocalReminders((state) => {
          return state.filter((item: Reminder | SendingReminder) => {
            if ((item as Reminder).id) {
              return (item as Reminder).id !== id;
            } else {
              return true;
            }
          });
        });
      } else {
        dispatchOptimisticReminders({ type: "delete", id: id });
        const reminder = optimisticReminders.find(
          (item) => (item as Reminder).id === id
        );
        if (reminder) {
          const response = await deleteReminder(
            reminder as Reminder,
            serverSession
          );
          if (response?.ok) {
            console.log("Delete response!");
            // router.refresh();
          } else {
            console.log("Something did not work");
          }
        }
      }
    }
  }

  let localDayReminders: Reminder[] = [];

  if (serverSession?.user.isAnonymous) {
    //@ts-ignore
    localDayReminders = optimisticReminders.filter(
      (reminder, index: number) => {
        return isSameDay(
          new Date(startingDate),
          new Date((reminder as Reminder).dueDateTime)
        );
      }
    );
  }

  function optimisticHandleDateChange(date: Date) {
    dispatchOptimisticReminders({ type: "filter", date: date });
  }

  return (
    <div>
      <DatePicker
        reminders={reminders}
        date={new Date(`${month}/${day}/${year}`)}
        isAnonymous={serverSession?.user.isAnonymous ? true : false}
        onDateChange={optimisticHandleDateChange}
      ></DatePicker>
      <h1>Optimistic reminders</h1>
      <div>
        <TodoForm
          session={serverSession}
          handleAdd={handleAdd}
          dueDate={startingDate}
        ></TodoForm>
      </div>

      <div>
        <ul>
          {(serverSession?.user.isAnonymous
            ? localDayReminders
            : optimisticReminders
          ).map((item: Reminder | SendingReminder, index) => {
            return (
              <div
                key={
                  (item as SendingReminder).sending
                    ? (item as SendingReminder).reminder.createdAt.toUTCString()
                    : (item as Reminder).id
                }
              >
                <ReminderItem
                  text={
                    (item as SendingReminder).sending
                      ? (item as SendingReminder).reminder.text
                      : (item as Reminder).text
                  }
                  createdAt={
                    (item as Reminder).createdAt?.toString() ??
                    (item as SendingReminder).reminder.createdAt.toString()
                  }
                  sending={(item as SendingReminder).sending}
                  id={
                    (item as SendingReminder).sending
                      ? null
                      : (item as Reminder).id
                  }
                  dueDateTime={
                    (item as Reminder).dueDateTime?.toString() ??
                    (item as SendingReminder).reminder.dueDateTime.toString()
                  }
                  handleRemove={handleRemove}
                ></ReminderItem>
              </div>
            );
          })}
        </ul>
      </div>
      <ActionButton></ActionButton>
    </div>
  );
}
