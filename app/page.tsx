import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  // const session = await getServerSession(authOptions);
  // let logged = false;
  // let isAnon = false;
  // if (session) {
  //   if (session.user) {
  //     logged = true;
  //     isAnon = session.user.isAnonymous === true ? true : false;
  //   }
  // } else {
  //   console.log("Page: No session!");
  // }

  // console.log(`Page: ${session?.user}`);
  // console.log(session);
  const today = new Date();
  const year = today.toLocaleDateString("pt-br", { year: "numeric" });
  const month = today.toLocaleDateString("pt-br", { month: "2-digit" });
  const day = today.toLocaleDateString("pt-br", { day: "2-digit" });
  return (
    <main>
      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      {/* <div className="max-w-lg mx-auto">
        <Calendar mode="default" fixedWeeks></Calendar>
        <h2>My reminders</h2>
        <Reminders></Reminders>
      </div> */}
      <div>
        <Link href={`/reminders?day=${day}&month=${month}&year=${year}`}>
          <Button>Go to Calendar</Button>
        </Link>
      </div>
    </main>
  );
}
