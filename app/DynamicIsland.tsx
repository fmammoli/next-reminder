"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import React from "react";

import UserAccount from "./UserAccount";
import CompactMonthIsland from "./CompactMonthIsland";
import { LongMonthIsland } from "./LongMonthIsland";
import { useSession } from "next-auth/react";
import BoringAvatar from "boring-avatars";
import { BadgeHelp } from "lucide-react";

const HEIGHT = 40;

const islandVariants = {
  default: { width: 200, height: 40 },
  long: { width: "min(40rem, 100%)", height: 40 },
  large: { width: "min(40rem, 100%)", height: "16rem" },
};

export default function DynamicIsland({ children }: { children?: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const willChange = useWillChange();

  const { data: session } = useSession();

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

  return (
    <div className="absolute left-0 px-8 w-full flex justify-center gap-2 rounded-full isolate z-50">
      <motion.div
        className=" bg-black rounded-[22px] shadow-sm drop-shadow-md shadow-slate-600 w-[200px]"
        style={{ willChange }}
        variants={islandVariants}
        initial={{ width: 200 }}
        animate={selectedId === null ? "default" : selectedId}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <AnimatePresence>
          {selectedId === null && (
            <motion.div>
              <CompactMonthIsland
                setSelectedId={setSelectedId}
              ></CompactMonthIsland>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {selectedId === "long" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: 0.1,
                },
              }}
            >
              <LongMonthIsland setSelectedId={setSelectedId}></LongMonthIsland>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedId === "large" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  delay: 0.3,
                },
              }}
              exit={{
                opacity: [0, 0],
              }}
            >
              <UserAccount
                setSelectedId={setSelectedId}
                name={session?.user.name}
                email={session?.user.email}
                image={session?.user.image}
                anonColors={session?.user.randomColors}
                isAnon={session?.user.isAnonymous}
                boringAvatar={boringAvatar}
                isLogged={
                  session?.user.email && !session.user.isAnonymous
                    ? true
                    : false
                }
              ></UserAccount>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {!selectedId && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: 0.4,
              },
            }}
            exit={{
              opacity: 0,
              zIndex: -1,
              transition: {
                type: "spring",
                stiffness: 700,
                damping: 30,
              },
            }}
            className="-z-1 relative flex items-center rounded-full shadow-sm drop-shadow-md shadow-slate-600"
          >
            <Button
              className="p-0 rounded-full overflow-hidden"
              onClick={() => setSelectedId("large")}
            >
              <Avatar className="px-0 items-center text-center aspect-square justify-center">
                {session?.user?.image && (
                  <AvatarImage src={session.user.image} />
                )}
                <AvatarFallback className="text-sm" delayMs={100}>
                  {boringAvatar}
                </AvatarFallback>
              </Avatar>
            </Button>
            {session?.user.isAnonymous && (
              <div className="absolute right-0 -bottom-1 bg-yellow-200 rounded-full">
                <BadgeHelp
                  strokeWidth={2.5}
                  className="black h-4 w-4 rounded-full text-orange-400"
                ></BadgeHelp>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
