import Reminders from "./Reminders";
import DynamicIsland from "./DynamicIsland";
import { Calendar } from "@/components/ui/calendar";
import FirebaseSessionHandler from "./FirebaseSessionHandler";

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
  return (
    <main className="p-10">
      <nav>
        <FirebaseSessionHandler>
          <DynamicIsland></DynamicIsland>
        </FirebaseSessionHandler>
      </nav>

      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      <div className="mt-20 max-w-lg mx-auto h-96">
        <Calendar mode="default" fixedWeeks className="mx-auto"></Calendar>
        <Reminders></Reminders>
      </div>
    </main>
  );
}
