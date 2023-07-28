import { motion, useWillChange } from "framer-motion";
import Icon3d from "./Icon3d";
import { ReactNode } from "react";

export default function DynamicIslandDefaultContent({
  children,
}: {
  children?: ReactNode;
}) {
  const willChange = useWillChange();
  return (
    <motion.div
      className="flex justify-start items-center gap-1 pl-1 h-10 whitespace-nowrap"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ willChange }}
    >
      {children}
    </motion.div>
  );
}
