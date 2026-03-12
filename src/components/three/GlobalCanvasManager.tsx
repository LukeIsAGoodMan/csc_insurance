import { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useScenePulse } from "../../hooks/useScenePulse";
import { useSceneVisibility } from "../../hooks/useSceneVisibility";
import { AutoScene } from "./AutoHero3D";
import { HomeScene } from "./HomePrism3D";
import { BusinessScene } from "./DataOrbit3D";
import { TravelScene } from "./CrystalGlobe";
import { DigitalGlobeScene } from "./DigitalGlobe3D";

/* ────────────────────────────────────────────────────────────
   GlobalCanvasManager — Singleton WebGL Canvas.

   Architecture:
   ✅ ONE Canvas, permanently mounted at App root (outside Routes)
   ✅ useSceneVisibility hook: fade state machine + SCENE_MAP
   ✅ DisposableGroup: geometry + material + texture + RT disposal
   ✅ SceneGuard: useFrame wipe when no product page active
   ✅ ScrollParallax: 3D scenes drift at 0.4x scroll speed
   ✅ z-[5] layer — H1 behind canvas, subtitle above
   ✅ 3 context losses → static gradient fallback
   ──────────────────────────────────────────────────────────── */

/* ── Suppress THREE.Clock deprecation (R3F creates it internally) ── */
const _warn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("Clock")) return;
  _warn.apply(console, args);
};

/* ── Per-scene camera configs ── */
const CAM: Record<string, { pos: [number, number, number]; fov: number }> = {
  auto: { pos: [0, 0, 5.5], fov: 42 },
  home: { pos: [0, 1.2, 4.5], fov: 40 },
  business: { pos: [0, 1.5, 5.5], fov: 42 },
  travel: { pos: [0, 0, 5.5], fov: 45 },
  globe: { pos: [0, 0.3, 4.2], fov: 45 },
};

/* ── Camera controller ── */
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

/* ── Nuclear disposal — geometry + material + texture + renderTarget ── */
function nuclearDispose(group: THREE.Object3D) {
  group.traverse((child) => {
    if ("geometry" in child && child.geometry) {
      (child.geometry as THREE.BufferGeometry).dispose();
    }
    if ("material" in child && child.material) {
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      for (const mat of mats as THREE.Material[]) {
        for (const key of Object.keys(mat)) {
          const val = (mat as unknown as Record<string, unknown>)[key];
          if (val instanceof THREE.Texture) val.dispose();
        }
        mat.dispose();
      }
    }
    if ("renderTarget" in child) {
      const rt = (child as Record<string, unknown>).renderTarget;
      if (rt instanceof THREE.WebGLRenderTarget) rt.dispose();
    }
  });
}

/* ── Disposal wrapper — keyed to force unmount/remount on scene change ── */
function DisposableGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useEffect(() => {
    const group = ref.current;
    return () => {
      if (group) nuclearDispose(group);
    };
  }, []);
  return <group ref={ref}>{children}</group>;
}

/* ── Scene guard — wipes lingering GPU objects when no scene is active ── */
function SceneGuard({ active }: { active: boolean }) {
  const { scene } = useThree();
  const wasActive = useRef(active);
  useFrame(() => {
    if (wasActive.current && !active) {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh ||
          child instanceof THREE.Line ||
          child instanceof THREE.Points
        ) {
          child.geometry?.dispose();
          const mat = child.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else if (mat) (mat as THREE.Material).dispose();
        }
      });
    }
    wasActive.current = active;
  });
  return null;
}

/* ── Scroll parallax — 3D scenes drift at 0.4x scroll speed ── */
function ScrollParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!);
  const current = useRef(0);
  useFrame(() => {
    const target = window.scrollY * 0.002;
    current.current += (target - current.current) * 0.1;
    if (groupRef.current) {
      groupRef.current.position.y = -current.current;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

/* ── Exclusive scene renderer — only ONE scene at a time ── */
function ActiveScene({
  scene,
  isMobile,
  pulse,
  celebration,
}: {
  scene: string;
  isMobile: boolean;
  pulse: number;
  celebration: number;
}) {
  switch (scene) {
    case "auto":
      return <AutoScene isMobile={isMobile} pulse={pulse} />;
    case "home":
      return <HomeScene isMobile={isMobile} />;
    case "business":
      return <BusinessScene isMobile={isMobile} />;
    case "travel":
      return <TravelScene isMobile={isMobile} />;
    case "globe":
      return <DigitalGlobeScene isMobile={isMobile} celebration={celebration} />;
    default:
      return null;
  }
}

/* ── Main singleton Canvas ── */
export function GlobalCanvasManager() {
  const isMobile = useIsMobile();
  const { pulse, celebration } = useScenePulse();
  const { displayScene, containerOpacity } = useSceneVisibility();
  const [ctxLost, setCtxLost] = useState(0);

  const fallback = ctxLost >= 3;

  /* After 3 context losses → static gradient, no WebGL */
  if (fallback && displayScene) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[5]">
        <div className="h-full w-full bg-gradient-to-br from-indigo-950/20 via-transparent to-violet-950/10" />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{
        opacity: containerOpacity,
        transition: "opacity 0.5s ease",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        style={{
          background: "transparent",
          pointerEvents: displayScene === "globe" && !isMobile ? "auto" : "none",
          touchAction: displayScene === "globe" ? "none" : "auto",
        }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
        dpr={[1, isMobile ? 1 : 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setCtxLost((n) => n + 1);
          });
        }}
      >
        <SceneGuard active={!!displayScene} />

        {displayScene && (
          <>
            <SceneCamera scene={displayScene} />
            <ambientLight intensity={displayScene === "travel" || displayScene === "globe" ? 0.3 : 0.2} />
            <ScrollParallax>
              <DisposableGroup key={displayScene}>
                <ActiveScene scene={displayScene} isMobile={isMobile} pulse={pulse} celebration={celebration} />
              </DisposableGroup>
            </ScrollParallax>
          </>
        )}
      </Canvas>
    </div>
  );
}
