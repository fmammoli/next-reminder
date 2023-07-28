import Reminders from "../Reminders";
import RemindersCalendar from "../RemindersCalendar";

export default async function Page({
  params,
  searchParams,
}: {
  params: { date: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date();

  const month =
    (searchParams["month"] as string) ??
    today.toLocaleString("pt-Br", { month: "2-digit" });
  const year =
    (searchParams["year"] as string) ??
    today.toLocaleString("pt-Br", { year: "2-digit" });

  const day =
    (searchParams["day"] as string) ??
    today.toLocaleString("pt-Br", { day: "2-digit" });

  return (
    <main>
      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      <div className="max-w-lg mx-auto">
        <RemindersCalendar
          year={year}
          month={month}
          day={day}
        ></RemindersCalendar>
        <Reminders month={month} year={year} day={day}></Reminders>
      </div>
    </main>
  );
}
