"use client";
import { Calendar } from "@/components/ui/calendar";
import { Reminder } from "@/types/Reminder";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DayContent, DayContentProps } from "react-day-picker";

import { isSameDay, isSameMonth, parseISO } from "date-fns";
import CustomDay from "./CustomDay";
import useLocalStorageState from "use-local-storage-state";
import { useSession } from "next-auth/react";

export default function DatePicker({
  reminders = [],
  date = new Date(),
  onDateChange,
  disabled = false,
}: {
  reminders?: Reminder[];
  date?: Date;
  onDateChange?: (date: Date) => void;
  disabled?: boolean;
}) {
  const { data: session, status } = useSession();
  const [dateState, setDateState] = useState<Date>(date);

  const [localReminders, setLocalReminders] = useLocalStorageState<
    Reminder[] | []
  >(`my-reminders-anon-test`, {
    defaultValue: [],
  });

  const router = useRouter();

  function onDateSelect(newDate: Date | undefined) {
    if (newDate) {
      const yearValue = newDate.toLocaleDateString("pt-Br", {
        year: "numeric",
      });
      const monthValue = newDate.toLocaleDateString("pt-Br", {
        month: "2-digit",
      });
      const dayValue = newDate.toLocaleDateString("pt-Br", { day: "2-digit" });
      setDateState(newDate);
      if (onDateChange) {
        onDateChange(newDate);
      }

      router.push(
        `/reminders?day=${dayValue}&month=${monthValue}&year=${yearValue}`
      );
    }
  }

  function onMonthChange(month: Date) {
    const yearValue = month.toLocaleDateString("pt-Br", { year: "numeric" });
    const monthValue = month.toLocaleDateString("pt-Br", { month: "2-digit" });
    const dayValue = month.toLocaleDateString("pt-Br", { day: "2-digit" });
    if (!disabled) {
      setDateState(month);
      router.push(
        `/reminders?day=${dayValue}&month=${monthValue}&year=${yearValue}`
      );
    }
  }

  return (
    <Calendar
      mode="single"
      fixedWeeks
      showOutsideDays
      selected={dateState}
      onSelect={onDateSelect}
      onMonthChange={onMonthChange}
      className="isolate"
      components={{
        DayContent: (props) => {
          const remindersOfTheDay = (
            session?.user.isAnonymous ? localReminders : reminders
          ).filter((reminder: Reminder, index: number) => {
            return isSameDay(
              props.date,
              typeof reminder.dueDateTime === "string"
                ? parseISO(reminder.dueDateTime)
                : reminder.dueDateTime
            );
          });
          return CustomDay({
            remindersCount:
              remindersOfTheDay.length > 4 ? 4 : remindersOfTheDay.length,
            props,
          });
        },
      }}
    ></Calendar>
  );
}
