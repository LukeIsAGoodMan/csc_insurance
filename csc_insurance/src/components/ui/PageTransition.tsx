import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Cinematic page transition — "lens push" with subtle depth shift.
 * H1 elements inside will inherit the motion cascade.
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 40,
    scale: 0.98,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 1.01,
    filter: "blur(4px)",
  },
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
