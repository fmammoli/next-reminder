import { Timestamp } from "firebase/firestore";
import DeletReminderButton from "./DeleteReminderButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { memo, useMemo } from "react";

function ReminderItemOrigin({
  id,
  text,
  createdAt = "",
  dueDateTime = "",
  sending,
  handleRemove,
}: {
  id: string | null;
  text: string;
  createdAt?: string;
  dueDateTime: string;
  sending?: boolean;
  handleRemove: (id: string) => void;
}) {
  return (
    <Card className="my-4">
      <CardContent className="flex justify-between item-center pt-6">
        <div>
          <p>{text}</p>
          <p className="font-thin">
            Created At:{sending ? "Sending ..." : createdAt}
          </p>
          <p className="font-thin">Due Date: {dueDateTime}</p>
        </div>
        {id ? (
          <DeletReminderButton
            id={id}
            remove={handleRemove}
          ></DeletReminderButton>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}
const ReminderItem = memo(ReminderItemOrigin);
export default ReminderItem;
