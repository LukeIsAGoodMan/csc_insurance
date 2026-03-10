import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface LegalGlassContainerProps {
  children: ReactNode;
}

/**
 * Scroll-triggered glassmorphism container for legal text.
 * Makes disclosure statements and privacy policies look like art.
 */

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

export function LegalGlassContainer({ children }: LegalGlassContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative mx-auto max-w-[780px] overflow-hidden rounded-2xl px-6 pb-20"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
      }}
    >
      {/* Top shimmer accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(167,139,250,0.3) 30%, rgba(123,111,224,0.4) 50%, rgba(167,139,250,0.3) 70%, transparent)",
        }}
      />

      {/* Side accent */}
      <div
        className="absolute bottom-0 left-0 top-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(167,139,250,0.2), transparent 30%, transparent 70%, rgba(167,139,250,0.2))",
        }}
      />
      <div
        className="absolute bottom-0 right-0 top-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(167,139,250,0.2), transparent 30%, transparent 70%, rgba(167,139,250,0.2))",
        }}
      />

      <div className="pt-8">{children}</div>
    </motion.div>
  );
}

/** Wrap each Rollup inside a LegalGlassContainer to stagger-animate individually */
export function LegalSection({ children }: { children: ReactNode }) {
  return <motion.div variants={itemVariants}>{children}</motion.div>;
}
