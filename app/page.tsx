import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Reminders from "./Reminders";
import GoogleLoginHandler from "./GoogleLoginHandler";
import DynamicIsland from "./DynamicIsland";
import { Calendar } from "@/components/ui/calendar";

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

  return (
    <main className="p-10 bg-slate-50">
      <nav>
        <GoogleLoginHandler>
          <DynamicIsland></DynamicIsland>
        </GoogleLoginHandler>
      </nav>

      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      <div className="mt-20">
        <Calendar mode="default" fixedWeeks></Calendar>
        <Reminders></Reminders>
      </div>
    </main>
  );
}
