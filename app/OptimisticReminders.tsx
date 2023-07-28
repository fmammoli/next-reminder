"use client";

import { OptimisticReminder, Reminder } from "@/types/Reminder";

import { experimental_useOptimistic as useOptimistic } from "react";
import TodoForm from "./TodoForm";
import ReminderItem from "./ReminderItem";
import useLocalStorageState from "use-local-storage-state";
import { Session } from "next-auth";
import { deleteReminder, send } from "./_actions";

import { useSession } from "next-auth/react";
import ActionButton from "./ActionButton";
import { isSameDay, parseISO } from "date-fns";

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

export default function OptimisticReminders({
  reminders,
  serverSession,
  day,
  month,
  year,
}: {
  reminders: Reminder[];
  serverSession?: Session | null;
  day?: string;
  month?: string;
  year?: string;
}) {
  const { data: session, status } = useSession();

  const startingDate =
    year && month && (day ?? "01")
      ? new Date(`${month}/${day}/${year}`)
      : new Date();

  // const [date, setDate] = useState<Date>(startingDate);

  // console.log("Optimistic reminders: session comming from remindersServer");

  const [localReminders, setLocalReminders] = useLocalStorageState<
    Reminder[] | []
  >(`my-reminders-anon-test`, {
    defaultValue: [],
  });

  const [optimisticReminders, dispatchOptimisticReminders] = useOptimistic<
    OptimisticReminders,
    addAction | addLocalAction | deleteAction
  >(session?.user.isAnonymous ? localReminders : reminders, (state, action) => {
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

      default:
        return state;
    }
  });

  async function handleAdd(newReminder: OptimisticReminder) {
    if (session) {
      if (session.user.isAnonymous) {
        return setLocalReminders((state) => {
          return [
            {
              ...newReminder,
              userId: session.user.userId,
              id: (state.length + 1).toString(),
            },
            ...state,
          ];
        });
      } else {
        dispatchOptimisticReminders({ type: "add", newReminder: newReminder });

        const response = await send(newReminder, session);
        if (response?.ok) {
          console.log("Send response!");
          // router.refresh();
        } else {
          console.log("Something did not work");
        }
      }
    }
  }

  async function handleRemove(id: string) {
    if (session) {
      if (session.user.isAnonymous) {
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
        const response = await deleteReminder(id, session);
        if (response?.ok) {
          console.log("Delete response!");
          // router.refresh();
        } else {
          console.log("Something did not work");
        }
      }
    }
  }

  let localDayReminders: Reminder[] = [];

  if (session?.user.isAnonymous) {
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

  return (
    <div>
      {/* <DatePicker
        reminders={reminders}
        date={date}
        onDateChange={setDate}
      ></DatePicker> */}
      <h1>Optimistic reminders</h1>
      <div>
        <TodoForm
          session={session}
          handleAdd={handleAdd}
          dueDate={startingDate}
        ></TodoForm>
      </div>

      <div>
        <ul>
          {(session?.user.isAnonymous
            ? localDayReminders
            : optimisticReminders
          ).map((item: Reminder | SendingReminder, index) => {
            return (
              <div key={index}>
                <ReminderItem
                  text={
                    (item as SendingReminder).sending
                      ? (item as SendingReminder).reminder.text
                      : (item as Reminder).text
                  }
                  // createdAt={new Date(
                  //   (item as Reminder).createdAt ??
                  //     (item as SendingReminder).reminder.createdAt
                  // ).toLocaleString("pt-Br", {
                  //   hour: "2-digit",
                  //   minute: "2-digit",
                  // })}
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
                  // dueDateTime={new Date(
                  //   (item as Reminder).dueDateTime ??
                  //     (item as SendingReminder).reminder.dueDateTime
                  // ).toLocaleString("pt-Br", {
                  //   hour: "2-digit",
                  //   minute: "2-digit",
                  // })}
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
