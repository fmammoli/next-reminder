import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function CompactMonthIsland({
  setSelectedId,
}: {
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  function handleClick() {
    setSelectedId("long");
  }

  return (
    <Button
      className="bg-transparent w-full hover:bg-transparent"
      onClick={handleClick}
    >
      <motion.div className="flex justify-between">
        <article className="flex gap-2 items-center text-white">
          <Calendar className="h-4 w-4 "></Calendar>
          <p className="text-sm">My reminders</p>
        </article>
        <div className="w-8"></div>
      </motion.div>
    </Button>
  );
}
