"use client";

import { ReactNode, useEffect, useState } from "react";
import DynamicIsland, { DynamicIslandStates } from "./DynamicIsland";
import DynamicIslandDefaultContent from "./DynamicIslandDefaultContent";
import DynamicIslandUserAccountContent from "./DynamicIslandUserAccountContent";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import BoringAvatar from "boring-avatars";
import UserAccount from "./UserAccount";
import { useSearchParams } from "next/navigation";
import { parseISO } from "date-fns";

type IslandStateContent = {
  dynamicIslandState: DynamicIslandStates;
  content: ReactNode;
};

const defaultContent = (
  <DynamicIslandDefaultContent key={"default"}>
    <motion.p key={"short"}>My reminders</motion.p>
  </DynamicIslandDefaultContent>
);

export default function Nav() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<IslandStateContent>({
    dynamicIslandState: "loading",
    content: null,
  });

  const searchParams = useSearchParams();

  const { scrollY } = useScroll();

  console.log(
    `${searchParams.get("year")}-${searchParams.get(
      "month"
    )}-${searchParams.get("day")}`
  );
  const searchParamsDate = parseISO(
    `${searchParams.get("year")}-${searchParams.get(
      "month"
    )}-${searchParams.get("day")}`
  );

  const longContent = (
    <DynamicIslandDefaultContent key={"default"}>
      <motion.p
        key={"long"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-nowrap"
      >
        Expand with more detauls
      </motion.p>
    </DynamicIslandDefaultContent>
  );

  let boringAvatar = null;
  if (session?.user.isAnonymous) {
    boringAvatar = (
      <BoringAvatar
        size={60}
        name={`${session?.user.userId} ${new Date(
          session?.user.firebase.createdAt || ""
        ).toDateString()}`}
        variant="beam"
        colors={session?.user.randomColors}
        square
      ></BoringAvatar>
    );
  }

  const userAccount = (
    <DynamicIslandUserAccountContent key={"large"}>
      <UserAccount
        onClose={() =>
          setState({ dynamicIslandState: "default", content: defaultContent })
        }
        {...session?.user}
        isLogged={!session?.user.isAnonymous}
        boringAvatar={boringAvatar}
      ></UserAccount>
    </DynamicIslandUserAccountContent>
  );

  function onClick() {
    if (state.dynamicIslandState === "large")
      setState({ dynamicIslandState: "default", content: defaultContent });
    if (state.dynamicIslandState === "default")
      setState({ dynamicIslandState: "long", content: longContent });
    if (state.dynamicIslandState === "long")
      setState({ dynamicIslandState: "default", content: defaultContent });
  }

  function onClickDetached() {
    if (state.dynamicIslandState === "default")
      setState({ dynamicIslandState: "large", content: userAccount });
  }

  useEffect(() => {
    if (status === "authenticated") {
      setState({ dynamicIslandState: "default", content: defaultContent });
    }
  }, [status, setState]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (state.dynamicIslandState !== "loading") {
      if (state.dynamicIslandState === "default") {
        if (latest > 300) {
          setState({
            dynamicIslandState: "long",
            content: (
              <DynamicIslandDefaultContent key={"long"}>
                <motion.p
                  key={"long"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-nowrap"
                >
                  {/* {searchParamsDate.toLocaleDateString("pt-Br", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })} */}
                  {searchParamsDate.toLocaleDateString("pt-Br", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </motion.p>
              </DynamicIslandDefaultContent>
            ),
          });
        }
      }
      if (state.dynamicIslandState !== "default")
        if (latest < 300) {
          setState({ dynamicIslandState: "default", content: defaultContent });
        }
    }
  });

  return (
    <nav className="relative min-h-[2.5rem]">
      <motion.nav className="absolute top-0 left-0 z-10 isolate w-full grid place-items-center">
        <DynamicIsland
          initial={"loading"}
          state={state.dynamicIslandState}
          onClick={onClick}
          className="z-20 row-start-1 col-start-1"
        >
          {state.content}
        </DynamicIsland>

        <DynamicIsland
          initial={"loading"}
          state={state.dynamicIslandState}
          onClick={onClickDetached}
          detached
          className="z-0 bg-blue-400 max-h-10 rounded-none row-start-1 col-start-1 self-end"
          withIcon={false}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
          >
            <Avatar className="h-10 w-10">
              {session?.user?.image && (
                <AvatarImage
                  key={session.user.image}
                  src={session.user.image}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="text-sm" delayMs={40}>
                {boringAvatar}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </DynamicIsland>
      </motion.nav>
    </nav>
  );
}
