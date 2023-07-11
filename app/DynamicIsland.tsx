"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import React from "react";

import UserAccount from "./UserAccount";
import { useSession } from "next-auth/react";
import BoringAvatar from "boring-avatars";
import Icon3d from "./Icon3d";

const HEIGHT = 40;

export default function DynamicIsland({ children }: { children?: ReactNode }) {
  const [selectedId, setSelectedId] = useState<
    "initial" | "default" | "large" | "long" | "loading"
  >("loading");
  const willChange = useWillChange();

  const { data: session, status } = useSession();

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

  const variants = {
    loading: {
      width: "4rem",
      gridTemplateRows: "0fr",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delayChildren: 0.6,
      },
    },
    default: {
      width: "9rem",
      gridTemplateRows: "0fr",
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 14,
        delayChildren: 0.6,
      },
    },
    long: {
      width: "20rem",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delayChildren: 0.6,
      },
    },
    large: {
      width: "20rem",
      gridTemplateRows: "1fr",
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 20,
        delayChildren: 0.6,
      },
    },
  };

  useEffect(() => {
    if (status === "authenticated") {
      setSelectedId("default");
    }
  }, [status]);
  console.log(selectedId);
  let text = "";
  if (selectedId === "default") text = "Expand";
  if (selectedId === "long") text = "Expand with some details";

  return (
    <div className="z-10 absolute top-0 left-0 mt-10 w-full isolate">
      <div className="relative flex justify-center gap-2">
        <motion.div
          layout
          className={"grid rounded-[22px] bg-black relative z-10 "}
          variants={variants}
          animate={selectedId}
          initial={"loading"}
        >
          <motion.div className="min-h-[2.5rem] min-w-[8rem]">
            <motion.div
              className="flex justify-start gap-1 px-2 item-center h-10 relative"
              hidden={selectedId === "large" ? true : false}
              initial={{ opacity: 0, zIndex: 0 }}
              animate={{
                opacity:
                  selectedId === "default" || selectedId === "long" ? 1 : 0,
                zIndex:
                  selectedId === "default" || selectedId === "long" ? 0 : -1,
                transition: { delay: 0.3 },
              }}
            >
              <motion.div className="h-10 w-10">
                <Icon3d></Icon3d>
              </motion.div>

              <Button
                className="py-0 pl-1 h-auto bg-black "
                onClick={() => {
                  {
                    setSelectedId((prev) => {
                      if (prev === "default") return "long";
                      if (prev === "long") return "default";
                      return prev;
                    });
                  }
                }}
              >
                <motion.p>{text}</motion.p>
              </Button>
            </motion.div>

            <AnimatePresence>
              {false && (
                <motion.div
                  className="flex justify-start item-center h-9"
                  initial={{ x: 100 }}
                  animate={{
                    x: 0,
                  }}
                >
                  <Button
                    className="py-0 h-auto bg-transparent hover:bg-transparent text-purple-400"
                    onClick={() => {
                      {
                        setSelectedId("default");
                      }
                    }}
                  >
                    Expand with details
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {selectedId === "large" && (
                <motion.div
                  initial={{ gridTemplateRows: "0fr" }}
                  animate={{
                    gridTemplateRows: "1fr",
                  }}
                  exit={{ gridTemplateRows: "0fr" }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 15,
                  }}
                  className="text-white grid relative -mt-10 z-20"
                >
                  <div className="overflow-hidden">
                    <UserAccount
                      setSelectedId={setSelectedId}
                      {...session?.user}
                      isLogged={!session?.user.isAnonymous}
                      boringAvatar={boringAvatar}
                    ></UserAccount>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-0 left-1/2 translate-x-[5.5rem]">
        <div className="flex justify-center items-center">
          <AnimatePresence mode="popLayout">
            {selectedId === "default" && status === "authenticated" && (
              <motion.div
                className={" h-10 relative -z-10 overflow-hidden"}
                initial={{ x: -60, opacity: 0, zIndex: -10 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  zIndex: 1,
                  transition: { delay: 0.6 },
                }}
                exit={{
                  x: -100,
                  opacity: 0,
                  zIndex: -10,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
                }}
              >
                <Button
                  className="rounded-full p-0 h-auto"
                  onClick={() => setSelectedId((prev) => "large")}
                >
                  <Avatar className=" h-10 w-10">
                    {session?.user?.image && (
                      <AvatarImage src={session.user.image} />
                    )}
                    <AvatarFallback className="text-sm" delayMs={40}>
                      {boringAvatar}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
