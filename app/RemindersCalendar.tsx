import { Reminder } from "@/types/Reminder";
import DatePicker from "./DatePicker";
import { getRemindersByMonth } from "./_actions";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function RemindersCalendar({
  year,
  month,
  day,
}: {
  year: string;
  month: string;
  day: string;
}) {
  const session = await getServerSession(authOptions);
  const logged = !!session?.user?.email || false;

  let reminders: Reminder[] | [] = [];

  if (session) {
    try {
      if (!session.user.isAnonymous) {
        reminders = await getRemindersByMonth(
          parseInt(month),
          parseInt(year),
          session
        );
      }
    } catch (error) {
      console.log("Problem fetching reminders");
      throw error;
    }
  }

  return (
    <DatePicker
      reminders={reminders}
      date={new Date(`${month}/${day}/${year}`)}
    ></DatePicker>
  );
}
