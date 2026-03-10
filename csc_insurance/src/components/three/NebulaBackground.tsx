import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRouteColor } from "../../hooks/useRouteColor";

/** Convert 0–1 RGB triplet to CSS-ready "r, g, b" string */
function toRgb(c: [number, number, number]) {
  return `${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}`;
}

/**
 * CSS-only nebula background — zero WebGL contexts.
 * Three soft gradient blobs drift with GPU-accelerated CSS keyframes.
 * Route-aware: colors transition smoothly on navigation.
 * Hue-rotate burst on route change for visual storytelling.
 */
export function NebulaBackground() {
  const { col1, col2, col3 } = useRouteColor();
  const { pathname } = useLocation();
  const [hueRotate, setHueRotate] = useState(0);
  const prevPath = useRef(pathname);

  // Hue-shift burst on route change, decays back to 0
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setHueRotate((prev) => (prev > 0 ? -15 : 15));
      const timer = setTimeout(() => setHueRotate(0), 800);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        filter: `hue-rotate(${hueRotate}deg)`,
        transition: "filter 0.8s ease-out",
      }}
    >
      <div
        className="nebula-blob nebula-blob-1"
        style={{
          background: `radial-gradient(circle, rgba(${toRgb(col1)}, 0.12) 0%, rgba(${toRgb(col1)}, 0.04) 40%, transparent 70%)`,
        }}
      />
      <div
        className="nebula-blob nebula-blob-2"
        style={{
          background: `radial-gradient(circle, rgba(${toRgb(col2)}, 0.10) 0%, rgba(${toRgb(col2)}, 0.03) 40%, transparent 70%)`,
        }}
      />
      <div
        className="nebula-blob nebula-blob-3"
        style={{
          background: `radial-gradient(circle, rgba(${toRgb(col3)}, 0.09) 0%, rgba(${toRgb(col3)}, 0.03) 40%, transparent 70%)`,
        }}
      />
    </div>
  );
}
