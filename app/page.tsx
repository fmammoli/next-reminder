import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Reminders from "./Reminders";
import GoogleLoginHandler from "./GoogleLoginHandler";
import DynamicIsland from "./DynamicIsland";
import { Calendar } from "@/components/ui/calendar";
import FirebaseSessionHandler from "./FirebaseSessionHandler";
import Icon3d from "./Icon3d";

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
    <main className="p-10 bg-slate-50">
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
