import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";

export function LongMonthIsland({
  setSelectedId,
}: {
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  function handleClick() {
    setSelectedId(null);
  }

  return (
    <Button
      className="bg-transparent w-full hover:bg-transparent"
      onClick={handleClick}
    >
      <div className="flex justify-between w-full">
        <article className="flex gap-2 items-center text-left text-white">
          <Calendar className="h-4 w-4 "></Calendar>
          <p className="text-sm">February, 2023</p>
        </article>

        <article className="flex gap-2 item-center text-left text-white">
          <p className="text-sm text-green-400">12</p>
          <CheckCircle className="h-4 w-4 text-green-400"></CheckCircle>
        </article>
      </div>
    </Button>
  );
}
