import { useState, useRef, useCallback, type ReactNode } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Glassmorphism 2.0 card with iridescent hover border + trailing light-dot.
 * - backdrop-blur(40px) + bg-white/10 + border-white/30
 * - Mouse-tracking gradient border on hover
 * - Blue-purple light point that follows cursor with spring-based inertia
 */
export function GlassCard({ children, className = "" }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  // Spring-lagged dot position (pixels relative to card)
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const springX = useSpring(dotX, { stiffness: 120, damping: 18, mass: 0.8 });
  const springY = useSpring(dotY, { stiffness: 120, damping: 18, mass: 0.8 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
      dotX.set(e.clientX - rect.left);
      dotY.set(e.clientY - rect.top);
    },
    [dotX, dotY],
  );

  // Iridescent gradient angle follows mouse position
  const angle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5) * (180 / Math.PI) + 180;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
      }}
    >
      {/* Iridescent border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(${angle}deg,
            rgba(123, 111, 224, 0.4) 0%,
            rgba(167, 139, 250, 0.3) 25%,
            rgba(96, 165, 250, 0.3) 50%,
            rgba(123, 111, 224, 0.4) 75%,
            rgba(192, 132, 252, 0.3) 100%
          )`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
          borderRadius: "1rem",
        }}
      />

      {/* Static border (visible when not hovered) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0 : 1,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      />

      {/* Trailing light-dot with spring physics */}
      <motion.div
        className="pointer-events-none absolute z-20"
        style={{
          x: springX,
          y: springY,
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(96, 165, 250, 0.3) 40%, transparent 70%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          filter: "blur(8px)",
        }}
      />

      {/* Subtle inner glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700"
        style={{
          opacity: isHovered ? 0.15 : 0,
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%,
            rgba(167, 139, 250, 0.3),
            transparent 60%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
