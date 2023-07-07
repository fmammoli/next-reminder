"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import React from "react";

import UserAccount from "./UserAccount";
import { useSession } from "next-auth/react";
import BoringAvatar from "boring-avatars";

const HEIGHT = 40;

const islandVariants = {
  default: { width: 200, gridTemplateRows: "0fr" },
  long: { width: "min(40rem, 100%)", gridTemplateRows: "0fr" },
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
    default: { width: "8rem", gridTemplateRows: "0fr" },
    long: { width: "30rem", gridTemplateRows: "0fr" },
    large: { width: "30rem", gridTemplateRows: "1fr" },
  };

  useEffect(() => {
    if (status === "authenticated") {
      setSelectedId("default");
    }
  }, [status]);
  console.log(selectedId);
  return (
    <div className="z-10 absolute top-0 left-0 mt-10 w-full flex justify-center isolate">
      <motion.div
        layout
        className={"grid rounded-[22px] bg-black min-height-[36px] z-1 mr-4"}
        variants={variants}
        animate={selectedId}
        initial={{
          width: "8rem",
          gridTemplateRows: "0fr",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <div className="">
          <AnimatePresence mode="wait">
            {selectedId === "loading" && (
              <motion.div className="h-9"></motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedId === "default" && (
              <motion.div className="flex justify-center item-center h-9">
                <Button
                  className="py-0 h-auto"
                  onClick={() => {
                    {
                      console.log("a");
                      setSelectedId((prev) => {
                        return "long";
                      });
                    }
                  }}
                >
                  Expand
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedId === "long" && (
              <motion.div
                className="flex justify-center item-center h-9"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: 0.2,
                }}
              >
                <Button
                  className="py-0 h-auto ml-4"
                  onClick={() => {
                    {
                      console.log("a");
                      setSelectedId((prev) => {
                        return "default";
                      });
                    }
                  }}
                >
                  Expand
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedId === "large" && (
              <motion.div
                initial={{ gridTemplateRows: "0fr" }}
                animate={{ gridTemplateRows: "1fr" }}
                exit={{ gridTemplateRows: "0fr" }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                className="text-white grid"
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
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {selectedId === "default" && (
          <motion.div
            className={"rounded-[22px] h-9 bg-yellow-400 relative -z-10"}
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x: -200,
              opacity: 0,
              transition: { delay: 0 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.5,
            }}
          >
            <Button
              className="rounded-full p-0 h-auto"
              onClick={() => setSelectedId((prev) => "large")}
            >
              <Avatar className="aspect-square h-9 w-9">
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
  );
}
