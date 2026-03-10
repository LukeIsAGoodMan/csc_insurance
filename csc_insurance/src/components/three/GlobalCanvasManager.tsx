import { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";
import { AutoScene } from "./AutoHero3D";
import { HomeScene } from "./HomePrism3D";
import { BusinessScene } from "./DataOrbit3D";
import { TravelScene } from "./CrystalGlobe";

/* ────────────────────────────────────────────────────────────
   GlobalCanvasManager — Singleton WebGL Canvas.
   ONE Canvas lives permanently in MainLayout.
   Scene content switches based on the active route.
   Geometry + material disposal on every scene transition.
   After 3 context-loss events → static gradient fallback.
   ──────────────────────────────────────────────────────────── */

/* ── Suppress THREE.Clock deprecation (R3F creates it internally) ── */
const _warn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("Clock")) return;
  _warn.apply(console, args);
};

/* ── Route → scene key ── */
const SCENE_MAP: Record<string, string> = {
  "/auto-insurance": "auto",
  "/home-insurance": "home",
  "/business-insurance": "business",
  "/travel-insurance": "travel",
};

/* ── Per-scene camera configs ── */
const CAM: Record<string, { pos: [number, number, number]; fov: number }> = {
  auto: { pos: [0, 0, 5.5], fov: 42 },
  home: { pos: [0, 1.2, 4.5], fov: 40 },
  business: { pos: [0, 1.5, 5.5], fov: 42 },
  travel: { pos: [0, 0, 5.5], fov: 45 },
};

/* ── Camera controller — adjusts position + fov per scene ── */
function SceneCamera({ scene }: { scene: string }) {
  const { camera } = useThree();

  useEffect(() => {
    const cfg = CAM[scene];
    if (!cfg) return;
    camera.position.set(...cfg.pos);
    const pCam = camera as THREE.PerspectiveCamera;
    pCam.fov = cfg.fov;
    pCam.updateProjectionMatrix();
  }, [scene, camera]);

  return null;
}

/* ── Disposal wrapper — frees all GPU resources on unmount ── */
function DisposableGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    const group = ref.current;
    return () => {
      group?.traverse((child) => {
        const obj = child as THREE.Mesh;
        if (obj.geometry && typeof obj.geometry.dispose === "function") {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (typeof (obj.material as THREE.Material).dispose === "function") {
            (obj.material as THREE.Material).dispose();
          }
        }
      });
    };
  }, []);

  return <group ref={ref}>{children}</group>;
}

/* ── Scene renderer — key forces full unmount/remount on switch ── */
function SceneContent({ scene, isMobile }: { scene: string; isMobile: boolean }) {
  return (
    <DisposableGroup>
      {scene === "auto" && <AutoScene isMobile={isMobile} />}
      {scene === "home" && <HomeScene isMobile={isMobile} />}
      {scene === "business" && <BusinessScene isMobile={isMobile} />}
      {scene === "travel" && <TravelScene isMobile={isMobile} />}
    </DisposableGroup>
  );
}

/* ── Main singleton Canvas ── */
export function GlobalCanvasManager() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [ctxLost, setCtxLost] = useState(0);

  const activeScene = SCENE_MAP[pathname] ?? null;
  const fallback = ctxLost >= 3;

  /* After 3 context losses → static gradient, no more WebGL */
  if (fallback && activeScene) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="h-full w-full bg-gradient-to-br from-indigo-950/20 via-transparent to-violet-950/10" />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[1]"
      style={{
        opacity: activeScene ? 0.7 : 0,
        pointerEvents: activeScene ? "auto" : "none",
        transition: "opacity 0.8s ease",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
        dpr={[1, isMobile ? 1 : 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setCtxLost((n) => n + 1);
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            /* R3F re-initializes internally after preventDefault */
          });
        }}
      >
        {activeScene && (
          <>
            <SceneCamera scene={activeScene} />
            <SceneContent key={activeScene} scene={activeScene} isMobile={isMobile} />
            <OrbitControls
              key={activeScene}
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.35}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
