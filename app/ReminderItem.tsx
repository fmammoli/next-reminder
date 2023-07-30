import DeletReminderButton from "./DeleteReminderButton";
import { Card, CardContent } from "@/components/ui/card";
import { memo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
          <div className="flex items-center gap-2">
            <p>{text}</p>
            {sending && (
              <motion.div
                animate={{
                  rotate: "360deg",
                }}
                transition={{ repeat: 10, duration: 2, ease: "easeInOut" }}
              >
                <Loader2
                  strokeWidth={2}
                  width={16}
                  height={16}
                  className="text-cyan-500"
                ></Loader2>
              </motion.div>
            )}
          </div>
          <p className="font-thin">{sending ? "Sending ..." : createdAt}</p>
          <p className="font-thin">
            Due at:
            {dueDateTime.split(" ")[4].slice(0, -3)}
          </p>
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
