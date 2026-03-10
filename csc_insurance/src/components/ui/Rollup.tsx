import { useState, useRef, useEffect, type ReactNode } from "react";

interface RollupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Recursive Roll-up component.
 * Content blocks are collapsed by default with smooth spring animation on expand/collapse.
 * Supports nesting — place <Rollup> inside <Rollup> for recursive behavior.
 */
export function Rollup({ title, children, defaultOpen = false }: RollupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      // After animation, set to auto so nested content can expand
      const timer = setTimeout(() => setHeight(undefined), 400);
      return () => clearTimeout(timer);
    } else {
      // First set to explicit height, then to 0 for animation
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [open]);

  return (
    <div className="border-b border-border-light">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium tracking-tight text-primary/80 md:text-lg">
          {title}
        </span>
        <span
          className={`ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center text-primary/30 transition-transform duration-400 ${
            open ? "rotate-45" : ""
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-400"
        style={{
          height: height !== undefined ? `${height}px` : "auto",
          transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          opacity: open ? 1 : 0,
          transitionProperty: "height, opacity",
        }}
      >
        <div className="pb-6 text-primary/55 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
