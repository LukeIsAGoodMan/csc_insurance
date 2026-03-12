import { useRef, useEffect } from "react";

/* ────────────────────────────────────────────────────────────
   GridBackground — Subtle CSS grid with mouse-tracking parallax.

   z-[1]: above NebulaBackground (z-0), below Canvas (z-[5]).
   40px grid interval, indigo lines at 4% opacity.
   Mouse offset drives ±8px translate via rAF lerp.
   ──────────────────────────────────────────────────────────── */

export function GridBackground() {
  const divRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const LERP = 0.06;
    const RANGE = 8;
    let raf: number;

    function loop() {
      currentRef.current.x += (mouseRef.current.x * RANGE - currentRef.current.x) * LERP;
      currentRef.current.y += (mouseRef.current.y * RANGE - currentRef.current.y) * LERP;
      if (divRef.current) {
        divRef.current.style.transform =
          `translate(${currentRef.current.x.toFixed(2)}px, ${currentRef.current.y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div
        ref={divRef}
        style={{
          position: "absolute",
          inset: "-20px",
          backgroundImage: [
            "linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
