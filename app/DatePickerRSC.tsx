import { Calendar } from "@/components/ui/calendar";
import { Reminder } from "@/types/Reminder";
import { isSameDay } from "date-fns";
import Link from "next/link";
import { DayContent, DayContentProps } from "react-day-picker";

export default async function DatePickerRSC({
  monthReminders,
  date,
}: {
  monthReminders: Reminder[];
  date: Date;
}) {
  return (
    <Calendar
      mode="single"
      fixedWeeks
      showOutsideDays
      selected={date}
      className="isolate"
      components={{
        DayContent: (props) => {
          const remindersOfTheDay = monthReminders.filter(
            (reminder: Reminder, index: number) => {
              return isSameDay(props.date, reminder.dueDateTime);
            }
          );
          return CustomDay({ remindersCount: remindersOfTheDay.length, props });
        },
      }}
    ></Calendar>
  );
}

function CustomDay({
  remindersCount,
  props,
}: {
  remindersCount: number;
  props: DayContentProps;
}) {
  const count = Array.from(Array(remindersCount).keys()).map((value) => ".");
  const yearValue = props.date.toLocaleDateString("pt-Br", {
    year: "numeric",
  });
  const monthValue = props.date.toLocaleDateString("pt-Br", {
    month: "2-digit",
  });
  const dayValue = props.date.toLocaleDateString("pt-Br", { day: "2-digit" });
  return (
    <Link
      // href={`/reminders?day=${getDate(props.date)}&month=${getMonth(
      //   props.date
      // )}&year=${getYear(props.date)}`}
      href={`/reminders?day=${dayValue}&month=${monthValue}&year=${yearValue}`}
    >
      <DayContent {...props}></DayContent>
      <p>{count.join(" ")}</p>
    </Link>
  );
}
