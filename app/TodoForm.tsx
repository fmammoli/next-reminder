import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { OptimisticReminder } from "@/types/Reminder";
import { Session } from "next-auth/core/types";

export default function TodoForm({
  handleAdd,
  session,
  dueDate,
}: {
  handleAdd: (newReminder: OptimisticReminder) => void;
  session: Session | null;
  dueDate: Date;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session) return;

    const target = e.target as typeof e.target & {
      text: { value: string };
      time: { value: string };
    };
    const text = target.text.value;
    if (text.length === 0) return;

    if (target.time.value === "") return;
    const dueTime = target.time.value.split(":");

    const dueDateTime = new Date(dueDate);
    dueDateTime.setHours(parseInt(dueTime[0]));
    dueDateTime.setMinutes(parseInt(dueTime[1]));

    const newReminder = {
      text: text,
      createdAt: new Date(),
      dueDateTime: dueDateTime,
    };

    // console.log("----------------------------");
    // console.log(auth.currentUser);
    // console.log("----------------------------");

    if (formRef.current) {
      formRef.current.reset();
    }

    const res = handleAdd(newReminder);
  }

  const year = dueDate.toLocaleDateString("default", {
    year: "numeric",
  });
  const month = dueDate.toLocaleDateString("default", {
    month: "2-digit",
  });
  const day = dueDate.toLocaleDateString("default", {
    day: "2-digit",
  });

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex flex-col gap-2">
        <Input
          name="text"
          type="text"
          disabled={!session ? true : false}
          placeholder="text"
        ></Input>
        <Input
          name="date"
          type="date"
          disabled={true}
          value={`${year}-${month}-${day}`}
        ></Input>
        <Input
          name="time"
          type="time"
          placeholder="hh:mm"
          defaultValue={`${new Date().toLocaleTimeString("pt-Br", {
            hour: "numeric",
          })}:${new Date().toLocaleTimeString("pt-Br", {
            minute: "numeric",
          })}`}
        ></Input>
      </div>

      <Button type="submit" disabled={!session ? true : false}>
        Send
      </Button>
    </form>
  );
}
