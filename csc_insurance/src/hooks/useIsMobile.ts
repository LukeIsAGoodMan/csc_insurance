import { useState, useEffect } from "react";

/** Returns true on viewports <= 768px. Used to halve 3D complexity on mobile. */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
