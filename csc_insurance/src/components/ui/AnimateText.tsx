import { motion } from "framer-motion";

interface AnimateTextProps {
  /** The text to animate character-by-character */
  text: string;
  /** HTML tag to render — always "h1" for page titles */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Delay before the first character starts animating (seconds) */
  delay?: number;
  /** Time between each character (seconds) */
  stagger?: number;
}

const charVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
};

/**
 * Per-character entrance animation.
 * Each character fades in from blur(12px) + y:10 with staggered timing.
 * Spaces are preserved as non-animated spacers.
 */
export function AnimateText({
  text,
  as: Tag = "h1",
  className = "",
  delay = 0.2,
  stagger = 0.03,
}: AnimateTextProps) {
  // Split into characters, preserving spaces
  const chars = text.split("");

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline-block"
        aria-hidden="true"
      >
        {chars.map((char, i) =>
          char === " " ? (
            <span key={i} className="inline-block w-[0.25em]" />
          ) : (
            <motion.span
              key={i}
              variants={charVariants}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ),
        )}
      </motion.span>
    </Tag>
  );
}
