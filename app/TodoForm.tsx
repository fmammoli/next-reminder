import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { OptimisticReminder } from "@/types/Reminder";
import { Session } from "next-auth/core/types";

export default function TodoForm({
  handleAdd,
  session,
}: {
  handleAdd: (newReminder: OptimisticReminder) => void;
  session: Session | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      text: { value: string };
    };
    const text = target.text.value;

    if (!session) return;
    if (text.length === 0) return;

    const newReminder = {
      text: text,
      createdAt: new Date(),
    };

    // console.log("----------------------------");
    // console.log(auth.currentUser);
    // console.log("----------------------------");

    if (formRef.current) {
      formRef.current.reset();
    }
    const res = await handleAdd(newReminder);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
      <Input name="text" type="text" disabled={!session ? true : false}></Input>
      <Button type="submit" disabled={!session ? true : false}>
        Send
      </Button>
    </form>
  );
}
