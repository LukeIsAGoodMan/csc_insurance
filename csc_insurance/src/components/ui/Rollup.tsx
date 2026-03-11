import { useState, useRef, useEffect, type ReactNode } from "react";

interface RollupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Recursive Roll-up component — Hyper-Premium edition.
 * - Collapsed: clean hairline border
 * - Expanded: backdrop-blur(20px) frosted glass + iridescent border tracking
 * - Smooth spring animation on expand/collapse
 * - Supports nesting
 */
export function Rollup({ title, children, defaultOpen = false }: RollupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const [mouseX, setMouseX] = useState(0.5);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      const timer = setTimeout(() => setHeight(undefined), 400);
      return () => clearTimeout(timer);
    } else {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [open]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX((e.clientX - rect.left) / rect.width);
  };

  // Iridescent gradient position follows mouse X
  const gradientPos = mouseX * 100;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
        open ? "my-2" : "border-b border-border-light"
      }`}
      style={
        open
          ? {
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }
          : undefined
      }
    >
      {/* Iridescent border — visible when expanded */}
      {open && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-700"
          style={{
            background: `linear-gradient(90deg,
              transparent ${gradientPos - 30}%,
              rgba(123, 111, 224, 0.25) ${gradientPos - 10}%,
              rgba(167, 139, 250, 0.35) ${gradientPos}%,
              rgba(96, 165, 250, 0.25) ${gradientPos + 10}%,
              transparent ${gradientPos + 30}%
            )`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
            borderRadius: "0.75rem",
          }}
        />
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between text-left ${
          open ? "px-5 py-5" : "py-5"
        }`}
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
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
        <div className={`pb-6 text-primary/55 leading-relaxed ${open ? "px-5" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
