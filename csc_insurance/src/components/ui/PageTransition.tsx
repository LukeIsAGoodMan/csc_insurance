import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Cinematic page transition — "lens push" + aurora flash.
 * On enter: full-screen blue-violet glow fades in then out behind the content.
 * On exit: content pushes away with subtle blur.
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

// Aurora glow overlay — fades in quickly then out slowly
const auroraVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0.12, 0],
    transition: { duration: 1.2, times: [0, 0.2, 1], ease: "easeOut" as const },
  },
  exit: { opacity: 0 },
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="relative"
    >
      {/* Aurora flash overlay */}
      <motion.div
        variants={auroraVariants}
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(123,111,224,0.25) 0%, rgba(167,139,250,0.1) 40%, transparent 70%)",
        }}
      />

      {children}
    </motion.div>
  );
}
