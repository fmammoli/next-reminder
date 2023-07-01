import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Reminders from "./Reminders";
import GoogleLoginHandler from "./GoogleLoginHandler";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let logged = false;
  let isAnon = false;
  if (session) {
    if (session.user) {
      logged = true;
      isAnon = session.user.isAnonymous === true ? true : false;
    }
  } else {
    console.log("Page: No session!");
  }

  return (
    <main className="flex flex-col p-24">
      <h1>Firebase todo app</h1>

      <div>
        <GoogleLoginHandler logged={logged} isAnon={isAnon}>
          {logged && (
            <div className="flex flex-col gap-4">
              <h2 className="self-center">User Data</h2>
              <div className="flex gap-4">
                <Avatar className="ring-4">
                  {session?.user?.image ? (
                    <Image
                      src={session?.user?.image}
                      alt="@shadcn"
                      width={46}
                      height={46}
                    />
                  ) : (
                    <AvatarFallback>CN</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p>{session?.user?.email || "anon email"}</p>
                  <p>{session?.user?.name}</p>
                </div>
              </div>
            </div>
          )}
        </GoogleLoginHandler>
      </div>

      {/* <div>
        <TodoForm></TodoForm>
      </div> */}
      <div>
        <h2 className="my-4">Reminders List</h2>
        <Reminders></Reminders>
      </div>
    </main>
  );
}
