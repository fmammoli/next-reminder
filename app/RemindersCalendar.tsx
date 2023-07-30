import { Reminder } from "@/types/Reminder";
import DatePicker from "./DatePicker";
import { getRemindersByDateNumbersAdmin } from "./_actions";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

let renderCount = 0;
export default async function RemindersCalendar({
  year,
  month,
  day,
}: {
  year: string;
  month: string;
  day: string;
}) {
  renderCount++;
  console.log(`ReminderCalendar Render: ${renderCount}`);
  const session = await getServerSession(authOptions);
  const logged = !!session?.user?.email || false;

  let reminders: Reminder[] | [] = [];

  if (session) {
    try {
      if (!session.user.isAnonymous) {
        const adminReminders = await getRemindersByDateNumbersAdmin(
          parseInt(year),
          parseInt(month),
          0,
          session.user.userId
        );

        reminders = adminReminders;
        // reminders = await getRemindersByMonth(
        //   parseInt(month),
        //   parseInt(year),
        //   session
        // );
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
      isAnonymous={session?.user.isAnonymous ? true : false}
    ></DatePicker>
  );
}
