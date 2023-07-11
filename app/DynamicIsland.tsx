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

const islandVariants = {
  default: { width: 200, gridTemplateRows: "0fr" },
  long: { width: "min(40rem, 100%)", gridTemplateRows: "1fr" },
  large: { width: "min(40rem, 100%)", gridTemplateRows: "1fr" },
};

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
    loading: { width: "4rem", gridTemplateRows: "0fr" },
    default: { width: "10rem", gridTemplateRows: "0fr" },
    long: {
      width: "30rem",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    large: { width: "30rem", gridTemplateRows: "1fr" },
  };

  useEffect(() => {
    if (status === "authenticated") {
      setSelectedId("default");
    }
  }, [status]);
  console.log(selectedId);
  return (
    <div className="z-10 absolute top-0 left-0 mt-10 w-full isolate ">
      <div className="relative flex justify-center gap-2">
        <motion.div
          layout
          className={"grid rounded-[22px] bg-black relative z-10 "}
          variants={variants}
          animate={selectedId}
          initial={{
            width: "8rem",
            gridTemplateRows: "0fr",
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
        >
          <motion.div layout className="min-h-[2.5rem]">
            <AnimatePresence mode="wait">
              {selectedId === "loading" && (
                <motion.div
                  initial={{ width: "4rem" }}
                  exit={{ width: "10rem" }}
                  className="h-9"
                ></motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {selectedId !== "loading" && (
                <motion.div
                  className="flex justify-start gap-1 px-2 item-center h-10 relative"
                  hidden={selectedId === "large" ? true : false}
                  initial={{ opacity: 0, zIndex: 0 }}
                  animate={{
                    opacity: 1,
                    zIndex: selectedId === "large" ? -1 : 0,
                  }}
                  transition={{ duration: 2, delay: 0.8 }}
                >
                  <div className="h-9 w-9">
                    <Icon3d></Icon3d>
                  </div>

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
                    <AnimatePresence mode="sync">
                      {selectedId === "default" && <motion.p>Expand</motion.p>}
                      {selectedId === "long" && (
                        <motion.p>Expand with some more details</motion.p>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

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
                className={"rounded-[22px] bg-yellow-400 h-10 relative -z-10"}
                initial={{ x: -60, opacity: 0, zIndex: -10 }}
                animate={{ x: 0, opacity: 1, zIndex: 1 }}
                exit={{
                  x: -100,
                  opacity: 0,
                  transition: { delay: 0 },
                  zIndex: -10,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.8,
                }}
              >
                <Button
                  className="rounded-full p-0 h-auto"
                  onClick={() => setSelectedId((prev) => "large")}
                >
                  <Avatar className="aspect-square h-10 w-10">
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
