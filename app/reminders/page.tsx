import Reminders from "../Reminders";

let count = 0;

export default async function Page({
  searchParams,
}: {
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

  console.log(`Page rerender: ${count++}`);

  return (
    <main>
      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      <div className="max-w-lg mx-auto">
        <Reminders month={month} year={year} day={day}></Reminders>
      </div>
    </main>
  );
}
