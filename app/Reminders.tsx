import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Reminder } from "@/types/Reminder";
import OptimisticReminders from "./OptimisticReminders";
import { getRemindersByDateNumbersAdmin } from "./_actions";

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
  let monthReminders: Reminder[] | [] = [];
  if (session) {
    try {
      if (!session.user.isAnonymous) {
        // reminders = await getRemindersByDate(
        //   new Date(`${month}/${day}/${year}`),
        //   session
        // );
        // const preminders = getRemindersByDateNumbersAdmin(
        //   parseInt(year),
        //   parseInt(month),
        //   parseInt(day),
        //   session.user.userId
        // );

        const pmonthReminders = await getRemindersByDateNumbersAdmin(
          parseInt(year),
          parseInt(month),
          0,
          session.user.userId
        );
        reminders = pmonthReminders;
        // [reminders, monthReminders] = await Promise.all([
        //   preminders,
        //   pmonthReminders,
        // ]);
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
