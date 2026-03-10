import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface NumberTickerProps {
  /** Target number to animate toward */
  value: number;
  /** Number of decimal places to display */
  decimals?: number;
  /** Suffix appended after the number (e.g., "%") */
  suffix?: string;
  /** Prefix before the number (e.g., "$") */
  prefix?: string;
  /** Animation duration in ms */
  duration?: number;
  className?: string;
}

/**
 * High-performance number ticker with decimal support.
 * Counts from 0 to target value using requestAnimationFrame.
 * Only triggers when the element scrolls into view.
 */
export function NumberTicker({
  value,
  decimals = 1,
  suffix = "",
  prefix = "",
  duration = 1200,
  className = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(`${prefix}0${decimals > 0 ? "." + "0".repeat(decimals) : ""}${suffix}`);

  useEffect(() => {
    if (!isInView) return;

    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;

      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, decimals, suffix, prefix, duration]);

  return (
    <span
      ref={ref}
      className={`tabular-nums font-semibold text-accent-trust ${className}`}
    >
      {display}
    </span>
  );
}
