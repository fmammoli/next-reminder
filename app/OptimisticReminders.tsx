"use client";

import { OptimisticReminder, Reminder } from "@/types/Reminder";
import { useRef } from "react";
import { experimental_useOptimistic as useOptimistic } from "react";
import TodoForm from "./TodoForm";
import ReminderItem from "./ReminderItem";
import useLocalStorageState from "use-local-storage-state";
import { Session } from "next-auth";
import { deleteReminder, send } from "./_actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
}: {
  reminders: Reminder[];
  serverSession?: Session | null;
}) {
  const { data: session, status } = useSession();

  console.log("Optimistic reminders: session comming from remindersServer");
  // console.log(session);
  // const [localReminders, setLocalReminders] = useLocalStorageState<
  //   Reminder[] | []
  // >(
  //   `my-reminders-anon-${
  //     session?.user.isAnonymous ? session.user.userId : null
  //   }`,
  //   {
  //     defaultValue: [],
  //   }
  // );

  const [localReminders, setLocalReminders] = useLocalStorageState<
    Reminder[] | []
  >(`my-reminders-anon-test`, {
    defaultValue: [],
  });

  const router = useRouter();

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
  const formRef = useRef();

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
          router.refresh();
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
          router.refresh();
        } else {
          console.log("Something did not work");
        }
      }
    }
  }
  return (
    <div>
      <h1>Optimistic reminders</h1>
      <div>
        <TodoForm session={session} handleAdd={handleAdd}></TodoForm>
      </div>

      <div>
        <ul>
          {optimisticReminders.map(
            (item: Reminder | SendingReminder, index) => {
              return (
                <div key={index}>
                  <ReminderItem
                    text={
                      (item as SendingReminder).sending
                        ? (item as SendingReminder).reminder.text
                        : (item as Reminder).text
                    }
                    createdAt={
                      (item as SendingReminder).sending
                        ? ""
                        : (item as Reminder).createdAt.toLocaleString("pt-Br", {
                            dateStyle: "medium",
                            timeStyle: "medium",
                          })
                    }
                    sending={(item as SendingReminder).sending}
                    id={
                      (item as SendingReminder).sending
                        ? null
                        : (item as Reminder).id
                    }
                    handleRemove={handleRemove}
                  ></ReminderItem>
                </div>
              );
            }
          )}
        </ul>
      </div>
    </div>
  );
}
