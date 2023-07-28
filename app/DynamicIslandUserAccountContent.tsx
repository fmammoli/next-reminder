import { motion, useWillChange } from "framer-motion";
import { ReactNode } from "react";

export default function DynamicIslandUserAccountContent({
  children,
}: {
  children?: ReactNode;
}) {
  const willChange = useWillChange();
  return (
    <motion.div
      className="p-1 w-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }}
      exit={{ opacity: 0, scale: 0 }}
      style={{ willChange }}
    >
      {children}
    </motion.div>
  );
}
