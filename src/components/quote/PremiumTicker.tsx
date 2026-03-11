import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   PremiumTicker — Smooth value-to-value animated counter.

   Unlike NumberTicker (which counts from 0), this interpolates
   from the previous value to the new value on every change.
   ──────────────────────────────────────────────────────────── */

interface PremiumTickerProps {
  value: number;
  duration?: number;
  className?: string;
}

export function PremiumTicker({ value, duration = 800, className = "" }: PremiumTickerProps) {
  const prevRef = useRef(0);
  const [display, setDisplay] = useState("$0.00");

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;

      setDisplay(`$${current.toFixed(2)}`);

      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        prevRef.current = to;
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={`tabular-nums font-semibold text-accent-trust ${className}`}>
      {display}
    </span>
  );
}
