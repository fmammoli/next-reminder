import { Calendar } from "@/components/ui/calendar";
import Reminders from "../Reminders";

export default async function Page({
  params,
  searchParams,
}: {
  params: { date: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const splitParams = params.date.split("-");
  console.log(splitParams);
  return (
    <main>
      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      <div className="max-w-lg mx-auto">
        <h2>My reminders</h2>
        <Reminders
          day={splitParams[0]}
          month={splitParams[1]}
          year={splitParams[2]}
        ></Reminders>
      </div>
    </main>
  );
}
