import { Button } from "@/components/ui/button";
import { deleteReminder } from "./_actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DeletReminderButton({
  id,
  remove,
}: {
  id: string;
  remove: (id: string) => void;
}) {
  function handleDelete() {
    remove(id);
  }
  return <Button onClick={handleDelete}>Remove</Button>;
}
