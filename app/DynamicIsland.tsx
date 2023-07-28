"use client";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion, useWillChange } from "framer-motion";
import React from "react";
import Icon3d from "./Icon3d";
import MemoIcon3d from "./Icon3d";

const HEIGHT = 40;
export type DynamicIslandStates = "loading" | "default" | "large" | "long";

const variants = {
  loading: {
    width: "4rem",
    gridTemplateRows: "0fr",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10,
    },
  },
  default: {
    width: "10rem",
    gridTemplateRows: "0fr",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  detachedIn: {
    x: "7rem",
    width: "2.5rem",
    opacity: 1,
    gridTemplateRows: "0fr",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: 0.2,
    },
  },
  detachedOut: {
    x: "0rem",
    width: "2.5rem",
    opacity: 0,
    gridTemplateRows: "0fr",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  long: {
    width: "20rem",
    gridTemplateRows: "0fr",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  large: {
    width: "90%",
    gridTemplateRows: "1fr",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

export default function DynamicIsland({
  initial = "loading",
  state = "default",
  onClick,
  setState,
  children,
  className,
  detached = false,
  withIcon = true,
}: {
  initial: DynamicIslandStates;
  state: DynamicIslandStates;
  onClick: () => void;
  setState?: (state: DynamicIslandStates) => void;
  children?: ReactNode;
  className?: string;
  detached?: boolean;
  withIcon?: boolean;
}) {
  const willChange = useWillChange();

  let animation: DynamicIslandStates | "detachedIn" | "detachedOut" = state;
  let initialState: DynamicIslandStates | "detachedIn" | "detachedOut" =
    initial;

  if (detached) {
    initialState = "detachedOut";
    if (state === "default") {
      animation = "detachedIn";
    } else {
      animation = "detachedOut";
    }
  }

  return (
    <motion.div
      layout
      className={`grid text-center max-w-lg text-white transition duration-300 ease-in-out bg-black hover:shadow-lg hover:cursor-pointer ${className}`}
      variants={variants}
      initial={initialState}
      animate={animation}
      style={{ willChange, borderRadius: 22 }}
      onClick={onClick}
    >
      <div className="overflow-y-hidden min-h-[2.5rem] flex flex-start w-full">
        {withIcon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: state === "large" ? 0 : 1,
              visibility: state === "large" ? "hidden" : "visible",
              width: state === "large" ? "0" : "2.5rem",
            }}
            className="relative h-10 w-10"
          >
            <div className="absolute top-0 left-0 h-10 w-10">
              <MemoIcon3d></MemoIcon3d>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </motion.div>
  );
}
