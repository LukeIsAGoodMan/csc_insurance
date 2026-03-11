import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface GhostButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const GLOW = {
  primary: "rgba(123, 111, 224, 0.2)",
  secondary: "rgba(29, 29, 31, 0.08)",
};

export function GhostButton({ to, children, variant = "primary" }: GhostButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const base =
    "relative inline-block overflow-hidden rounded-full px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300";

  const variants = {
    primary:
      "border border-accent-trust text-accent-trust hover:bg-accent-trust hover:text-white",
    secondary:
      "border border-primary/15 text-primary/60 hover:border-primary/30 hover:text-primary",
  };

  return (
    <Link
      ref={ref}
      to={to}
      className={`${base} ${variants[variant]}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Radial glow that follows cursor */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${GLOW[variant]}, transparent 65%)`,
        }}
      />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
