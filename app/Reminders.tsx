import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Reminder } from "@/types/Reminder";
import OptimisticReminders from "./OptimisticReminders";
import { getRemindersByDate, getRemindersByDateNumbers } from "./_actions";

export default async function Reminders({
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
        // reminders = await getRemindersByDate(
        //   new Date(`${month}/${day}/${year}`),
        //   session
        // );
        reminders = await getRemindersByDateNumbers(
          parseInt(year),
          parseInt(month),
          parseInt(day),
          session
        );
      }
    } catch (error) {
      console.log("Problem fetching reminders");
      throw error;
    }
  }

  return (
    <>
      <OptimisticReminders
        reminders={reminders}
        serverSession={session}
        year={year}
        month={month}
        day={day}
      ></OptimisticReminders>
    </>
  );
}
