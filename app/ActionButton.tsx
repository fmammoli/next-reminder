"use client";

import { Button } from "@/components/ui/button";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

export default function ActionButton() {
  const y = useSpring(200);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (y.get() > 5) {
      if (latest > 50) {
        y.set(0);
      }
    }
    if (y.get() <= 5) {
      if (latest < 50) {
        y.set(50);
      }
    }
  });
  return (
    <motion.footer
      initial={{ y: 50 }}
      style={{ y }}
      className="sticky bottom-2 w-fit mx-auto"
    >
      <Button className="w-full">Add Reminder</Button>
    </motion.footer>
  );
}
